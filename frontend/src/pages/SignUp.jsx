import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { getApiErrorMessage } from "../services/errorMessage";
import { useToast } from "../components/ToastProvider";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    try{
      const res = await API.post("/signup", {
        username,
        password,
        confirm_password: confirmPassword,
      });
      toast.success(res.data.message || "User created successfully, Login to proceed");
      navigate('/login');
    }catch (err) {
      const status = err.response?.status;
      const message = getApiErrorMessage(err, "Unable to create account");

      if (status === 409) {
        toast.error("Username already exists");
        return;
      }

      if (status === 422) {
        toast.warning(message);
        return;
      }

      toast.error(message);
    }
    
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <form
        onSubmit={handleSubmit}
        className="text-xl md:text-2xl text-gray-300 bg-black border border-gray-700 rounded-2xl p-8 md:p-12"
      >
        {/* Title */}
        <div className="mb-6">
            <div className="text-white text-xl tracking-widest font-semibold">
                SIGN UP
            </div>
            <div className="mb-8 text-gray-500 text-lg tracking-wide">
            -- create user query
            </div>
        </div>

        {/* SQL Styled Signup */}
        <div className="space-y-4 leading-relaxed">
          <div>
            <span className="text-white font-semibold">INSERT INTO</span>{" "}
            <span className="text-gray-300">users</span>{" "}
            (
            <span className="text-gray-300">username</span>,{" "}
            <span className="text-gray-300">password</span>
            )
          </div>

          <div>
            <span className="text-white font-semibold">VALUES</span>{" "}
            (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="bg-transparent border-b-2 border-white focus:outline-none px-2 text-white placeholder-gray-600 w-40"
            />
            , "
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="bg-transparent border-b-2 border-white focus:outline-none px-2 text-white placeholder-gray-600 w-40"
            />
            "
            )
            ;
          </div>

          <div>
            <span className="text-white font-semibold">-- confirm_password</span>{" "}
            = "
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="confirm"
              className="bg-transparent border-b-2 border-white focus:outline-none px-2 text-white placeholder-gray-600 w-40"
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
            EXECUTE INSERT
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 text-lg border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
          >
            BACK TO LOGIN
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-600">
          -- status: ready to insert
        </div>
      </form>
    </div>
  );
}
