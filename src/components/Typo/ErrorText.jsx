import React from "react";

function ErrorText({ error, required = false }) {
  return (
    <div className="text-xs text-red-500">
      {error ? error : required && "Something went wrong!"}
    </div>
  );
}

export default ErrorText;
