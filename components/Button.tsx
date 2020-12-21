const Button = ({ onClick, text, disabled = false }) =>
  <button onClick={onClick} disabled={disabled} className="bg-pink-800 text-white px-4 py-2 rounded shadow-sm">
    {text}
  </button>
export default Button