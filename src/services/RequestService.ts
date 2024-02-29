import axios from "axios";
import { Search, RequestData } from "../interfaces/request";
import Requests from "../models/Requests";
import LawsuitRequests from "../models/AdditionalData";

class RequestService {
  async createRequest(search: Search): Promise<RequestData> {
    const response = await axios.post<RequestData>(
      "https://requests.prod.judit.io/requests",
      {
        search,
      },
      {
        headers: {
          "api-key": process.env.JUDIT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async moveRequest(request_id: string, newList: string) {
    const request = (await Requests.findOne({ request_id })) as RequestData &
      Search &
      any;
    if (!request) {
      throw new Error("Processo não encontrado");
    }

    request.list = newList;
    request.logs.push({ listId: newList, date: new Date() });
    await request.save();

    return request;
  }

  async getProcesses() {
    return await Requests.find().select("-__v");
  }

  async getProcessesByList(listId: string) {
    return await Requests.find({ list: listId }).select("-__v");
  }

  async getResponse(response_id: string) {
    const response = await axios.get(
      `https://requests.prod.judit.io/responses/${response_id}`,
      {
        headers: {
          "api-key": process.env.JUDIT_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Erro na resposta da API");
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

    return lawsuitRequest;
  }

  async getResponses(request_id: string) {
    const response = await axios.get(
      `https://requests.prod.judit.io/responses?request_id=${request_id}`,
      {
        headers: {
          "api-key": process.env.JUDIT_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Erro na resposta da API");
    }

    return response.data;
  }
}

export default RequestService;
