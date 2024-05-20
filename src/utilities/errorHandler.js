import { get } from "lodash";
import { toastError } from "../shared/toastHelper";
import cleaner from "../storage/cleaner";

export function errorHandler(response) {
  const errorResponse = response;
  const status = get(errorResponse, "status", 0);
  if (status) {
    toastError({
      message:
        status === 500
          ? "Internal server error"
          : status === 403
          ? "Unauthorized User Information"
          : status === 401
          ? "Unauthorized User Information"
          : "Something went wrong",
    });
  }

  if (status === 401 || status === 403 || status === 302) {
    cleaner();
    window.location.href = "/login";
  }
  // if 403 error, redirect to login page
  if (status === 403) {
    cleaner();
    window.location.href = "/login";
  }
}
