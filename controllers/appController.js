const asyncHandler = require("express-async-handler");

const db = require("../db/queries");

exports.getLandingPage = asyncHandler(async (req, res, next) => {
  console.log("Landing Page");
  const checkTable = await db.checkIfTableExists("albums");
  if (checkTable) {
    const albumsNumb = await db.getTotalNumberAlbums();
    const totalItems = await db.getTotalItems();
    const lowItems = await db.checkLowItems();
    const recentReleases = await db.getRecentReleases();

    res.render("index", {
      albumsNumber: albumsNumb,
      totalItems: totalItems,
      lowItems: lowItems,
      recentReleases: recentReleases,
    });
  } else {
    res.render("index", { albumsNumber: 0 });
  }
});
