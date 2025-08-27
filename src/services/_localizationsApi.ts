import axios from "axios";
// import { apiConfig } from "../config";

export const getLocalizations = () => {
  return axios.get(`/api/templates/byType/mibs`);
};
