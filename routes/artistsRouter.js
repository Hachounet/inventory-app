const { Router } = require("express");

const {
  getArtistsPage,
  getArtistsCreatePage,
  getArtistsDeletePage,
  postArtistsDeletePage,
  getArtistsUpdatePage,
  postArtistsUpdatePage,
  postArtistsCreatePage,
} = require("../controllers/artistsController");

const artistsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

artistsRouter.get("/create", getArtistsCreatePage);

artistsRouter.post("/create", postArtistsCreatePage);

artistsRouter.get("/:id(\\d+)", validateId, getArtistsPage);

artistsRouter.get("/:id(\\d+)/delete", validateId, getArtistsDeletePage);

artistsRouter.post("/:id(\\d+)/delete", validateId, postArtistsDeletePage);

artistsRouter.get("/:id(\\d+)/update", validateId, getArtistsUpdatePage);

artistsRouter.post("/:id(\\d+)/update", validateId, postArtistsUpdatePage);

module.exports = artistsRouter;
