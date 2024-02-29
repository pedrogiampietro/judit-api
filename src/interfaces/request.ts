export type Search = {
  search_type: string;
  search_key: string;
};

export type RequestData = {
  request_id: string;
  search: Search;
  origin: string;
  origin_id: string;
  user_id: string;
  status: string;
  tags: string[];
  list: string;
  logs: Array<{ listId: string; date: Date }>;
  created_at: string;
  updated_at: string;
};
