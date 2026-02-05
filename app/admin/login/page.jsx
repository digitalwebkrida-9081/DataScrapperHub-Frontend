
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple Client-Side Check for Static Export
        // Note: In a real static app, secrets are visible in JS. 
        // ideally getting a token from an external API is better, but this matches the user's "simple" requirement.
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

        if (password === correctPassword) {
            localStorage.setItem('admin_auth', 'true');
            // Set a cookie too just in case we switch back, but primarily rely on storage for client-side
            document.cookie = "admin_auth=true; path=/";
            router.push('/admin/leads');
        } else {
            setError('Invalid password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
                    <p className="text-slate-500 text-sm mt-2">Enter your password to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
