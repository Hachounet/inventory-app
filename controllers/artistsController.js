const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const { format } = require("date-fns");

// ERRORS //

const lengthErr = "must be between 1 and 30 characters.";
const dateBeforeTodayErr =
  "Date cannot be today,after today, or undefined if date of birth.";
const urlErr = "must be between 1 and 255 characters.";
const urlErrFormat = "must be in URL format (example.com/image.png)";

function formatArtistDate(artist) {
  if (artist.dateb) {
    artist.dateb = format(new Date(artist.dateb), "yyyy-MM-dd");
  }
  if (artist.dated) {
    artist.dated = format(new Date(artist.dated), "yyyy-MM-dd");
  }
  return artist;
}

const cleanBody = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  });
  next();
};

const validateDelete = [
  body("secretpassword")
    .exists()
    .withMessage("Password is required.")
    .custom((value) => {
      const expectedPassword = "abcd1234";
      if (value !== expectedPassword) {
        throw new Error("Incorrect password, try again.");
      }
      return true;
    }),
];

const validateArtist = [
  body("firstname")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`First name ${lengthErr}`)
    .escape(),
  body("lastname")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Lastname ${lengthErr}`)
    .escape(),
  body("dateb")
    .isBefore(new Date().toISOString())
    .withMessage(dateBeforeTodayErr),
  body("dated")
    .optional({ checkFalsy: true })
    .isBefore(new Date().toISOString())
    .withMessage(dateBeforeTodayErr),
  body("country").exists(),
  body("imageURL")
    .trim()
    .isURL()
    .withMessage(`URL ${urlErrFormat}`)
    .isLength({ min: 1, max: 255 })
    .withMessage(`URL ${urlErr}`),
  body("secretpassword")
    .exists()
    .withMessage("Password is required.")
    .custom((value) => {
      // Vérifiez ici si le mot de passe correspond à ce que vous attendez
      const expectedPassword = "abcd1234"; // Remplacez ceci par la valeur attendue ou récupérez-la depuis une source sécurisée
      if (value !== expectedPassword) {
        throw new Error("Incorrect password, try again.");
      }
      return true;
    }),
];

exports.getArtistsPage = asyncHandler(async (req, res, next) => {
  console.log("Artist page");
  const baseURL = req.baseUrl.toString(); // For tools partials
  const result = await db.getArtist(req.params.id);
  const albumsResult = await db.getAlbumsOfArtist(req.params.id);
  const formattedArtist = result.map(formatArtistDate); // Result is an array containing object with properties with formattedDate
  res.render("artist", {
    title: "Value of artist",
    id: req.params.id,
    baseURL: baseURL,
    artistInfo: formattedArtist[0],
    albums: albumsResult,
  });
});

exports.getArtistsCreatePage = asyncHandler(async (req, res, next) => {
  console.log("Artist Creation page");

  const dynamicPath = "Create";
  console.log(dynamicPath);
  res.render("artist_form", {
    title: "artist",
    id: undefined,
    dynamicPath: dynamicPath,
    artist: [],
  });
});

exports.postArtistsCreatePage = [
  validateArtist,
  cleanBody,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const pathString = req.path.toString().slice(1);
    const dynamicPath =
      pathString.charAt(0).toUpperCase() + pathString.slice(1);
    if (!errors.isEmpty()) {
      return res.status(400).render("artist_form", {
        title: "artists",
        dynamicPath: dynamicPath,
        errors: errors.array(),
      });
    }

    const artistData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname || null,
      dateb: req.body.dateb,
      dated: req.body.dated || null,
      country: req.body.country,
      imageURL: req.body.imageURL,
    };

    const resultID = await db.insertArtist(
      artistData.firstname,
      artistData.lastname,
      artistData.dateb,
      artistData.dated,
      artistData.country,
      artistData.imageURL,
    );

    res.redirect(`/artists/${resultID}`);
  }),
];

exports.getArtistsDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Artist Delete page");

  const artistInfo = await db.getArtist(req.params.id);
  console.log(artistInfo);
  res.render("artist_delete", {
    title: "Delete artist",
    id: req.params.id,
    dynaData: artistInfo[0],
    baseUrl: req.baseUrl,
  });
});

exports.postArtistsDeletePage = [
  validateDelete,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.baseUrl);
    if (!errors.isEmpty()) {
      const artistInfo = await db.getArtist(req.params.id);
      return res.status(400).render("artist_delete", {
        title: "artist",
        id: req.params.id,
        dynaData: artistInfo[0],
        errors: errors.array(),
        baseUrl: req.baseUrl,
      });
    }
    await db.deleteArtist(req.params.id);
    res.redirect("/category/artists");
  }),
];

exports.getArtistsUpdatePage = asyncHandler(async (req, res, next) => {
  console.log("GET Artists Update page");
  console.log(req);

  const dynamicPath = "Update";

  const result = await db.getArtist(req.params.id);
  const formattedArtist = result.map(formatArtistDate); // Result is an array containing object with properties with formattedDate

  res.render("artist_form", {
    title: "Artist",
    id: req.params.id,
    dynamicPath: dynamicPath,
    artist: formattedArtist[0],
  });
});

exports.postArtistsUpdatePage = [
  validateArtist,
  cleanBody,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const dynamicPath = "Update";

    if (!errors.isEmpty()) {
      const result = await db.getArtist(req.params.id);
      const formattedArtist = result.map(formatArtistDate); // Result is an array containing object with properties with formattedDate

      return res.status(400).render("artist_form", {
        title: "artist",
        id: req.params.id,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        artist: formattedArtist[0],
      });
    }
    console.log(req.params);
    const artistData = {
      id: req.params.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname || null,
      dateb: req.body.dateb,
      dated: req.body.dated || null,
      country: req.body.country,
      imageURL: req.body.imageURL,
    };

    await db.updateArtist(
      artistData.id,
      artistData.firstname,
      artistData.lastname,
      artistData.dateb,
      artistData.dated,
      artistData.country,
      artistData.imageURL,
    );

    res.redirect(`/artists/${req.params.id}`);
  }),
];
