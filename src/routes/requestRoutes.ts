import { Express } from "express";
import RequestController from "../controllers/RequestController";

class RequestRoutes {
  private requestController: RequestController;

  constructor(requestController: RequestController) {
    this.requestController = requestController;
  }

  routes(app: Express) {
    app.post("/capture", (req, res) =>
      this.requestController.capture(req, res)
    );
    app.put("/move/:request_id", (req, res) =>
      this.requestController.move(req, res)
    );
    app.get("/processes", (req, res) =>
      this.requestController.getProcesses(req, res)
    );
    app.get("/list/:listId", (req, res) =>
      this.requestController.getProcessesByList(req, res)
    );
    app.get("/responses/:response_id", (req, res) =>
      this.requestController.getResponse(req, res)
    );
    app.get("/responses", (req, res) =>
      this.requestController.getResponses(req, res)
    );
  }
}

export default RequestRoutes;
