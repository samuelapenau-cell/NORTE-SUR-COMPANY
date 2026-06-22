"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetContent() {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const isRedirected = searchParams.get("redirected") === "true";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (isRedirected) setSent(true);
  }, [isRedirected]);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Ingresá tu correo"); return; }
    setSubmitting(true);
    const err = await resetPassword(email.trim());
    setSubmitting(false);
    if (err) {
      setError("Error al enviar el correo. Verificá que el email sea correcto.");
    } else {
      setSent(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (newPassword !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    setSubmitting(true);
    const { error: updateError } = await (await import("@/lib/supabase/client")).createClient().auth.updateUser({ password: newPassword });
    setSubmitting(false);
    if (updateError) {
      setError("Error al actualizar la contraseña");
    } else {
      setUpdated(true);
    }
  };

  if (updated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6 pt-14">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="font-display text-3xl text-paper tracking-[2px] mb-2">Contraseña actualizada</h1>
          <p className="text-sm text-paper/40 font-body mb-6">Tu contraseña se cambió correctamente.</p>
          <Link href="/ingresar" className="text-xs font-mono uppercase tracking-[2px] text-neon hover:text-neon-dim transition-colors">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 pt-14">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-paper tracking-[1px] uppercase leading-[0.9] mb-2">
            {isRedirected ? "Nueva contraseña" : sent ? "Revisá tu correo" : "Recuperar acceso"}
          </h1>
          <p className="text-sm text-stone font-body">
            {isRedirected
              ? "Elegí una contraseña nueva"
              : sent
                ? "Te enviamos un link para restablecer tu contraseña"
                : "Ingresá tu correo y te enviaremos un link"}
          </p>
        </div>

        {isRedirected ? (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="text-[9px] font-mono uppercase tracking-[2px] text-gravel block mb-2">Nueva contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-smoke border border-border text-sm text-paper/80 placeholder-gravel/50 font-body outline-none focus:border-neon/40 transition-all" />
            </div>
            <div>
              <label className="text-[9px] font-mono uppercase tracking-[2px] text-gravel block mb-2">Confirmar contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-smoke border border-border text-sm text-paper/80 placeholder-gravel/50 font-body outline-none focus:border-neon/40 transition-all" />
            </div>
            {error && <div className="px-4 py-3 bg-neon/5 border border-neon/20"><p className="text-[10px] font-mono text-neon">{error}</p></div>}
            <button type="submit" disabled={submitting} className="w-full py-3 bg-neon text-ink text-sm font-mono uppercase tracking-[2px] hover:bg-neon-dim disabled:opacity-30 transition-all">{submitting ? "..." : "Actualizar contraseña"}</button>
          </form>
        ) : sent ? (
          <div className="text-center">
            <Link href="/ingresar" className="text-xs font-mono uppercase tracking-[2px] text-neon hover:text-neon-dim transition-colors">Volver a inicio de sesión</Link>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="space-y-5">
            <div>
              <label className="text-[9px] font-mono uppercase tracking-[2px] text-gravel block mb-2">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email" className="w-full px-4 py-3 bg-smoke border border-border text-sm text-paper/80 placeholder-gravel/50 font-body outline-none focus:border-neon/40 transition-all" />
            </div>
            {error && <div className="px-4 py-3 bg-neon/5 border border-neon/20"><p className="text-[10px] font-mono text-neon">{error}</p></div>}
            <button type="submit" disabled={submitting} className="w-full py-3 bg-neon text-ink text-sm font-mono uppercase tracking-[2px] hover:bg-neon-dim disabled:opacity-30 transition-all">{submitting ? "..." : "Enviar link"}</button>
          </form>
        )}

        {!isRedirected && (
          <div className="mt-8 text-center">
            <Link href="/ingresar" className="text-[10px] font-mono uppercase tracking-[2px] text-gravel hover:text-neon transition-colors">← Volver</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecuperarPage() {
  return (
    <Suspense fallback={null}>
      <ResetContent />
    </Suspense>
  );
}
