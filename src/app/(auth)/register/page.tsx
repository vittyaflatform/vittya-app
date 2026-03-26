import AuthOverlayShell from "@/components/auth/AuthOverlayShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-slate-50">
      <AuthOverlayShell showHomeBackground closeHref="/">
        <RegisterForm />
      </AuthOverlayShell>
    </main>
  );
}
