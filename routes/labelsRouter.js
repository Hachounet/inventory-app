const { Router } = require("express");

const {
  getLabelsCreatePage,
  getLabelsPage,
  getLabelsDeletePage,
  postLabelsDeletePage,
  getLabelsUpdatePage,
  postLabelsUpdatePage,
  postLabelsCreatePage,
} = require("../controllers/labelsController");

const labelsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

labelsRouter.get("/create", getLabelsCreatePage);

labelsRouter.post("/create", postLabelsCreatePage);

labelsRouter.get("/:id(\\d+)", validateId, getLabelsPage);

labelsRouter.get("/:id(\\d+)/delete", validateId, getLabelsDeletePage);

labelsRouter.post("/:id(\\d+)/delete", validateId, postLabelsDeletePage);

labelsRouter.get("/:id(\\d+)/update", validateId, getLabelsUpdatePage);

labelsRouter.post("/:id(\\d+)/update", validateId, postLabelsUpdatePage);

module.exports = labelsRouter;
