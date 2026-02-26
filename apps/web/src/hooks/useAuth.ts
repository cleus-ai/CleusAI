import { useAppStore } from "@/store/app.store";
import { useRouter } from "next/navigation";
import { login as apiLogin, logout as apiLogout, register as apiRegister } from "@/lib/api/auth";

export function useAuth() {
  const { user, setUser } = useAppStore();
  const router = useRouter();
  const login = async (email: string, password: string) => { const u = await apiLogin(email, password); setUser(u); router.push("/chat"); };
  const register = async (email: string, username: string, password: string) => { const u = await apiRegister(email, username, password); setUser(u); router.push("/chat"); };
  const logout = async () => { await apiLogout(); setUser(null); router.push("/auth/login"); };
  return { user, login, register, logout, isAuthenticated: !!user };
}
