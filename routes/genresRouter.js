const { Router } = require("express");

const {
  getGenresCreatePage,
  getGenresPage,
  getGenresDeletePage,
  postGenresDeletePage,
  getGenresUpdatePage,
  postGenresUpdatePage,
  postGenresCreatePage,
} = require("../controllers/genresController");

const genresRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

genresRouter.get("/create", getGenresCreatePage);

genresRouter.post("/create", postGenresCreatePage);

genresRouter.get("/:id(\\d+)", validateId, getGenresPage);

genresRouter.get("/:id(\\d+)/delete", validateId, getGenresDeletePage);

genresRouter.post("/:id(\\d+)/delete", validateId, postGenresDeletePage);

genresRouter.get("/:id(\\d+)/update", validateId, getGenresUpdatePage);

genresRouter.post("/:id(\\d+)/update", validateId, postGenresUpdatePage);

module.exports = genresRouter;
