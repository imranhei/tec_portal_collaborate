import axios from "axios";
import get from "lodash/get";
import { BASE_URL } from "../../common/constant";
import { toastError } from "../../shared/toastHelper";

const HttpKit = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

HttpKit.interceptors.request.use(
  (config) => {
    const token = window?.localStorage?.getItem("refresh_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

HttpKit.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = get(error, "response.status");
    if (status === 500) {
      toastError({ message: "Internal Server Error" });
      // window.location.reload();
    }
    if (status === 401) {
      //       cleaner();
      //       window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default HttpKit;
