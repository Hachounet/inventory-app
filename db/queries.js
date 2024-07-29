const pool = require("./pool");

async function getTotalNumberAlbums() {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query("SELECT COUNT(id) FROM albums");
  const AlbumsNumb = result.rows[0].count;
  return AlbumsNumb;
}

async function getTotalItems() {
  const tableExists = await checkIfTableExists("releases");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query("SELECT SUM(stock) FROM releases");
  const totalItems = result.rows[0].sum;
  return totalItems;
}

async function checkLowItems() {
  const tableExists = await checkIfTableExists("releases");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT SUM(stock) FROM releases WHERE stock <= 15",
  );
  const lowItems = result.rows[0].sum;
  return lowItems;
}

async function getRecentReleases() {
  const tableExists = await checkIfTableExists("releases");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT imagesalbums.imageURL, releases.price, releases.stock, releases.id FROM releases JOIN imagesalbums ON releases.imageURL = imagesalbums.id JOIN albums ON releases.album_id = albums.id WHERE albums.releasedate BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE",
  );
  const { rows } = result;

  return rows;
}

async function getRelease(id) {
  const tableExists = await checkIfTableExists("releases");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT imagesalbums.imageURL, releases.price, releases.format, releases.stock, releases.barcode, albums.title FROM releases JOIN imagesalbums ON releases.imageURL = imagesalbums.id JOIN albums ON releases.album_id = albums.id WHERE releases.id = $1;",
    [id],
  );
  const { rows } = result;
  return rows;
}

async function getAllArtists() {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT imagesartists.imageURL, artists.id, artists.firstname, artists.lastname FROM artists JOIN imagesartists ON artists.imageURL = imagesartists.id",
  );
  const { rows } = result;
  return rows;
}

async function getAllAlbums() {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT imagesalbums.imageURL, albums.title, albums.releasedate, albums.genre_id, albums.id FROM albums JOIN imagesalbums ON albums.imageURL = imagesalbums.id",
  );
  const { rows } = result;
  return rows;
}

async function getAllGenres() {
  const tableExists = await checkIfTableExists("genres");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query("SELECT name, id FROM genres");
  const { rows } = result;
  return rows;
}

async function getAllLabels() {
  const tableExists = await checkIfTableExists("labels");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query("SELECT name, foundedyear, id FROM labels");
  const { rows } = result;
  return rows;
}

async function getAllReleases() {
  const tableExists = await checkIfTableExists("releases");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT imagesalbums.imageURL, releases.id, releases.price, releases.stock, releases.barcode, albums.title FROM releases JOIN imagesalbums ON releases.imageURL = imagesalbums.id JOIN albums ON releases.album_id = albums.id",
  );
  const { rows } = result;
  return rows;
}

async function insertArtist(
  firstname,
  lastname,
  dateb,
  dated,
  country,
  imageURL,
) {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  const imageResult = await pool.query(
    "insert into imagesartists ( imageURL ) values ($1) RETURNING id",
    [imageURL],
  );
  const imageID = imageResult.rows[0].id;
  await pool.query(
    "insert into artists ( firstname, lastname, dateB, dateD, country, imageURL) values ( $1, $2, $3, $4, $5, $6)",
    [firstname, lastname, dateb, dated, country, imageID],
  );

  const artistRetrieveID = await pool.query(
    "SELECT id from artists WHERE firstname = $1 AND lastname = $2 AND dateB = $3 AND country = $4",
    [firstname, lastname, dateb, country],
  );
  const artistID = artistRetrieveID.rows[0].id;
  return artistID;
}

async function updateArtist(
  id,
  firstname,
  lastname,
  dateB,
  dateD,
  country,
  imageURL,
) {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  await pool.query(
    "UPDATE imagesartists SET imageURL = $1 FROM artists WHERE artists.id = imagesartists.id AND artists.id = $2;",
    [imageURL, id],
  );
  await pool.query(
    "UPDATE artists SET firstname = $1, lastname = $2, dateB = $3, dateD = $4, country = $5 WHERE id = $6",
    [firstname, lastname, dateB, dateD, country, id],
  );
}

async function getArtist(id) {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT firstname, lastname, dateb, dated, country, imagesartists.imageURL FROM artists JOIN imagesartists ON artists.imageURL = imagesartists.id WHERE artists.id = $1",
    [id],
  );
  const { rows } = result;
  return rows;
}

