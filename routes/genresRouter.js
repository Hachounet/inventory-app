const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const {
  getGenresCreatePage,
  getGenresPage,
  getGenresDeletePage,
  postGenresDeletePage,
  getGenresUpdatePage,
  postGenresUpdatePage,
  postGenresCreatePage,
} = require("../controllers/genresController");

const db = require("../db/queries");

const genresRouter = Router();

// Middleware for checking if ID is number

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID. ID must be a number.");
  }
  next();
};

const checkGenreExists = asyncHandler(async (req, res, next) => {
  const { id } = req.params.id;
  const exists = await db.checkIfGenreExists(id);
  if (!exists) {
    return res.status(404).render("404");
  }
  next();
});

genresRouter.get("/create", getGenresCreatePage);

genresRouter.post("/create", postGenresCreatePage);

genresRouter.get("/:id(\\d+)", validateId, checkGenreExists, getGenresPage);

genresRouter.get(
  "/:id(\\d+)/delete",
  validateId,
  checkGenreExists,
  getGenresDeletePage,
);

genresRouter.post(
  "/:id(\\d+)/delete",
  validateId,
  checkGenreExists,
  postGenresDeletePage,
);

genresRouter.get(
  "/:id(\\d+)/update",
  validateId,
  checkGenreExists,
  getGenresUpdatePage,
);

genresRouter.post(
  "/:id(\\d+)/update",
  validateId,
  checkGenreExists,
  postGenresUpdatePage,
);

module.exports = genresRouter;
