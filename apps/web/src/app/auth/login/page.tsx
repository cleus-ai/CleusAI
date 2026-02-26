import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In — Cleus AI" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <LoginForm />
    </main>
  );
}
