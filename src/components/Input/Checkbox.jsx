const CheckBox = (props) => {
  const {
    value,
    label,
    size,
    id,
    name,
    disabled = false,
    className,
    ...restprops
  } = props;
  return (
    <div className={`flex ${className ? className : ""}`}>
      <input
        id={label + id}
        type="checkbox"
        name={name}
        disabled={disabled}
        value={value}
        className={`${size === "sm" ? "w-3 h-3 p-1" : "w-4 h-4 p-2"} ${
          disabled
            ? "cursor-not-allowed opacity-50 text-disableAccent placeholder:text-disableInputPlaceholder arrow-hide"
            : "cursor-pointer "
        } text-teal dark:text-secondary dark:bg-secondary mt-1 border border-accent dark:checked:border-accent dark:checked:bg-secondary hover:border-accent focus:ring-0 focus:ring-transparent rounded-sm`}
        {...restprops}
      />
      {label ? (
        <label
          htmlFor={label + id}
          className={`ml-2 ${
            disabled
              ? "cursor-not-allowed opacity-50 !text-disableAccent placeholder:text-disableInputPlaceholder arrow-hide"
              : "cursor-pointer "
          } text-${
            size === "sm" ? "xs" : "md"
          } font-medium break-all text-accent`}
        >
          {label}
        </label>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CheckBox;
