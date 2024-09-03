export default function Textarea({
  onChange,
  value,
  type,
  name,
  label = null,
  placeholder = null,
  autoComplete = null,
  errors = {},
}) {
  return (
    <>
      {/* <div className="error-text">
        <span className={errors[name] ? "show" : ""}>{errors[name] ?? ""}</span>
      </div> */}
      {/* {label && <label htmlFor={name}>{label}</label>} */}
      <textarea
        className={`
            w-full bg-transparent h-60 rounded-lg text-grey placeholder-[#3A3A3E] text-sm ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
          ${errors[name] ? "ring-[#984B2C] shadow-sm" : "bg-grey"}
        `}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </>
  );
}
