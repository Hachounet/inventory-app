const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

// ERRORS //

const lengthErr = "must be between 1 and 100 characters";
const dateErr = "must be only numerical values";

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

const validateLabel = [
  body("name")
    .custom(async (value) => {
      const labelExists = await db.checkIfLabelNameExists(value);
      if (labelExists) {
        throw new Error("Label with this name already exists.");
      }
      return true;
    })
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Genre ${lengthErr}`)
    .escape(),
  body("foundedyear")
    .isAlphanumeric()
    .withMessage(`Founded year ${dateErr}`)
    .custom((value) => {
      const currentYear = new Date().getFullYear();
      const year = parseInt(value, 10);
      if (isNaN(year) || year > currentYear) {
        throw new Error("Founded year cannot be in the future.");
      }
      return true;
    }),
];

exports.getLabelsPage = asyncHandler(async (req, res, next) => {
  console.log("Label page");
  const baseURL = req.baseUrl.toString();

  const labelInfos = await db.getLabel(req.params.id);
  const albumsRelated = await db.getAlbumsFromLabel(req.params.id);

  res.render("label", {
    title: "Value of label",
    id: req.params.id,
    baseURL: baseURL,
    labelInfos: labelInfos[0],
    albumsRelated: albumsRelated,
  });
});

exports.getLabelsCreatePage = asyncHandler(async (req, res, next) => {
  console.log("Label Creation page");
  const dynamicPath = "Create";

  res.render("label_form", {
    title: "Label",
    id: undefined,
    dynamicPath: dynamicPath,
    label: [],
  });
});

exports.postLabelsCreatePage = [
  validateLabel,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const dynamicPath = "Create";
    if (!errors.isEmpty()) {
      return res.status(400).render("label_form", {
        title: "Label",
        dynamicPath: dynamicPath,
        errors: errors.array(),
        id: undefined,
        genre: [],
      });
    }
    const labelData = {
      name: req.body.name,
      foundedyear: req.body.foundedyear,
    };
    const resultID = await db.insertLabel(
      labelData.name,
      labelData.foundedyear,
    );
    res.redirect(`/labels/${resultID}`);
  }),
];

exports.getLabelsDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Label Delete page");
  const labelInfo = await db.getLabel(req.params.id);

  res.render("label_delete", {
    title: "Delete label",
    id: req.params.id,
    dynaData: labelInfo[0],
    baseUrl: req.baseUrl,
  });
});

exports.postLabelsDeletePage = [
  validatePassword,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const labelInfo = await db.getLabel(req.params.id);
      return res.status(400).render("label_delete", {
        title: "Delete label",
        id: req.params.id,
        dynaData: genreInfo[0],
        baseUrl: req.baseUrl,
      });
    }
    await db.deleteLabel(req.params.id);
    res.redirect("/category/labels");
  }),
];

exports.getLabelsUpdatePage = asyncHandler(async (req, res, next) => {
  console.log("GET Label Update page");
  const dynamicPath = "Update";
  const result = await db.getLabel(req.params.id);

  res.render("label_form", {
    title: "Label",
    id: req.params.id,
    dynamicPath: dynamicPath,
    label: result[0],
  });
});

exports.postLabelsUpdatePage = [
  validatePassword,
  validateLabel,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    console.log(req.params);
    const dynamicPath = "Update";
    if (!errors.isEmpty()) {
      const result = await db.getLabel(req.params.id);

      return res.status(400).render("label_form", {
        title: "Label",
        id: req.params.id,
        dynamicPath: dynamicPath,
        errors: errors.array(),
        label: result[0],
      });
    }
    const labelData = {
      id: req.params.id,
      name: req.body.name,
      foundedyear: req.body.foundedyear,
    };

    await db.updateLabel(labelData.id, labelData.name, labelData.foundedyear);
    res.redirect(`/labels/${req.params.id}`);
  }),
];
