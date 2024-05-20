import React, { useEffect, useRef, useState } from "react";

function TextInput({
  type = "text",
  name = "textHere",
  placeholder = "Enter text",
  value = "",
  onChange = () => {},
  label = "Label",
  className = "",
  required = false,
  disabled = false,

  ...restProps
}) {
  const [isFocused, setIsFocused] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused) inputRef.current.focus();
  }, [isFocused]);

  return (
    <div className="relative mt-5">
      <input
        {...restProps}
        ref={inputRef}
        aria-autocomplete="both"
        aria-haspopup="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        className="peer h-10 w-full border-b border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-purple-600"
        placeholder={placeholder}
      />
      <label
        htmlFor={name}
        onClick={() => setIsFocused(Math.random())}
        className="absolute cursor-text left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
}

export default TextInput;
