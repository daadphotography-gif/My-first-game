import { useEffect, useState, ReactNode } from "react";

const SUPABASE_URL = "https://nphkdrhyjiatrhjmguix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waGtkcmh5amlhdHJoam1ndWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTIyMTQsImV4cCI6MjA5MjU4ODIxNH0.fDzG29ZPwvWIWeqdTwDmo1T4qyvLx_kb_L3e-tSBpLA";
const GATEWAY_URL = "https://dahaleezgames.com";
const STORAGE_KEY = "game_access_token";

interface AccessGateProps {
  children: ReactNode;
}

type Status = "checking" | "authorized" | "denied";

export default function AccessGate({ children }: AccessGateProps) {
  const [status, setStatus] = useState<Status>("checking");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      try {
        const url = new URL(window.location.href);
        const urlToken = url.searchParams.get("token");
        const storedToken = localStorage.getItem(STORAGE_KEY);
        const token = urlToken || storedToken;

        if (!token) {
          setErrorMsg("لا يوجد رمز دخول. الرجاء الدخول عبر البوابة.");
          setStatus("denied");
          setTimeout(() => window.location.replace(GATEWAY_URL), 2500);
          return;
        }

        const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-game-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.valid) {
          localStorage.removeItem(STORAGE_KEY);
          setErrorMsg("انتهت صلاحية الجلسة أو الرمز غير صالح.");
          setStatus("denied");
          setTimeout(() => window.location.replace(GATEWAY_URL), 2500);
          return;
        }

        localStorage.setItem(STORAGE_KEY, token);

        if (urlToken) {
          url.searchParams.delete("token");
          window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
        }

        setStatus("authorized");
      } catch (e: any) {
        setErrorMsg(e?.message || "حدث خطأ أثناء التحقق.");
        setStatus("denied");
        setTimeout(() => window.location.replace(GATEWAY_URL), 2500);
      }
    };

    verify();
  }, []);

  if (status === "checking") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#fff", direction: "rtl", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p>جارٍ التحقق من صلاحية الدخول...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#fff", direction: "rtl", fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>الوصول مرفوض</h1>
          <p style={{ opacity: 0.85, marginBottom: 16 }}>{errorMsg}</p>
          <a href={GATEWAY_URL} style={{ display: "inline-block", marginTop: 16, padding: "10px 18px", background: "#3B82F6", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
            الذهاب إلى البوابة الآن
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
