const { Router } = require("express");

const {
  getAlbumsCreatePage,
  getAlbumsPage,
  getAlbumsDeletePage,
  postAlbumsDeletePage,
  getAlbumsUpdatePage,
  postAlbumsUpdatePage,
  postAlbumsCreatePage,
} = require("../controllers/albumsController");

const albumsRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

albumsRouter.get("/create", getAlbumsCreatePage);

albumsRouter.post("/create", postAlbumsCreatePage);

albumsRouter.get("/:id(\\d+)", validateId, getAlbumsPage);

albumsRouter.get("/:id(\\d+)/delete", validateId, getAlbumsDeletePage);

albumsRouter.post("/:id(\\d+)/delete", validateId, postAlbumsDeletePage);

albumsRouter.get("/:id(\\d+)/update", validateId, getAlbumsUpdatePage);

albumsRouter.post("/:id(\\d+)/update", validateId, postAlbumsUpdatePage);

module.exports = albumsRouter;
