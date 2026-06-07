import { Link, useNavigate } from "react-router";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import { authApi } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import logoImg from "../../../imports/mq1jioql-ANP.png";
import { useTranslation } from "react-i18next";

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login({ username, password });
      if (response.data?.data?.accessToken) {
        await login(response.data.data.accessToken);
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.username')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-shadow"
                  placeholder={t('auth.enterUsername')}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                <a href="#" className="text-xs text-[#00502D] hover:underline font-medium">{t('auth.forgotPassword')}</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-shadow"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
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
