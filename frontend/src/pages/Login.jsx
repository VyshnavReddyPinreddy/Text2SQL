import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { getApiErrorMessage } from "../services/errorMessage";
import { useToast } from "../components/ToastProvider";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    API.get("/me")
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => setCheckingSession(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", 
        {
          username,
          password
        }
      );
      toast.success(res.data.message || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const message = getApiErrorMessage(err, "Unable to login");

      if (status === 400 || status === 404 || status === 401) {
        toast.error("Wrong username or password");
        return;
      }

      toast.error(message);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <form
        onSubmit={handleSubmit}
        className="text-xl md:text-2xl text-gray-300 bg-black border border-gray-700  p-8 md:p-12"
      >
        {/* Title */}
        {/* Header */}
        <div className="mb-6">
            <div className="text-white text-xl tracking-widest font-semibold">
                LOGIN
            </div>
            <div className="text-gray-500 text-sm mt-1">
                -- authenticate user query
            </div>
        </div>

        {/* SQL Query Style */}
        <div className="space-y-4 leading-relaxed">
          <div>
            <span className="text-white font-semibold">SELECT</span>{" "}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="bg-transparent border-b-2 border-white focus:outline-none px-2 text-white placeholder-gray-600 w-48"
            />{" "}
            <span className="text-white font-semibold">FROM</span>{" "}
            <span className="text-gray-300">users</span>
          </div>

          <div>
            <span className="text-white font-semibold">WHERE</span>{" "}
            <span className="text-gray-300">password</span>{" "}
            = "
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-transparent border-b-2 border-white focus:outline-none px-2 text-white placeholder-gray-600 w-48"
            />
            ";
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 space-y-4">
          <button
            type="submit"
            className="w-full py-3 text-lg bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            RUN QUERY
          </button>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full py-3 text-lg border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-600">
          -- status: waiting for execution
        </div>
      </form>
    </div>
  );
}
