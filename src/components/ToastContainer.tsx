"use client";

import Link from "next/link";
import { useToastStore } from "@/lib/stores/toast-store";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-toast-in px-4 py-3 rounded-sm border text-sm font-mono tracking-[0.5px] shadow-lg flex items-center gap-3 min-w-[240px] max-w-[360px]"
          style={{
            backgroundColor: toast.type === "error" ? "#1a0808" : toast.type === "info" ? "#0f1419" : "#0f1a10",
            borderColor: toast.type === "error" ? "rgba(140,47,27,0.3)" : toast.type === "info" ? "rgba(201,168,118,0.3)" : "rgba(201,168,118,0.3)",
            color: toast.type === "error" ? "#C9A876" : toast.type === "info" ? "#C9A876" : "#C9A876",
          }}
          role="alert"
        >
          <span className="flex-1 text-xs">
            {toast.message}
            {toast.type === "info" && toast.message.includes("Iniciá sesión") && (
              <>
                {" "}
                <Link
                  href="/ingresar"
                  className="underline hover:no-underline font-bold whitespace-nowrap"
                  onClick={() => removeToast(toast.id)}
                >
                  Ingresar
                </Link>
              </>
            )}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-40 hover:opacity-100 transition-opacity text-current"
            aria-label="Cerrar"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
