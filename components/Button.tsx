const Button = ({ onClick, text, disabled = false }) =>
  <button onClick={onClick} disabled={disabled}>
    {text}
  </button>
export default Button