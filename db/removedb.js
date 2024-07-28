require("dotenv").config();
const { Client } = require("pg");

const SQL = `

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;


`;

async function main() {
  console.log("Removing...");
  const client = new Client({
    connectionString: `${process.env.DEV_CONNEXION_STRING}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done.");
}

main();
