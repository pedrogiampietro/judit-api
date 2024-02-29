require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import RequestService from "./services/RequestService";
import RequestController from "./controllers/RequestController";
import RequestRoutes from "./routes/requestRoutes";

const app = express();
app.use(express.json());
app.use(cors());

const requestService = new RequestService();
const requestController = new RequestController(requestService);
const requestRoutes = new RequestRoutes(requestController);

requestRoutes.routes(app);

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida");
    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error.message);
  });
