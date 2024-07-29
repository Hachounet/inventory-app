const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const {
  getAlbumsCreatePage,
  getAlbumsPage,
  getAlbumsDeletePage,
  postAlbumsDeletePage,
  getAlbumsUpdatePage,
  postAlbumsUpdatePage,
  postAlbumsCreatePage,
} = require("../controllers/albumsController");

const db = require("../db/queries");

const albumsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

// Middleware for checking if album exists

const checkAlbumExists = asyncHandler(async (req, res, next) => {
  const { id } = req.params.id;
  const exists = await db.checkIfAlbumExists(id);
  if (!exists) {
    return res.status(404).render("404");
  }
  next();
});

albumsRouter.get("/create", getAlbumsCreatePage);

albumsRouter.post("/create", postAlbumsCreatePage);

albumsRouter.get("/:id(\\d+)", validateId, checkAlbumExists, getAlbumsPage);

albumsRouter.get(
  "/:id(\\d+)/delete",
  validateId,
  checkAlbumExists,
  getAlbumsDeletePage,
);

albumsRouter.post(
  "/:id(\\d+)/delete",
  validateId,
  checkAlbumExists,
  postAlbumsDeletePage,
);

albumsRouter.get(
  "/:id(\\d+)/update",
  validateId,
  checkAlbumExists,
  getAlbumsUpdatePage,
);

albumsRouter.post(
  "/:id(\\d+)/update",
  validateId,
  checkAlbumExists,
  postAlbumsUpdatePage,
);

module.exports = albumsRouter;
