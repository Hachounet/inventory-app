const { Router } = require("express");

const {
  getReleasesCreatePage,
  getReleasesPage,
  getReleasesDeletePage,
  postReleasesDeletePage,
  getReleasesUpdatePage,
  postReleasesUpdatePage,
  postReleasesCreatePage,
} = require("../controllers/releasesController");

const releasesRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

releasesRouter.get("/create", getReleasesCreatePage);

releasesRouter.post("/create", postReleasesCreatePage);

releasesRouter.get("/:id(\\d+)", validateId, getReleasesPage);

releasesRouter.get("/:id(\\d+)/delete", validateId, getReleasesDeletePage);

releasesRouter.post("/:id(\\d+)/delete", validateId, postReleasesDeletePage);

releasesRouter.get("/:id(\\d+)/update", validateId, getReleasesUpdatePage);

releasesRouter.post("/:id(\\d+)/update", validateId, postReleasesUpdatePage);

module.exports = releasesRouter;
