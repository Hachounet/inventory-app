const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const { format } = require("date-fns");
const { id } = require("date-fns/locale");

// ERRORS //

const lengthErr = "title must be between 1 and 100 characters";
const dateBeforeTodayErr = "Date cannot be today, after today or undefined.";
const urlErr = "must be between 1 and 255 characters";
const urlErrFormat = " must be in URL format (example.com/image.png)";

const validatePassword = [
  body("secretpassword")
    .exists()
    .withMessage("Password is required")
    .custom((value) => {
      const expectedPassword = "abcd1234";
      if (value !== expectedPassword) {
        throw new Error("Incorrect password. Try again.");
      }
      return true;
    }),
];

const validateAlbum = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Album ${lengthErr}`)
    .escape(),
  body("releasedate")
    .isBefore(new Date().toISOString())
    .withMessage(dateBeforeTodayErr),
  body("imageURL")
    .trim()
    .isURL()
    .withMessage(`URL ${urlErrFormat}`)
    .isLength({ min: 1, max: 255 })
    .withMessage(`URL ${urlErr}`),
];

function formatReleaseDate(album) {
  if (album.releasedate) {
    album.releasedate = format(new Date(album.releasedate), "yyyy-MM-dd");
  }
  return album;
}

exports.getAlbumsPage = asyncHandler(async (req, res, next) => {
  console.log("Album page");
  const baseURL = req.baseUrl.toString(); // For tools partials
  const result = await db.getAlbum(req.params.id);
  const formattedAlbum = result.map(formatReleaseDate);
  res.render("album", {
    title: "Value of album",
    id: req.params.id,
    baseURL: baseURL,
    albumInfo: formattedAlbum[0],
  });
});

exports.getAlbumsCreatePage = asyncHandler(async (req, res, next) => {
  console.log("Album Creation page");
  const dynamicPath = "Create";
  const allArtists = await db.getAllArtists();
  const allGenres = await db.getAllGenres();
  const allLabels = await db.getAllLabels();
  res.render("album_form", {
    title: "album",
    id: undefined,
    dynamicPath: dynamicPath,
    album: [],
    genres: allGenres,
    artists: allArtists,
    labels: allLabels,
  });
});

exports.postAlbumsCreatePage = [
  validateAlbum,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const dynamicPath = "Create";

    if (!errors.isEmpty()) {
      const allArtists = await db.getAllArtists();
      const allGenres = await db.getAllGenres();
      const allLabels = await db.getAllLabels();
      return res.status(400).render("album_form", {
        title: "album",
        id: undefined,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        album: [],
        genres: allGenres,
        artists: allArtists,
        labels: allLabels,
      });
    }
    console.log(req.body);
    const albumData = {
      title: req.body.title,
      artistID: req.body.artist,
      releasedate: req.body.releasedate,
      genre: req.body.genre,
      label: req.body.label,
      imageURL: req.body.imageURL,
    };

    const albumID = await db.insertAlbum(
      albumData.title,
      albumData.artistID,
      albumData.releasedate,
      albumData.genre,
      albumData.label,
      albumData.imageURL,
    );

    res.redirect(`/albums/${albumID}`);
  }),
];

exports.getAlbumsDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Album Delete page");
  const albumInfo = await db.getAlbum(req.params.id);

  res.render("album_delete", {
    title: "Delete album",
    id: req.params.id,
    dynaData: albumInfo[0],
    baseUrl: req.baseUrl,
  });
});

exports.postAlbumsDeletePage = [
  validatePassword,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const albumInfo = await db.getAlbum(req.params.id);
      return res.status(400).render("album_delete", {
        title: "Delete album",
        id: req.params.id,
        dynaData: albumInfo[0],
        errors: errors.array(),
      });
    }
    await db.deleteAlbum(req.params.id);
    res.redirect("/category/albums");
  }),
];

exports.getAlbumsUpdatePage = asyncHandler(async (req, res, next) => {
  const dynamicPath = "Update";
  const result = await db.getAlbum(req.params.id);
  const allArtists = await db.getAllArtists();
  const allGenres = await db.getAllGenres();

  const allLabels = await db.getAllLabels();
  const formattedAlbum = result.map(formatReleaseDate);
  res.render("album_form", {
    title: "Album",
    id: req.params.id,
    dynamicPath: dynamicPath,
    album: formattedAlbum[0],
    artists: allArtists,
    genres: allGenres,
    labels: allLabels,
  });
});

exports.postAlbumsUpdatePage = [
  validatePassword,
  validateAlbum,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const dynamicPath = "Update";

    if (!errors.isEmpty()) {
      const result = await db.getAlbum(req.params.id);
      const allArtists = await db.getAllArtists();
      const allGenres = await db.getAllGenres();
      const allLabels = await db.getAllLabels();
      const formattedAlbum = result.map(formatReleaseDate);

      return res.status(400).render("album_form", {
        title: "album",
        id: req.params.id,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        album: formattedAlbum[0],
        genres: allGenres,
        labels: allLabels,
        artists: allArtists,
      });
    }

    const albumData = {
      id: req.params.id,
      artist_id: req.body.artist,
      title: req.body.title,
      releasedate: req.body.releasedate,
      labelID: req.body.label,
      genreID: req.body.genre,
      imageURL: req.body.imageURL,
    };

    await db.updateAlbum(
      albumData.id,
      albumData.artist_id,
      albumData.title,
      albumData.releasedate,
      albumData.labelID,
      albumData.genreID,
      albumData.imageURL,
    );

    res.redirect(`/albums/${req.params.id}`);
  }),
];
