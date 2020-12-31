const Button = ({ onClick, text, disabled = false, color, border = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-${color}-100 text-${color}-500 px-4 py-2 rounded shadow-sm
   hover:bg-${color}-300 ${border ? `border border-${color}-500` : ""}`}
  >
    {text}
  </button>
);
export default Button;
