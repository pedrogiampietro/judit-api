require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import cors from "cors";

import Requests from "./models/Requests";
import LawsuitRequests from "./models/AdditionalData";

const app = express();
app.use(express.json());
app.use(cors());

const JUDIT_API_KEY = process.env.JUDIT_API_KEY;

app.post("/capture", async (req, res) => {
  const { search_type, search_key } = req.body;

  try {
    const response = await axios.post(
      "https://requests.prod.judit.io/requests",
      {
        search: {
          search_type,
          search_key,
        },
      },
      {
        headers: {
          "api-key": JUDIT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const request = new Requests({
      request_id: response.data.request_id,
      search: response.data.search,
      origin: response.data.origin,
      origin_id: response.data.origin_id,
      user_id: response.data.user_id,
      status: response.data.status,
      tags: response.data.tags,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at,
    });

    await request.save();

    res.json(request);
  } catch (error: any) {
    console.error("Erro ao capturar processo:", error.message);
    res.status(500).json({ error: "Erro ao capturar processo" });
  }
});

app.put("/move/:request_id", async (req, res) => {
  const { request_id } = req.params;
  const { newList } = req.body;

  try {
    const request = await Requests.findOne({ request_id });
    if (!request) {
      console.log("Processo não encontrado");
      res.status(404).json({ error: "Processo não encontrado" });
      return;
    }

    // Lógica para mover o processo para a nova lista
    request.list = newList;
    request.logs.push({ listId: newList, date: new Date() });
    await request.save();

    res.json(request);
  } catch (error: any) {
    console.error("Erro ao mover processo:", error.message);
    res.status(500).json({ error: "Erro ao mover processo" });
  }
});

app.get("/processes", async (req, res) => {
  try {
    const processes = await Requests.find().select("-__v");
    res.json(processes);
  } catch (error: any) {
    console.error("Erro ao listar processos:", error.message);
    res.status(500).json({ error: "Erro ao listar processos" });
  }
});

app.get("/list/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    const processes = await Requests.find({ list: listId }).select("-__v");
    res.json(processes);
  } catch (error: any) {
    console.error("Erro ao listar processos na lista:", error.message);
    res.status(500).json({ error: "Erro ao listar processos na lista" });
  }
});

app.get("/responses/:response_id", async (req, res) => {
  const { response_id } = req.params;

  try {
    const response = await axios.get(
      `https://requests.prod.judit.io/responses/${response_id}`,
      {
        headers: {
          "api-key": process.env.JUDIT_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      console.error("Erro na resposta da API:", response.status, response.data);
      return res.status(500).json({ error: "Erro na resposta da API" });
    }

    const lawsuitRequest = new LawsuitRequests({
      request_id: response.data.request_id,
      response_id: response.data.response_id,
      response_type: response.data.response_type,
      response_data: response.data.response_data,
      user_id: response.data.user_id,
      created_at: response.data.created_at,
      request_status: response.data.request_status,
      request_created_at: response.data.request_created_at,
    });

    await lawsuitRequest.save();

    res.json(lawsuitRequest);
  } catch (error: any) {
    console.error("Erro ao obter e salvar a resposta:", error.message);
    res.status(500).json({ error: "Erro ao obter e salvar a resposta" });
  }
});

app.get("/responses", async (req, res) => {
  const { request_id } = req.query;

  try {
    const response = await axios.get(
      `https://requests.prod.judit.io/responses?request_id=${request_id}`,
      {
        headers: {
          "api-key": process.env.JUDIT_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      console.error("Erro na resposta da API:", response.status, response.data);
      return res.status(500).json({ error: "Erro na resposta da API" });
    }

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao obter respostas:", error.message);
    res.status(500).json({ error: "Erro ao obter respostas" });
  }
});

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
