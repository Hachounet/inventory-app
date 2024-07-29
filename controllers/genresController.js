const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

// ERRORS //

const lengthErr = " must be between 1 and 100 characters";

const validatePassword = [
  body("secretpassword")
    .exists()
    .withMessage("Password is required")
    .custom((value) => {
      const expectedPassword = "abcd1234";
      if (value !== expectedPassword) {
        throw new Error("Incorrect password, try again.");
      }
      return true;
    }),
];

const validateGenre = [
  body("genre")
    .custom(async (value) => {
      const nameExists = await db.checkIfGenreNameExists(value);
      if (nameExists) {
        throw new Error("Genre with this name already exists.");
      }
      return true;
    })
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Genre ${lengthErr}`)
    .escape(),
];

exports.getGenresPage = asyncHandler(async (req, res, next) => {
  console.log("Genre page");
  console.log(req.params.id);
  const baseURL = req.baseUrl.toString(); // For tools partials
  const genreInfos = await db.getGenre(req.params.id);
  const albumsRelated = await db.getAlbumsFromGenre(req.params.id);

  console.log(genreInfos);

  res.render("genre", {
    title: "Value of genre",
    id: req.params.id,
    baseURL: baseURL,
    genreInfo: genreInfos[0],
    albumsRelated: albumsRelated,
  });
});

exports.getGenresCreatePage = asyncHandler(async (req, res, next) => {
  console.log("Genre Creation page");
  const dynamicPath = "Create";

  res.render("genre_form", {
    title: "Genre",
    id: undefined,
    dynamicPath: dynamicPath,
    genre: [],
  });
});

exports.postGenresCreatePage = [
  validateGenre,
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    const dynamicPath = "Create";
    if (!errors.isEmpty()) {
      return res.status(400).render("genre_form", {
        title: "genre",
        dynamicPath: dynamicPath,
        errors: errors.array(),
        id: undefined,
        genre: [],
      });
    }
    const genreData = {
      name: req.body.genre,
    };

    const resultID = await db.insertGenre(genreData.name);
    res.redirect(`/genres/${resultID}`);
  }),
];

exports.getGenresDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Genre Delete page");

  const genreInfo = await db.getGenre(req.params.id);

  res.render("genre_delete", {
    title: "Delete genre",
    id: req.params.id,
    dynaData: genreInfo[0],
    baseUrl: req.baseUrl,
  });
});

exports.postGenresDeletePage = [
  validatePassword,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genreInfo = await db.getAlbum(req.params.id);
      return res.status(400).render("genre_delete", {
        title: "Delete genre",
        id: req.params.id,
        dynaData: genreInfo[0],
        baseUrl: req.baseUrl,
      });
    }
    await db.deleteGenre(req.params.id);
    res.redirect("/category/genres");
  }),
];

exports.getGenresUpdatePage = asyncHandler(async (req, res, next) => {
  console.log("GET Genre Update page");

  const dynamicPath = "Update";

  const result = await db.getGenre(req.params.id);

  res.render("genre_form", {
    title: "Genre",
    id: req.params.id,
    dynamicPath: dynamicPath,
    genre: result[0],
  });
});

exports.postGenresUpdatePage = [
  validatePassword,
  validateGenre,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const dynamicPath = "Update";

    if (!errors.isEmpty()) {
      const result = await db.getGenre(req.params.id);

      return res.status(400).render("genre_form", {
        title: "Genre",
        id: req.params.id,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        genre: result[0],
      });
    }
    const genreData = {
      id: req.params.id,
      name: req.body.genre,
    };

    console.log(req.body);

    await db.updateGenre(genreData.name, genreData.id);
    res.redirect(`/genres/${req.params.id}`);
  }),
];
