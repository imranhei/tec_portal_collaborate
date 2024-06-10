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
  userJob: {
    getJobs: (params) => HttpKit.get("jobs", { params }),
    getJobSheets: (params) => HttpKit.get("user/job-sheets", { params }),
    getUserJob: (params) => HttpKit.get("user/job", { params }),
  },
  timeSheet: {
    postTimeSheets: (payload) => HttpKit.post("time-sheets", payload),
    getTimeSheets: (params) => HttpKit.get("time-sheets", { params }),
    getTimeSheetDetails: (alias, params) =>
      HttpKit.get(`time-sheets/${alias}`, { params }),
    getTimeSheetHistory: (alias, params) =>
      HttpKit.get(`time-sheets/${alias}/history`, { params }),
    updateTimeSheet: (alias, payload) =>
      HttpKit.put(`time-sheets/${alias}`, payload),
  },
  jobSheet: {
    getJobSheet: (params) => HttpKit.get(`user/job-sheets`, { params }),
  },
  role: {
    getRoles: (params) => HttpKit.get("roles", { params }),
  },
  user: {
    getUser: (params) => HttpKit.get("users", { params }),
    updateUser: (alias, payload) => HttpKit.post(`users/${alias}`, payload),
    deleteUser: (alias) => HttpKit.delete(`users/${alias}`),
    postUser: (payload) => HttpKit.post("users", payload),
  },
  supervisors: {
    getSupervisors: (params) => HttpKit.get("supervisors", { params }),
    postAssignSupervisor: (payload) =>
      HttpKit.post("electrician-supervisors", payload),
  },
};

export default ApiKit;
