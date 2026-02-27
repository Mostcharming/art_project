import loginImage from "../assets/login/Section.svg";

export default function Login() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-4">Login Page</h1>
        <p className="text-gray-600 mb-8">
          Welcome! Please log in to continue.
        </p>
        <form className="w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            className="mb-4 w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
      <div className="flex w-1/2 items-center justify-center bg-blue-50 sm:hidden">
        <img
          src={loginImage}
          alt="Login Visual"
          className="max-w-xs rounded shadow-lg"
        />
      </div>
    </div>
  );
}
