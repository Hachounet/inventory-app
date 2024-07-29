const { Router } = require("express");

const {
  getCategoryLanding,
  getCategoryArtists,
  getCategoryAlbums,
  getCategoryLabels,
  getCategoryGenres,
  getCategoryReleases,
} = require("../controllers/categoryController");

const categoryRouter = Router();

categoryRouter.get("/", getCategoryLanding);

categoryRouter.get("/artists", getCategoryArtists);

categoryRouter.get("/albums", getCategoryAlbums);

categoryRouter.get("/labels", getCategoryLabels);

categoryRouter.get("/genres", getCategoryGenres);

categoryRouter.get("/releases", getCategoryReleases);

categoryRouter.get("*", (req, res) => {
  res.send(404).render("404");
});

module.exports = categoryRouter;
