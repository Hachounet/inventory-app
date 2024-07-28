const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

// ERRORS //

const priceErr = "Price must be between 1 and 1000 $";
const stockErr = "Stock must be between 1 and 1000 $";
const barcodeErr = "Barcode must be exactly 9 digits";
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

const validateRelease = [
  body("price")
    .trim()
    .isFloat({ min: 1, max: 1000 })
    .withMessage(priceErr)
    .escape(),
  body("stock")
    .trim()
    .isFloat({ min: 1, max: 1000 })
    .withMessage(stockErr)
    .escape(),
  body("barcode")
    .trim()
    .matches(/^\d{9}$/)
    .withMessage(barcodeErr)
    .custom(async (value) => {
      const releaseExists = await db.checkIfReleaseExists(value);
      if (releaseExists) {
        throw new Error("Release with this barcode already exists.");
      }
      return true;
    }),
];

const validateUpdate = [
  body("price")
    .trim()
    .isFloat({ min: 1, max: 1000 })
    .withMessage(priceErr)
    .escape(),
  body("stock")
    .trim()
    .isFloat({ min: 1, max: 1000 })
    .withMessage(stockErr)
    .escape(),
  body("barcode")
    .trim()
    .matches(/^\d{9}$/)
    .withMessage(barcodeErr),
];

exports.getReleasesPage = asyncHandler(async (req, res, next) => {
  console.log("Release page");
  console.log(req.params);
  const baseURL = req.baseUrl.toString();
  const releaseInfo = await db.getRelease(req.params.id);
  console.log(releaseInfo);
  res.render("release", {
    title: "Value of release",
    id: req.params.id,
    baseURL: baseURL,
    releaseInfo: releaseInfo[0],
  });
});

exports.getReleasesCreatePage = asyncHandler(async (req, res, next) => {
  console.log("Release Creation page");
  const dynamicPath = "Create";
  const allAlbums = await db.getAllAlbums();
  res.render("release_form", {
    title: "Release",
    id: undefined,
    dynamicPath: dynamicPath,
    albums: allAlbums,
    release: [],
  });
});

exports.postReleasesCreatePage = [
  validateRelease,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const dynamicPath = "Create";
    const allAlbums = await db.getAllAlbums();
    if (!errors.isEmpty()) {
      return res.status(400).render("release_form", {
        title: "Release",
        dynamicPath: dynamicPath,
        errors: errors.array(),
        id: undefined,
        release: [],
        albums: allAlbums,
      });
    }
    const releaseData = {
      albumID: req.body.album_name,
      format: req.body.format,
      price: req.body.price,
      stock: req.body.stock,
      barcode: req.body.barcode,
    };

    const resultID = await db.insertRelease(
      releaseData.albumID,
      releaseData.format,
      releaseData.price,
      releaseData.stock,
      releaseData.barcode,
    );
    res.redirect(`/releases/${resultID}`);
  }),
];

exports.getReleasesDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Release Delete page");
  const releaseInfo = await db.getRelease(req.params.id);

  res.render("release_delete", {
    title: "Delete release",
    id: req.params.id,
    dynaData: releaseInfo[0],
    baseUrl: req.baseUrl,
  });
});

exports.postReleasesDeletePage = [
  validatePassword,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const releaseInfo = await db.getRelease(req.params.id);
      return res.status(400).render("release_delete", {
        title: "Delete release",
        id: req.params.id,
        dynaData: releaseInfo[0],
        baseUrl: req.baseUrl,
      });
    }
    await db.deleteRelease(req.params.id);
    res.redirect("/category/releases");
  }),
];

exports.getReleasesUpdatePage = asyncHandler(async (req, res, next) => {
  console.log("GET Release Update page");

  const dynamicPath = "Update";

  const result = await db.getRelease(req.params.id);
  const allAlbums = await db.getAllAlbums();

  res.render("release_form", {
    title: "Release",
    id: req.params.id,
    dynamicPath: dynamicPath,
    release: result[0],
    albums: allAlbums,
  });
});

exports.postReleasesUpdatePage = [
  validatePassword,
  validateUpdate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const dynamicPath = "Update";

    if (!errors.isEmpty()) {
      const result = await db.getRelease(req.params.id);
      const allAlbums = await db.getAllAlbums();
      return res.status(400).render("release_form", {
        title: "Release",
        id: req.params.id,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        release: result[0],
        albums: allAlbums,
      });
    }

    const releaseData = {
      id: req.params.id,
      albumID: req.body.album_name,
      format: req.body.format,
      price: req.body.price,
      stock: req.body.stock,
      barcode: req.body.barcode,
    };

    await db.updateRelease(
      releaseData.id,
      releaseData.albumID,
      releaseData.format,
      releaseData.price,
      releaseData.stock,
      releaseData.barcode,
    );

    res.redirect(`/releases/${req.params.id}`);
  }),
];
