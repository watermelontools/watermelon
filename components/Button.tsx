const Button = ({ onClick, text="Button", disabled = false, color="pink", border = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-${color}-100 text-${color}-500 px-4 text-base rounded shadow-sm
   hover:bg-${color}-300 ${border ? `border border-${color}-500` : ""}`}
  >
    {text}
  </button>
);
export default Button;