async function getAlbumsOfArtist(id) {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  const result = await pool.query(
    "SELECT albums.title, imagesalbums.imageURL FROM albums JOIN imagesalbums ON imagesalbums.id = albums.imageURL JOIN artists ON albums.artist_id = artists.id WHERE artists.id = $1",
    [id],
  );
  const { rows } = result;
  return rows;
}

async function deleteArtist(id) {
  const tableExists = await checkIfTableExists("artists");
  if (tableExists === 0) {
    return [];
  }
  await pool.query("DELETE FROM artists WHERE artists.id = $1", [id]);

  return;
}
// -------------------- ALBUM QUERIES ------------------------ //

async function getAlbum(id) {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }
  const { rows } = await pool.query(
    "SELECT imagesalbums.imageURL, artists.firstname, artists.lastname, albums.releasedate, albums.title, labels.name as label_name, genres.name as genre_name FROM albums JOIN imagesalbums ON albums.imageURL = imagesalbums.id JOIN artists ON artists.id = albums.artist_id JOIN genres ON genres.id = albums.genre_id JOIN labels ON labels.id = albums.label_id WHERE albums.id = $1",
    [id],
  );
  return rows;
}

async function getAlbumsFromGenre(genreID) {
  const tableExists = await checkIfTableExists("genres");
  if (tableExists === 0) {
    return [];
  }
  const { rows } = await pool.query(
    "SELECT imagesalbums.imageURL, albums.title FROM albums JOIN imagesalbums ON albums.imageURL = imagesalbums.id WHERE genre_id = $1",
    [genreID],
  );

  return rows;
}

async function insertAlbum(
  title,
  artistID,
  releasedate,
  genre,
  label,
  imageURL,
) {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }
  const imageResult = await pool.query(
    "insert into imagesalbums ( imageURL ) values ($1) RETURNING id",
    [imageURL],
  );
  const imageID = imageResult.rows[0].id;
  await pool.query(
    "insert into albums ( title, artist_id, releasedate, genre_id, label_id, imageURL) values ( $1, $2, $3, $4, $5, $6)",
    [title, artistID, releasedate, genre, label, imageID],
  );

  const albumRetrieveID = await pool.query(
    "SELECT id from albums WHERE title = $1 AND label_id = $2",
    [title, label],
  );
  const albumID = albumRetrieveID.rows[0].id;
  return albumID;
}

async function deleteAlbum(id) {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }

  // Start a transaction
  await pool.query("BEGIN");

  try {
    // Delete associated releases first
    await pool.query("DELETE FROM releases WHERE album_id = $1", [id]);

    // Get the imageURL before deleting the album
    const res = await pool.query("SELECT imageURL FROM albums WHERE id = $1", [
      id,
    ]);
    const imageURL = res.rows[0].imageurl;

    // Delete the album
    await pool.query("DELETE FROM albums WHERE id = $1", [id]);

    // Delete the associated image from imagesalbums if it exists
    if (imageURL) {
      await pool.query("DELETE FROM imagesalbums WHERE id = $1", [imageURL]);
    }

    // Commit the transaction
    await pool.query("COMMIT");
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");
    throw error; // Re-throw the error to handle it in the calling function
  }
}

async function updateAlbum(
  id,
  artistID,
  title,
  releasedate,
  labelID,
  genreID,
  imageURL,
) {
  const tableExists = await checkIfTableExists("albums");
  if (tableExists === 0) {
    return [];
  }

  await pool.query(
    "UPDATE imagesalbums SET imageURL = $1 FROM albums WHERE albums.id = imagesalbums.id AND albums.id = $2;",
    [imageURL, id],
  );

  await pool.query(
    "UPDATE albums SET title = $1, releasedate = $2, artist_id = $3, label_id = $4, genre_id = $5 WHERE id = $6 ",
    [title, releasedate, artistID, labelID, genreID, id],
  );
}

// -------------------- GENRES QUERIES ------------------------ //

async function getGenre(id) {
  const { rows } = await pool.query("SELECT name FROM genres WHERE id = $1", [
    id,
  ]);

  return rows;
}

async function insertGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1) ", [name]);

  const genreRetrieveID = await pool.query(
    "SELECT id from genres WHERE name = $1",
    [name],
  );
  const genreID = genreRetrieveID.rows[0].id;

  return genreID;
}

async function deleteGenre(id) {
  // Supprimer les albums liés au genre
  await pool.query("DELETE FROM albums WHERE genre_id = $1", [id]);
  // Supprimer le genre
  await pool.query("DELETE FROM genres WHERE id = $1", [id]);
}

async function updateGenre(name, id) {
  await pool.query("UPDATE genres SET name = $1 WHERE id = $2;", [name, id]);
}

