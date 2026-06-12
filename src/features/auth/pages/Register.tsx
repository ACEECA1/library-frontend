import { Link, useNavigate } from "react-router";
import { User, Lock, Calendar } from "lucide-react";
import { useState } from "react";
import { authApi } from "../../../lib/api";
import logoImg from "../../../imports/mq1jioql-ANP.png";
import { useTranslation } from "react-i18next";
import { InputField } from "../../../components/ui/InputField";

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        firstName,
        lastName,
        dateOfBirth,
        username,
        password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#00502D] p-6 flex flex-col items-center justify-center text-white relative">
          <div className="relative z-10 flex flex-col items-center">
            <img src={logoImg} alt="MDN Logo" className="h-12 object-contain bg-white rounded p-1 mb-3 shadow-sm" />
            <h2 className="text-xl font-bold tracking-wide">{t('auth.requestAccount')}</h2>
            <p className="text-green-100 text-xs mt-1 text-center max-w-[250px]">{t('auth.requestSubtitle')}</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
              {t('auth.registerSuccess')}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label={t('auth.firstName')}
                type="text"
                icon={<User size={18} />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('auth.firstName')}
                required
              />
              <InputField
                label={t('auth.lastName')}
                type="text"
                icon={<User size={18} />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('auth.lastName')}
                required
              />
            </div>
            <InputField
              label={t('auth.dateOfBirth')}
              type="date"
              icon={<Calendar size={18} />}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
            <InputField
              label={t('auth.username')}
              type="text"
              icon={<User size={18} />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('auth.desiredUsername')}
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
            />
            <InputField
              label={t('auth.confirmPassword')}
              type="password"
              icon={<Lock size={18} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button disabled={loading || success} type="submit" className="w-full bg-[#00502D] text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md mt-4 disabled:opacity-70">
              {loading ? t('auth.submitting') : t('auth.submitRequest')}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {t('auth.alreadyApproved')} <Link to="/login" className="text-[#00502D] font-bold hover:underline">{t('auth.signIn')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
