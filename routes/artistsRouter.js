const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  getArtistsPage,
  getArtistsCreatePage,
  getArtistsDeletePage,
  postArtistsDeletePage,
  getArtistsUpdatePage,
  postArtistsUpdatePage,
  postArtistsCreatePage,
} = require("../controllers/artistsController");

const db = require("../db/queries");

const artistsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

// Middleware for checking if artist exists

const checkArtistExists = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const exists = await db.checkIfArtistExists(id);
  if (!exists) {
    return res.status(404).render("404");
  }
  next();
});

artistsRouter.get("/create", getArtistsCreatePage);

artistsRouter.post("/create", postArtistsCreatePage);

artistsRouter.get("/:id(\\d+)", validateId, checkArtistExists, getArtistsPage);

artistsRouter.get(
  "/:id(\\d+)/delete",
  validateId,
  checkArtistExists,
  getArtistsDeletePage,
);

artistsRouter.post(
  "/:id(\\d+)/delete",
  validateId,
  checkArtistExists,
  postArtistsDeletePage,
);

artistsRouter.get(
  "/:id(\\d+)/update",
  validateId,
  checkArtistExists,
  getArtistsUpdatePage,
);

artistsRouter.post(
  "/:id(\\d+)/update",
  validateId,
  checkArtistExists,
  postArtistsUpdatePage,
);

module.exports = artistsRouter;
