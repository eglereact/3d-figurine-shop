const Input = ({
  onChange,
  value,
  type,
  name,
  placeholder = null,
  autoComplete = null,
  errors = {},
  label,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-dark uppercase text-xs font-bold mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
            rounded outline-none p-2 my-1
          ${errors[name] ? "shadow-red-400 shadow-sm" : "bg-light-grey "}
        `}
      />
      <div className="text-red-400 text-sm h-4">
        <span className={errors[name] ? "inline-block" : ""}>
          {errors[name] ?? ""}
        </span>
      </div>
    </div>
  );
};
export default Input;
