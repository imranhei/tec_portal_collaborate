import HttpKit from "./HttpKit";

export const uploadSettings = {
  headers: {
    Accept: "*/*",
    "content-type": "multipart/form-data",
  },
};

const ApiKit = {
  auth: {
    login: (payload) => HttpKit.post("auth/login", payload),
    refreshToken: (payload) => HttpKit.post("auth/refresh", payload),
  },
};

export default ApiKit;