async function checkIfGenreNameExists(name) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM genres WHERE name = $1)",
    [name],
  );

  return rows[0].exists;
}

async function checkIfTableExists(tablename) {
  const results = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1);",
    [tablename],
  );
  // Return a boolean to say if yes or no table exists

  return results.rows[0].exists;
}

async function getLabel(id) {
  const { rows } = await pool.query("SELECT * from labels WHERE id = $1", [id]);
  return rows;
}

async function getAlbumsFromLabel(id) {
  const tableExists = await checkIfTableExists("labels");
  if (tableExists === 0) {
    return [];
  }
  const { rows } = await pool.query(
    "SELECT imagesalbums.imageURL, albums.title FROM albums JOIN imagesalbums ON albums.imageURL = imagesalbums.id WHERE label_id = $1",
    [id],
  );
  return rows;
}

async function insertLabel(name, year) {
  await pool.query("INSERT INTO labels (name, foundedyear) VALUES ($1, $2) ", [
    name,
    year,
  ]);

  const labelRetrieveID = await pool.query(
    "SELECT id from labels WHERE name = $1",
    [name],
  );
  const labelID = labelRetrieveID.rows[0].id;

  return labelID;
}

async function checkIfLabelNameExists(name) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM labels WHERE name = $1)",
    [name],
  );

  return rows[0].exists;
}

async function deleteLabel(id) {
  await pool.query("DELETE FROM albums WHERE label_id = $1", [id]);
  await pool.query("DELETE FROM labels WHERE id = $1", [id]);
}

async function updateLabel(id, name, foundedyear) {
  console.log(id, name, foundedyear);
  await pool.query(
    "UPDATE labels SET name = $1, foundedyear = $2 WHERE id = $3;",
    [name, foundedyear, id],
  );
}

async function checkIfReleaseExists(barcode) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM releases WHERE barcode = $1)",
    [barcode],
  );

  return rows[0].exists;
}

async function insertRelease(albumID, format, price, stock, barcode) {
  await pool.query(
    "INSERT INTO releases (album_id, format, price, stock, barcode, imageURL) VALUES ($1, $2, $3, $4, $5, $1) ",
    [albumID, format, price, stock, barcode],
  );

  const releaseRetrieveID = await pool.query(
    "SELECT id from releases WHERE barcode = $1",
    [barcode],
  );
  const releaseID = releaseRetrieveID.rows[0].id;

  return releaseID;
}

async function deleteRelease(id) {
  await pool.query("DELETE FROM releases WHERE id = $1", [id]);
}

async function updateRelease(id, albumID, format, price, stock, barcode) {
  await pool.query(
    "UPDATE releases SET album_id = $1, format = $2, price = $3, stock = $4, barcode = $5 WHERE id = $6;",
    [albumID, format, price, stock, barcode, id],
  );
}

async function checkIfAlbumExists(id) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM albums WHERE id = $1)",
    [id],
  );

  return rows[0].exists;
}

async function checkIfArtistExists(id) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM artists WHERE id = $1)",
    [id],
  );
  return rows[0].exists;
}

async function checkIfGenreExists(id) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM genres WHERE id = $1)",
    [id],
  );
  return rows[0].exists;
}

async function checkIfLabelExists(id) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM labels WHERE id = $1)",
    [id],
  );

  return rows[0].exists;
}

async function checkIfReleaseExistsByID(id) {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM releases WHERE id = $1)",
    [id],
  );
  return rows[0].exists;
}

module.exports = {
  checkIfTableExists,
  getTotalNumberAlbums,
  getTotalItems,
  checkLowItems,
  getRecentReleases,
  getRelease,
  getAllArtists,
  getAllAlbums,
  getAllGenres,
  getAllLabels,
  getAllReleases,
  insertArtist,
  getArtist,
  getAlbumsOfArtist,
  updateArtist,
  deleteArtist,
  getAlbum,
  getAlbumsFromGenre,
  insertAlbum,
  deleteAlbum,
  updateAlbum,
  getGenre,
  insertGenre,
  checkIfGenreNameExists,
  deleteGenre,
  updateGenre,
  getLabel,
  getAlbumsFromLabel,
  insertLabel,
  checkIfLabelNameExists,
  deleteLabel,
  updateLabel,
  insertRelease,
  checkIfReleaseExists,
  deleteRelease,
  updateRelease,
  checkIfAlbumExists,
  checkIfArtistExists,
  checkIfGenreExists,
  checkIfLabelExists,
  checkIfReleaseExistsByID,
};
