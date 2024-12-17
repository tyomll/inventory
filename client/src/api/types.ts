export interface Query {
  limit?: number;
  page?: number;
  search?: string;
  stockStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
