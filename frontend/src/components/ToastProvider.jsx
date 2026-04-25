import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const toastStyles = {
  success: "border-emerald-500/60 text-emerald-200",
  error: "border-red-500/60 text-red-200",
  warning: "border-yellow-500/60 text-yellow-100",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();

    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(
    () => ({
      success: (message) => showToast(message, "success"),
      error: (message) => showToast(message, "error"),
      warning: (message) => showToast(message, "warning"),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 font-mono">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border bg-black px-4 py-3 text-sm shadow-lg ${toastStyles[toast.type]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
