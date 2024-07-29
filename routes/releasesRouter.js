const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  getReleasesCreatePage,
  getReleasesPage,
  getReleasesDeletePage,
  postReleasesDeletePage,
  getReleasesUpdatePage,
  postReleasesUpdatePage,
  postReleasesCreatePage,
} = require("../controllers/releasesController");

const db = require("../db/queries");

const releasesRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

const checkLabelExists = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const exists = await db.checkIfReleaseExistsByID(id);
  if (!exists) {
    return res.status(404).render("404");
  }
  next();
});

releasesRouter.get("/create", getReleasesCreatePage);

releasesRouter.post("/create", postReleasesCreatePage);

releasesRouter.get("/:id(\\d+)", validateId, checkLabelExists, getReleasesPage);

releasesRouter.get(
  "/:id(\\d+)/delete",
  validateId,
  checkLabelExists,
  getReleasesDeletePage,
);

releasesRouter.post(
  "/:id(\\d+)/delete",
  validateId,
  checkLabelExists,
  postReleasesDeletePage,
);

releasesRouter.get(
  "/:id(\\d+)/update",
  validateId,
  checkLabelExists,
  getReleasesUpdatePage,
);

releasesRouter.post(
  "/:id(\\d+)/update",
  validateId,
  checkLabelExists,
  postReleasesUpdatePage,
);

module.exports = releasesRouter;
