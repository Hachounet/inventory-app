require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS imagesartists(id SERIAL4 PRIMARY KEY, imageURL varchar(255));
insert into imagesartists(imageURL) VALUES('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHX6K9a17VYs9B2CwWJ6qf9DBXYs-p6D0pPA&s');
insert into imagesartists(imageURL) VALUES('https://countrymusicfrance.fr/wp-content/uploads/2021/05/b1e72-thevalleywestern-200-cropped.jpg?w=1400');
insert into imagesartists(imageURL) VALUES('https://musically-yours.net/wp-content/uploads/2024/04/148d30ff-a77a-4d68-ac07-6a4b8a1c4c09_1457591_retina_portrait_3_2.jpg?w=640');
insert into imagesartists(imageURL) VALUES('https://i.scdn.co/image/2d32c2e08216016b1cf0b7d55900710da2875c85');
insert into imagesartists(imageURL) VALUES('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjhnJYSI_PQEYC7He8PG1q6Mr6o47oWGKC2g&s');
insert into imagesartists(imageURL) VALUES('https://cdns-images.dzcdn.net/images/artist/88fb42688e1aa13050951ce9200b4fff/500x500.jpg');
insert into imagesartists(imageURL) VALUES('https://cdns-images.dzcdn.net/images/artist/0906a9e8098f4b3443b1bd312906e1a0/1900x1900-000000-80-0-0.jpg');
insert into imagesartists(imageURL) VALUES('https://lefair.org/wp-content/uploads/2022/12/Pomme.jpg');
insert into imagesartists(imageURL) VALUES('https://i.scdn.co/image/ab6761610000e5eba0c87c8f329b436eac8b9784');


CREATE TABLE imagesalbums(id SERIAL4 PRIMARY KEY, imageURL varchar(255));
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/71dtYuD2+-L._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/71laVfWEkCS._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/91DiSVqiNLL._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/71KPbuhfjfL._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://la-tribu-disques-et-spectacles.myshopify.com/cdn/shop/files/cover_PubRoyal_3000x3000_e6252ba9-4a1a-4159-97d1-2fa20915e6c4.jpg?v=1713464707');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/91gciB6XtsL._UF350,350_QL50_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/61fiGZ91vdL._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/81rJD4cqz4L._UF350,350_QL50_.jpg');
insert into imagesalbums(imageURL) VALUES('https://groundzero.fr/wp-content/uploads/2024/07/1900x1900-000000-80-0-0-1.jpeg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/71n0xmxpw7L._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://modulor-records.com/wp-content/uploads/STUPEFLIP-STUP-FOREVER.jpg');
insert into imagesalbums(imageURL) VALUES('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFfrZNKinFtk8wF-vYe9dbV1yHgd0opeK87w&s');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/511N4+qXWJL._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f2/30/17/f23017c9-d4a8-3735-2b30-21c87082db63/859716307817_cover.jpg/600x600bf-60.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/81FfHZv7n9L._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/81qJoaKi6+L._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://m.media-amazon.com/images/I/81PtRtyHtUL._UF1000,1000_QL80_.jpg');
insert into imagesalbums(imageURL) VALUES('https://morrowrecords.com/cdn/shop/products/stapletonstartingover.jpg?v=1640732438');


create table IF NOT EXISTS artists (id SERIAL4 PRIMARY KEY, firstname varchar(100), lastname varchar(100), dateB date, dateD date, country varchar(100), imageURL integer,FOREIGN KEY (imageURL) REFERENCES imagesartists(id) ON DELETE CASCADE );
        insert into artists ( firstname, lastname, dateB, country, imageURL) values ( 'Billie', 'Eilish', '2001-12-18', 'USA', 1);
        insert into artists ( firstname, lastname, dateB, country, imageURL) values ( 'Charley', 'Crockett', '1984-03-24', 'USA', 2);
        insert into artists ( firstname, dateB, dateD, country, imageURL) values ( 'Les Cowboys Fringants', '1976-10-28', '2023-11-15', 'Canada', 3);
        insert into artists ( firstname, lastname, dateB, country, imageURL) values ( 'Keb', 'Mo', '1951-10-03', 'USA', 4);
        insert into artists ( firstname, dateB, country, imageURL) values ( 'Eminem',  '1972-10-17', 'USA', 5);
        insert into artists ( firstname, dateB, country, imageURL) values ( 'Stupeflip', '2000-01-01', 'France', 6);
        insert into artists ( firstname, dateB, country, imageURL) values ( 'Ren',  '1990-03-29', 'UK', 7);
        insert into artists ( firstname, dateB, country, imageURL) values ( 'Pomme', '1996-08-02', 'France', 8);
        insert into artists ( firstname, lastname, dateB, country, imageURL) values ( 'Chris', 'Stapleton', '1978-04-15', 'USA', 9);
        
