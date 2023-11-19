const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRotuter = require("./launches/launches.router");

const api = express.Router();

api.use("./planets", planetsRouter);
api.use("./launches", launchesRotuter);

module.exports = api;
