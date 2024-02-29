import { Request, Response } from "express";
import Requests from "../models/Requests";
import RequestService from "../services/RequestService";

class RequestController {
  private requestService: RequestService;

  constructor(requestService: RequestService) {
    this.requestService = requestService;
  }

  async capture(req: Request, res: Response) {
    try {
      const requestData = await this.requestService.createRequest(req.body);
      const request = new Requests(requestData);
      await request.save();
      res.json(request);
    } catch (error: any) {
      console.error("Erro ao capturar processo:", error.message);
      res.status(500).json({ error: "Erro ao capturar processo" });
    }
  }
  async move(req: Request, res: Response) {
    try {
      const { request_id } = req.params;
      const { newList } = req.body;
      const request = await this.requestService.moveRequest(
        request_id,
        newList
      );
      res.json(request);
    } catch (error: any) {
      console.error("Erro ao mover processo:", error.message);
      res.status(500).json({ error: "Erro ao mover processo" });
    }
  }

  async getProcesses(req: Request, res: Response) {
    try {
      const processes = await this.requestService.getProcesses();
      res.json(processes);
    } catch (error: any) {
      console.error("Erro ao listar processos:", error.message);
      res.status(500).json({ error: "Erro ao listar processos" });
    }
  }

  async getProcessesByList(req: Request, res: Response) {
    try {
      const { listId } = req.params;
      const processes = await this.requestService.getProcessesByList(listId);
      res.json(processes);
    } catch (error: any) {
      console.error("Erro ao listar processos na lista:", error.message);
      res.status(500).json({ error: "Erro ao listar processos na lista" });
    }
  }

  async getResponse(req: Request, res: Response) {
    try {
      const { response_id } = req.params;
      const lawsuitRequest = await this.requestService.getResponse(response_id);
      res.json(lawsuitRequest);
    } catch (error: any) {
      console.error("Erro ao obter e salvar a resposta:", error.message);
      res.status(500).json({ error: "Erro ao obter e salvar a resposta" });
    }
  }

  async getResponses(req: Request, res: Response) {
    try {
      const { request_id } = req.query;

      if (typeof request_id !== "string") {
        console.error("request_id deve ser uma string");
        res.status(400).json({ error: "request_id deve ser uma string" });
        return;
      }

      const response = await this.requestService.getResponses(request_id);
      res.json(response);
    } catch (error: any) {
      console.error("Erro ao obter respostas:", error.message);
      res.status(500).json({ error: "Erro ao obter respostas" });
    }
  }
}

export default RequestController;
