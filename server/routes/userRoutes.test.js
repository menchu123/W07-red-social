require("dotenv").config();
const debug = require("debug")("user:routes:tests");
const chalk = require("chalk");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const initializeDB = require("../../database");
const User = require("../../database/models/user");
const { initializeServer } = require("../index");
const { app } = require("../index");

jest.setTimeout(20000);

const request = supertest(app);

let server;
let token;
let passwords;

beforeAll(async () => {
  await initializeDB(process.env.MONGODB_STRING_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});

beforeEach(async () => {
  const testUsers = [
    {
      name: "Elsa",
      password: await bcrypt.hash("damedecome", 10),
      username: "elsithecroc",
      photo: "",
      bio: "",
      _id: "6191001dd184431e7f1983ec",
    },
    {
      name: "Albert",
      password: await bcrypt.hash("damedecome", 10),
      username: "albertnotacroc",
      photo: "",
      bio: "",
      _id: "6191006acd481ec6da9ce256",
    },
  ];

  passwords = [testUsers[0].password, testUsers[1].password];
  await User.deleteMany();
  await User.create(testUsers[0]);
  await User.create(testUsers[1]);
  const loginResponse = await request
    .post("/users/login")
    .send({ username: "elsithecroc", password: "damedecome" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.on("close", () => {
    debug(chalk.red("Connexion to database ended"));
  });
  await mongoose.connection.close();
  await server.on("close", () => {
    debug(chalk.red("Connexion to server ended"));
  });
  await server.close();
});

describe("Given a /users router,", () => {
  describe("When it gets a POST request for /users/login with an existing username and a password", () => {
    test("Then it should send a response with a token and a status code of 200", async () => {
      const { body } = await request
        .post("/users/login")
        .send({ username: "elsithecroc", password: "damedecome" })
        .expect(200);

      expect(body.token).toBeDefined();
    });
  });
  describe("When it gets a POST request for /users/login with a non existent username", () => {
    test("Then it should send a response with an error and a status code of 200", async () => {
      const { body } = await request
        .post("/users/login")
        .send({ username: "elsithecrocFAKE", password: "imnotelsi" })
        .expect(401);

      const expectedError = {
        error: "Wrong credentials",
      };

      expect(body.token).not.toBeDefined();
      expect(body).toEqual(expectedError);
    });
  });
  describe("When it gets a POST request for /users/register without all the required fields", () => {
    test("Then it should send a response with an error and a status code of 400", async () => {
      const { body } = await request
        .post("/users/register")
        .send({ username: "idonthaveaname", password: "ithoughtthiswaslogin" })
        .expect(400);

      const expectedError = {
        error: "Bad request sorry",
      };

      expect(body).toEqual(expectedError);
    });
  });

  describe("When it gets a POST request for /users/register with all the required fields", () => {
    test("Then it should send a response with the new user and a status code of 200", async () => {
      const { body } = await request
        .post("/users/register")
        .send({
          username: "newuser",
          password: "hiimnewhere",
          name: "El nuevo",
        })
        .expect(200);

      expect(body).toHaveProperty("name", "El nuevo");
    });
  });

  describe("When it gets a POST request for a non existing route", () => {
    test("Then it should send an error and a status code of 404", async () => {
      const { body } = await request
        .post("/users/registerbutwrong")
        .send({
          username: "newuser",
          password: "hiimnewhere",
          name: "El nuevo",
        })
        .expect(404);

      const expectedError = {
        error: "Sorry, endpoint not found",
      };

      expect(body).toEqual(expectedError);
    });
  });

  describe("When it gets a GET request for /users", () => {
    test("Then it should send a response with an array of robots and a status code of 200", async () => {
      const { body } = await request
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const expectedLength = 2;
      const expectedUser1 = {
        name: "Elsa",
        password: passwords[0],
        username: "elsithecroc",
        photo: "",
        bio: "",
        enemies: [],
        friends: [],
        id: "6191001dd184431e7f1983ec",
      };

      const expectedUser2 = {
        name: "Albert",
        password: passwords[1],
        username: "albertnotacroc",
        photo: "",
        bio: "",
        enemies: [],
        friends: [],
        id: "6191006acd481ec6da9ce256",
      };
      expect(body).toHaveLength(expectedLength);
      expect(body).toContainEqual(expectedUser1);
      expect(body).toContainEqual(expectedUser2);
    });
  });
});
