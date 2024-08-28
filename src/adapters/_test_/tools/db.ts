import knex from "knex";

export const db = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "systeme_de_vote",
  },
  //debug: true
});


console.log("Connection db ok");
