import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { useEffect } from "react";


export default function HomePage() {
  const navigate = useNavigate();

  const scrollToDetails = () => {
    const el = document.getElementById("demo-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    API.get("/me")
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => setCheckingSession(false));
  }, [navigate]);
  

  return (
    <div className="bg-black text-white font-mono min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="text-xl font-bold tracking-widest">Natural Language → SQL</div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-white hover:bg-white hover:text-black transition"
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-white text-black hover:bg-black hover:text-white transition"
          >
            SIGN UP
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Turn Plain English Into
          <br />
          <span>Powerful SQL Queries</span>
        </h1>

        <p className="text-gray-400 max-w-xl">
          Just type what you want. We convert it into optimized SQL and even explain it back to you.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-8 py-3 bg-white text-black text-lg hover:bg-gray-200 transition"
        >
          TRY NOW → LOGIN
        </button>

        {/* Scroll Hint */}
        <button
          onClick={scrollToDetails}
          className="mt-4 text-gray-500 hover:text-white transition text-sm animate-pulse"
        >
          ↓ scroll down for more details ↓
        </button>
      </div>

      {/* Demo Section */}
      <div id="demo-section" className="px-6 md:px-20 py-20 space-y-16">
        <h2 className="text-3xl font-semibold text-center">
          See It In Action
        </h2>

        {/* Example 1 */}
        <div className="border border-gray-700 p-6 space-y-4 hover:border-white transition">
          <div className="text-gray-400">Natural Language</div>
          <div className="text-lg">"Get all users who joined after 2020"</div>

          <div className="text-white animate-pulse">↓ converts to ↓</div>

          <div className="bg-black border border-gray-700 p-4">
            SELECT * FROM users WHERE join_date &gt; '2020-01-01';
          </div>

          <div className="text-white animate-pulse">↓ explanation ↓</div>

          <div className="text-gray-300">
            Fetches all users whose join date is after 2020.
          </div>
        </div>

        {/* Example 2 */}
        <div className="border border-gray-700 p-6 space-y-4 hover:border-white transition">
          <div className="text-gray-400">Natural Language</div>
          <div className="text-lg">"Show top 5 highest paid employees"</div>

          <div className="text-white animate-pulse">↓ converts to ↓</div>

          <div className="bg-black border border-gray-700 p-4">
            SELECT * FROM employees ORDER BY salary DESC LIMIT 5;
          </div>

          <div className="text-white animate-pulse">↓ explanation ↓</div>

          <div className="text-gray-300">
            Retrieves top 5 employees sorted by highest salary.
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 md:px-20 py-20 border-t border-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-12">Why Use This?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-800 p-6 hover:border-white transition hover:scale-105">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-lg font-semibold">Instant SQL</div>
            <p className="text-gray-400 mt-2 text-sm">
              Convert natural language into SQL instantly without memorizing syntax.
            </p>
          </div>

          <div className="border border-gray-800 p-6 hover:border-white transition hover:scale-105">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-lg font-semibold">Smart Explanation</div>
            <p className="text-gray-400 mt-2 text-sm">
              Understand every query in simple English like you're learning.
            </p>
          </div>

          <div className="border border-gray-800 p-6 hover:border-white transition hover:scale-105">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-lg font-semibold">Boost Productivity</div>
            <p className="text-gray-400 mt-2 text-sm">
              Save time and focus on logic instead of syntax.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 space-y-6">
        <h2 className="text-3xl font-bold">
          Ready to Query Smarter?
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 bg-white text-black text-lg hover:bg-gray-200 transition"
        >
          LOGIN & START
        </button>
      </div>
    </div>
  );
}
