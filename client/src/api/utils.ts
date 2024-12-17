import { Query } from "./types";

export const formatQueryString = (query: Query) => {
  let formattedQuery = "?";

  if (query.limit) {
    formattedQuery += `limit=${query.limit}&`;
  } else {
    formattedQuery += `limit=10&`;
  }
  if (query.page) {
    formattedQuery += `page=${query.page}&`;
  } else {
    formattedQuery += `page=0&`;
  }
  if (query.search) {
    formattedQuery += `search=${query.search}&`;
  }
  if (query.stockStatus) {
    formattedQuery += `stockStatus=${query.stockStatus}&`;
  }
  if (query.sortBy) {
    formattedQuery += `${query.sortBy}=${query.sortOrder}&`;
  }

  if (formattedQuery[formattedQuery.length - 1] === "&") {
    formattedQuery = formattedQuery.slice(0, -1);
  }

  return formattedQuery;
};
