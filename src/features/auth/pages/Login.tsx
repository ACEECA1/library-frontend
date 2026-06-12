import { Link, useNavigate } from "react-router";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import { authApi } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import logoImg from "../../../imports/image.svg";
import { useTranslation } from "react-i18next";
import { InputField } from "../../../components/ui/InputField";

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      if (response.data?.data?.accessToken && response.data?.data?.refreshToken) {
        await login(response.data.data.accessToken, response.data.data.refreshToken);
        navigate('/');
      } else {
        setError(t('auth.invalidResponse'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#00502D] p-8 flex flex-col items-center justify-center text-white relative">
          <div className="relative z-10 flex flex-col items-center">
            <img src={logoImg} alt="MDN Logo" className="h-16 object-contain bg-white rounded p-1 mb-4 shadow-lg" />
            <h2 className="text-2xl font-bold tracking-wide">{t('auth.welcomeBack')}</h2>
            <p className="text-green-100 text-sm mt-1">{t('auth.systemSubtitle')}</p>
          </div>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
              label={t('auth.username')}
              type="text"
              icon={<User size={18} />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('auth.enterUsername')}
              required
            />
            <InputField 
              label={t('auth.password')}
              type="password"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              rightElement={
                <span className="text-xs text-gray-500 italic">{t('auth.forgotPasswordHint', 'If forgotten, contact an admin. Cannot reset.')}</span>
              }
            />
            <button disabled={loading} type="submit" className="w-full bg-[#00502D] text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md mt-2 disabled:opacity-70">
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {t('auth.noAccount')} <Link to="/register" className="text-[#00502D] font-bold hover:underline">{t('auth.requestAccess')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
