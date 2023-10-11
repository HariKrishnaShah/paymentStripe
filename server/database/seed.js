require("dotenv").config();
const mongoose = require("mongoose");
const Controller = require("../modules/users/user.controller");

mongoose.connect(process.env.DB_URL);

const setup = {
  initialize: async () => {
    await mongoose.connection.dropDatabase();
    console.log("DB reset");
    console.log("Creating Admin...");
    const payload = {
      name: "Raktim Admin",
      email: "rakimsth@gmail.com",
      password: "12345",
      isEmailVerified: true,
      roles: ["admin"],
      isArchived: false,
    };
    await Controller.create(payload);
    console.log("Creating User...");
    const userPayload = {
      name: "Raktim User",
      email: "raktim@rumsan.com",
      password: "12345",
      isEmailVerified: true,
      isArchived: false,
    };
    await Controller.create(userPayload);
    console.log("User Completed...");

    console.log("adding multiple Categories...");

    console.log("Finishing multiple Categories...");

    console.log("adding Products...");
    console.log("Finishing Products...");

    console.log("adding Orders...");
    console.log("Finishing Orders...");
  },
};
setup.initialize();