CREATE TABLE labels(id SERIAL4 PRIMARY KEY, name varchar(100), foundedyear varchar(100));
INSERT INTO labels(name, foundedyear) values ('Interscope Records', '1989');
INSERT into labels(name, foundedyear) values('Thirsty Tigers', '2002');
INSERT into labels(name, foundedyear) values('La Tribu', '1996');
INSERT into labels(name, foundedyear) values('Rounder Corner', '1970');
INSERT into labels(name, foundedyear) values('Dragon Accel', '2002');
INSERT into labels(name, foundedyear) values('Independant Label', '2009');
INSERT into labels(name, foundedyear) values('Polydor', '1913');
INSERT into labels(name, foundedyear) values('Universal Music', '1998');



CREATE TABLE genres(id SERIAL4 PRIMARY KEY, name varchar(100));
INSERT INTO genres(name) VALUES('Pop');
INSERT INTO genres(name) VALUES('Rap');
INSERT INTO genres(name) VALUES('Country');
INSERT INTO genres(name) VALUES('Alternative Rock');
INSERT INTO genres(name) VALUES('Blues');
INSERT INTO genres(name) VALUES('Folk');




CREATE TABLE albums (
    id SERIAL4 PRIMARY KEY,
    title VARCHAR(100),
    artist_id INTEGER,
    releasedate DATE,
    label_id INTEGER,
    genre_id INTEGER,
    imageURL INTEGER,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE  ,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE SET NULL,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE ,
    FOREIGN KEY(imageURL) REFERENCES imagesalbums(id) ON DELETE CASCADE 
);

insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Hit me hard and soft', 1, '2024-05-17', 1, 1, 1);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Happier than ever', 1, '2021-07-30', 1, 1, 2);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('$10 Cowboy', 2, '2024-04-26', 2, 5, 3 );
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('The man from waco', 2, '2022-09-09', 2, 5, 4);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Pub Royal', 3, '2024-04-25', 3, 4, 5);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Les Antipodes', 3, '2019-01-01', 3, 4, 6);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Good to be...', 4, '2022-01-14', 4, 5, 7);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Oklahoma', 4, '2019-01-14', 4, 5, 8);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('The Death of Slim Shady', 5, '2024-07-12', 1, 2, 9 );
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('The Eminem Show', 5, '2002-05-21', 1, 2, 10);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Stup Forever', 6, '2022-09-16', 5, 2, 11);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Stup Virus', 6, '2017-03-17', 5, 2, 12);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Sick Boi', 7, '2023-10-13', 6, 2, 13);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Freckled Angels', 7, '2016-01-15', 6, 2, 14);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Saisons', 8, '2024-03-22', 7, 6, 15);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Consolation', 8, '2022-08-26', 7, 6, 16);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Higher',9, '2023-11-10', 8, 3, 17);
insert into albums (title, artist_id, releasedate,label_id, genre_id, imageURL) values ('Starting Over',9, '2020-11-13', 8, 3, 18);

CREATE TABLE releases(id SERIAL4 PRIMARY KEY, album_id INTEGER, format varchar(100), price INTEGER, stock INTEGER, barcode INTEGER, imageURL integer,
FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE, FOREIGN KEY(imageURL) REFERENCES imagesalbums(id) ON DELETE SET NULL );
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 1, 'vinyle', 29.99, 25, 123456789, 1);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 2, 'cd', 12.99, 15, 723456789, 2);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 3, 'cd', 12.99, 5, 133486579, 3);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 4, 'cd', 12.99, 15, 143456789, 4);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 5, 'cd', 12.99, 1, 153456789, 5);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 6, 'cd', 12.99, 15, 163456789, 6);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 7, 'cd', 12.99, 15, 173456789, 7);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 8, 'cd', 12.99, 7, 183456789, 8);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 9, 'cd', 12.99, 2, 193456789, 9);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 10, 'cd', 12.99, 8, 112345678, 10);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 11, 'cd', 12.99, 43, 105546578, 11);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 12, 'cd', 12.99, 15, 100589678, 12);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 13, 'cd', 12.99, 15, 100002678, 13);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 14, 'cd', 12.99, 15, 987654321, 14);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 15, 'cd', 12.99, 15, 987654322, 15);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 16, 'cd', 12.99, 15, 987654323, 16);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 17, 'cd', 12.99, 15, 987654324, 17);
insert into releases( album_id, format, price, stock, barcode, imageURL) VALUES ( 18, 'cd', 12.99, 15, 987654325, 18);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `${process.env.DATABASE_URL}`,
  });

  try {
    await client.connect();
    await client.query(SQL);
  } catch (error) {
    console.error("Error seeding database", error);
  } finally {
    await client.end();
    console.log("Done.");
  }
}

main();
