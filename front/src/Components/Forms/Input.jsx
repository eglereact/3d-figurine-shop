import { CiCircleAlert } from "react-icons/ci";

const Input = ({
  onChange,
  value,
  type,
  name,
  placeholder = null,
  autoComplete = null,
  errors = {},
  label = null,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col">
      <div class="flex flex-col gap-2">
        <div class="bg-pink rounded-lg">
          <div class="relative bg-inherit">
            <input
              id={name}
              placeholder={placeholder}
              type={type}
              name={name}
              onChange={onChange}
              value={value}
              disabled={disabled}
              autoComplete={autoComplete}
              className={`
           peer custom-autofill w-full bg-transparent h-10 rounded-lg text-grey placeholder-transparent ring-1 px-2 ring-[#3A3A3E] focus:ring-[#3A3A3E] focus:outline-none focus:border-rose-600
          ${errors[name] ? "ring-[#984B2C] shadow-sm" : "bg-grey"}
        `}
            />
            <label
              for={name}
              className="absolute cursor-text left-0 -top-3 text-sm text-grey bg-inherit mx-2 px-1 pt-0.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-grey peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-grey peer-focus:text-sm transition-all"
            >
              {label}
            </label>
            {errors[name] && (
              <span className="absolute inset-y-0 right-2 flex items-center text-[#984B2C]">
                <CiCircleAlert size={30} />
              </span>
            )}
          </div>
          <div className="text-[#984B2C] text-sm">
            <span className={errors[name] ? "inline-block" : ""}>
              {errors[name] ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Input;
