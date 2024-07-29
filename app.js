require("dotenv").config();

const express = require("express");
const asyncHandler = require("express-async-handler");
const path = require("path");
const { getLandingPage } = require("./controllers/appController");

const app = express();

// Require all routers here

const categoryRouter = require("./routes/categoryRouter");
const artistsRouter = require("./routes/artistsRouter");
const albumsRouter = require("./routes/albumsRouter");
const labelsRouter = require("./routes/labelsRouter");
const genresRouter = require("./routes/genresRouter");
const releasesRouter = require("./routes/releasesRouter");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Middleware to transform data send in js object
app.use(express.static(path.join(__dirname, "public"))); // Middleware to serve CSS and other static files

app.use("/category", categoryRouter);
app.use("/artists", artistsRouter);
app.use("/albums", albumsRouter);
app.use("/labels", labelsRouter);
app.use("/genres", genresRouter);
app.use("/releases", releasesRouter);

app.get("/", getLandingPage);

app.get(
  "*",
  asyncHandler(async (req, res, next) => {
    console.log("404 : ", req.body, req.query, req.originalUrl);
    res.render("404");
  }),
);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error details", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server launched on PORT ${PORT}`));
