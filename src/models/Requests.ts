import mongoose, { Schema, Document } from "mongoose";

interface Search {
  search_type: string;
  search_key: string;
  search_params: Record<string, unknown>;
}

interface Request extends Document {
  request_id: string;
  search: Search;
  origin: string;
  origin_id: string;
  user_id: string;
  status: string;
  tags: Record<string, unknown>;
  list: Record<string, unknown>;
  logs: Array<Record<string, unknown>>;
  created_at: Date;
  updated_at: Date;
}

const LogSchema = new Schema({
  listId: String,
  date: { type: Date, default: Date.now },
});

const SearchSchema = new Schema<Search>({
  search_type: String,
  search_key: String,
  search_params: Schema.Types.Mixed,
});

const RequestsSchema = new Schema<Request>({
  request_id: String,
  search: SearchSchema,
  origin: String,
  origin_id: String,
  user_id: String,
  status: String,
  list: { type: String, default: "backlog" },
  tags: Schema.Types.Mixed,
  logs: [LogSchema],
  created_at: Date,
  updated_at: Date,
});

const Requests = mongoose.model<Request>("Requests", RequestsSchema);

export default Requests;
