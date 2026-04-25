import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [queryMode, setQueryMode] = useState("natural");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [naturalResponse, setNaturalResponse] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableInfo, setTableInfo] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState("");

  const loadTables = async () => {
    setSchemaLoading(true);
    setSchemaError("");

    try {
      const res = await API.get("/tables");
      setTables(res.data);

      if (res.data.length > 0) {
        await loadTableInfo(res.data[0]);
      }
    } catch (err) {
      setSchemaError(err.response?.data?.detail || "Unable to load tables");
    } finally {
      setSchemaLoading(false);
    }
  };

  const loadTableInfo = async (tableName) => {
    setSelectedTable(tableName);
    setSchemaLoading(true);
    setSchemaError("");

    try {
      const res = await API.get(`/tables/${tableName}`);
      setTableInfo(res.data);
    } catch (err) {
      setSchemaError(err.response?.data?.detail || "Unable to load table structure");
    } finally {
      setSchemaLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (err) {
      console.error(err);
    }
    navigate("/login");
  };

  const executeQuery = async () => {
    setResult(null);
    setMeta(null);
    setNaturalResponse(null);
    setLoading(true);

    const start = performance.now();

    try {
      const endpoint = queryMode === "natural" ? "/talk/natural" : "/talk";
      const payload =
        queryMode === "natural"
          ? { question: query }
          : { sql_command: query };

      const res = await API.post(endpoint, payload);
      const end = performance.now();

      if (res.data.data) {
        setResult(res.data.data);
        if (queryMode === "natural") {
          setNaturalResponse({
            question: res.data.question,
            generatedSql: res.data.generated_sql,
            explanation: res.data.explanation,
          });
        }
        setMeta({
          rows: res.data.data.length,
          cols: Object.keys(res.data.data[0] || {}).length,
          time: (end - start).toFixed(2),
        });
      } else {
        setResult(null);
        setMeta({ message: res.data.message, time: (end - start).toFixed(2) });
      }
    } catch (err) {
      setMeta({ error: err.response?.data?.detail || "Query failed" });
    } finally {
      setLoading(false);
    }
  };

  const renderColumns = (columns) => (
    <div className="overflow-auto border border-gray-800">
      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
        <thead className="bg-zinc-900 text-gray-300">
          <tr>
            <th className="border-b border-gray-800 p-3">column</th>
            <th className="border-b border-gray-800 p-3">type</th>
            <th className="border-b border-gray-800 p-3">nullable</th>
            <th className="border-b border-gray-800 p-3">key</th>
            <th className="border-b border-gray-800 p-3">default</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((column) => (
            <tr key={column.column} className="border-b border-gray-900 odd:bg-zinc-950 even:bg-zinc-900/70">
              <td className="p-3 text-white">{column.column}</td>
              <td className="p-3 text-cyan-200">{column.type}</td>
              <td className={column.nullable === "NO" ? "p-3 text-red-300" : "p-3 text-gray-300"}>
                {column.nullable}
              </td>
              <td className="p-3 text-emerald-300">
                {column.primary_key ? "PRIMARY" : column.foreign_key || "EMPTY"}
              </td>
              <td className="max-w-[240px] truncate p-3 text-gray-400" title={column.default || "NULL"}>
                {column.default || "NULL"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6 font-mono text-white">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold tracking-widest">DASHBOARD</div>
          <div className="mt-1 text-sm text-gray-500">
            -- execute sql and inspect database schema
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="border border-white px-4 py-2 text-white hover:bg-white hover:text-black"
        >
          LOGOUT
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
        <section className="min-w-0">
          <div className="mb-6 border border-gray-700 p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setQueryMode("natural");
                  setQuery("");
                  setResult(null);
                  setMeta(null);
                  setNaturalResponse(null);
                }}
                className={`border px-4 py-2 text-sm ${
                  queryMode === "natural"
                    ? "border-white bg-white text-black"
                    : "border-gray-700 text-gray-300 hover:border-white hover:text-white"
                }`}
              >
                NATURAL LANGUAGE
              </button>
              <button
                onClick={() => {
                  setQueryMode("sql");
                  setQuery("");
                  setResult(null);
                  setMeta(null);
                  setNaturalResponse(null);
                }}
                className={`border px-4 py-2 text-sm ${
                  queryMode === "sql"
                    ? "border-white bg-white text-black"
                    : "border-gray-700 text-gray-300 hover:border-white hover:text-white"
                }`}
              >
                SQL QUERY
              </button>
            </div>

            <div className="mb-2 text-white">
              {queryMode === "natural" ? "-- ask in natural language" : "-- enter sql query"}
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={10}
              placeholder={
                queryMode === "natural"
                  ? "Show students placed with their company name and salary"
                  : "SELECT * FROM students;"
              }
              className="w-full resize-y border border-white bg-black p-3 text-white focus:outline-none"
            />

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                className="bg-white px-6 py-2 text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
              >
                {loading ? "RUNNING..." : "EXECUTE"}
              </button>
              <span className="text-sm text-gray-500">
                scroll down to view the results
              </span>
            </div>
          </div>

          {naturalResponse && (
            <div className="mb-4 border border-gray-700 p-4">
              <div className="mb-3">
                <div className="text-xs text-gray-500">generated_sql</div>
                <pre className="mt-1 overflow-auto whitespace-pre-wrap border border-gray-800 bg-zinc-950 p-3 text-sm text-cyan-200">
                  {naturalResponse.generatedSql}
                </pre>
              </div>

              <div>
                <div className="text-xs text-gray-500">explanation</div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-gray-300">
                  {naturalResponse.explanation}
                </div>
              </div>
            </div>
          )}

          {meta && (
            <div className="mb-4 text-sm text-gray-400">
              {meta.error && <pre className="whitespace-pre-wrap text-red-400">{meta.error}</pre>}
              {meta.message && <div>{meta.message}</div>}
              {meta.rows !== undefined && (
                <div>
                  Rows: {meta.rows} | Columns: {meta.cols} | Time: {meta.time} ms
                </div>
              )}
            </div>
          )}

          {result && result.length > 0 && (
            <div className="overflow-auto border border-gray-700">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-white">
                  <tr>
                    {Object.keys(result[0]).map((col) => (
                      <th key={col} className="p-2 text-white">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="p-2 text-gray-300">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="min-w-0 border border-gray-700">
          <div className="border-b border-gray-800 p-4">
            <div className="text-white tracking-widest">DATABASE STRUCTURE</div>
            <div className="mt-1 text-sm text-gray-500">-- public schema tables and columns</div>
          </div>

          <div className="p-4">
            {schemaLoading && <div className="text-sm text-gray-400">Loading schema...</div>}
            {schemaError && <div className="mb-4 text-sm text-red-400">{schemaError}</div>}

            {tables.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {tables.map((table) => (
                  <button
                    key={table}
                    onClick={() => loadTableInfo(table)}
                    className={`border px-3 py-2 text-sm ${
                      selectedTable === table
                        ? "border-white bg-white text-black"
                        : "border-gray-700 text-gray-300 hover:border-white hover:text-white"
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>
            )}

            {tableInfo && (
              <div>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">selected_table</div>
                    <div className="text-lg text-white">{tableInfo.table}</div>
                  </div>
                  <div className="text-sm text-gray-400">{tableInfo.columns.length} columns</div>
                </div>
                {renderColumns(tableInfo.columns)}
              </div>
            )}
          </div>
        </aside>
      </div>
      <div className="text-xs text-gray-500 mt-6">
        Icon made by Pixel perfect from www.flaticon.com
      </div>
    </div>
  );
}
