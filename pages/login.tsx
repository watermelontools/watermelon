export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form action="/api/login" method="post">
        <label htmlFor="email">
          Email:
          <input type="email" name="email" required id="email" />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            required
            id="password"
            minLength={6}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
