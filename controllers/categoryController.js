const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.getCategoryLanding = asyncHandler(async (req, res, next) => {
  console.log("Category Landing page");
  res.redirect("404");
});

exports.getCategoryArtists = asyncHandler(async (req, res, next) => {
  console.log("Category Artists page");
  const artists = await db.getAllArtists();
  const dynaValue = "artists";
  res.render("category", {
    title: "Artists category",
    dynaData: artists,
    dynamicDisplay: dynaValue,
    route: req.route.path,
  }); // dynaData is unique name to display dynamically albums, labels etc... in EJS template
});

exports.getCategoryAlbums = asyncHandler(async (req, res, next) => {
  console.log("Category Albums page");
  const albums = await db.getAllAlbums();

  const dynaValue = "albums";
  res.render("category", {
    title: "Albums category",
    route: req.route.path,
    dynaData: albums,
    dynamicDisplay: dynaValue,
  });
});

exports.getCategoryLabels = asyncHandler(async (req, res, next) => {
  console.log("Category Labels page");
  const labels = await db.getAllLabels();

  const dynaValue = "labels";
  res.render("category", {
    title: "Labels category",
    route: req.route.path,
    dynaData: labels,
    dynamicDisplay: dynaValue,
  });
});

exports.getCategoryGenres = asyncHandler(async (req, res, next) => {
  console.log("Category Genres page");
  const genres = await db.getAllGenres();
  console.log(req.route.path);
  const dynaValue = "genres";
  res.render("category", {
    title: "Genres category",
    route: req.route.path,
    dynaData: genres,
    dynamicDisplay: dynaValue,
  });
});

exports.getCategoryReleases = asyncHandler(async (req, res, next) => {
  console.log("Category Releases page");
  const releases = await db.getAllReleases();
  console.log(releases);
  const dynaValue = "releases";
  res.render("category", {
    title: "Releases category",
    route: req.route.path,
    dynaData: releases,
    dynamicDisplay: dynaValue,
  });
});
