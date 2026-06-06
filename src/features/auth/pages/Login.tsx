import { Link, useNavigate } from "react-router";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import logoImg from "../../../imports/mq1jioql-ANP.png";

export function Login() {
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
      const response = await api.post('/auth/login', { username, password });
      if (response.data?.data?.accessToken) {
        await login(response.data.data.accessToken);
        navigate('/');
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
            <h2 className="text-2xl font-bold tracking-wide">Welcome Back</h2>
            <p className="text-green-100 text-sm mt-1">Digital Library Management System</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-shadow"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-[#00502D] hover:underline font-medium">Forgot Password?</a>
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
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-[#00502D] font-bold hover:underline">Request Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
