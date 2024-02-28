import mongoose, { Schema, Document } from "mongoose";

interface Lawyer {
  name: string;
  document: string;
  document_type: string;
  license: string;
}

interface Party {
  name: string;
  document: string;
  document_type: string;
  person_type: string;
  side: string;
  lawyers: Lawyer[];
}

interface Crawler {
  code: string;
  updated_at: Date;
  weight: number;
}

interface Step {
  step_id: string;
  step_date: Date;
  content: string;
  step_type: string;
}

interface Classification {
  code: string;
  name: string;
}

interface ResponseData {
  code: string;
  instance: number;
  lawsuit_cnj: string;
  crawler: Record<string, Crawler>;
  parties: Party[];
  subjects: any[];
  related_lawsuits: any[];
  created_at: Date;
  updated_at: Date;
  last_step: Step;
  classification: Classification;
  name: string;
  distribution_date: Date;
  free_justice: boolean;
  judge: string | null;
  justice: string;
  secrecy_level: number;
  tribunal: string;
  tribunal_acronym: string;
  tribunal_id: string;
}

interface Request extends Document {
  request_id: string;
  response_id: string;
  response_type: string;
  response_data: ResponseData;
  user_id: string;
  created_at: Date;
  request_status: string;
  request_created_at: Date;
}

const LawsuitRequestsSchema = new Schema<Request>({
  request_id: String,
  response_id: String,
  response_type: String,
  response_data: Schema.Types.Mixed,
  user_id: String,
  created_at: Date,
  request_status: String,
  request_created_at: Date,
});

const LawsuitRequests = mongoose.model<Request>(
  "LawsuitRequests",
  LawsuitRequestsSchema
);

export default LawsuitRequests;
