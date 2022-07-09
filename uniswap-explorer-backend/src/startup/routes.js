const express = require("express")
const contractEventsRouter = require("../routes/contractEventRoutes")

module.exports = function (app){
app.use(express.json())
app.use("/api/get", contractEventsRouter);
}