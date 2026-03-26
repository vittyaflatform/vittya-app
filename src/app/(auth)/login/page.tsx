import AuthOverlayShell from "@/components/auth/AuthOverlayShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-slate-50">
      <AuthOverlayShell showHomeBackground closeHref="/">
        <LoginForm />
      </AuthOverlayShell>
    </main>
  );
}
