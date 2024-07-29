const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  getLabelsCreatePage,
  getLabelsPage,
  getLabelsDeletePage,
  postLabelsDeletePage,
  getLabelsUpdatePage,
  postLabelsUpdatePage,
  postLabelsCreatePage,
} = require("../controllers/labelsController");

const db = require("../db/queries");

const labelsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

const checkLabelExists = asyncHandler(async (req, res, next) => {
  const { id } = req.params.id;
  const exists = await db.checkIfLabelExists(id);
  if (!exists) {
    return res.status(404).render("404");
  }
  next();
});

labelsRouter.get("/create", getLabelsCreatePage);

labelsRouter.post("/create", postLabelsCreatePage);

labelsRouter.get("/:id(\\d+)", validateId, checkLabelExists, getLabelsPage);

labelsRouter.get(
  "/:id(\\d+)/delete",
  validateId,
  checkLabelExists,
  getLabelsDeletePage,
);

labelsRouter.post(
  "/:id(\\d+)/delete",
  validateId,
  checkLabelExists,
  postLabelsDeletePage,
);

labelsRouter.get(
  "/:id(\\d+)/update",
  validateId,
  checkLabelExists,
  getLabelsUpdatePage,
);

labelsRouter.post(
  "/:id(\\d+)/update",
  validateId,
  checkLabelExists,
  postLabelsUpdatePage,
);

module.exports = labelsRouter;
