// // app/login/page.tsx - Login Page
// 'use client';

// import { FormEvent, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setLoading(true);

//         try {
//             const res = await fetch('/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || 'Login failed');
//             }

//             localStorage.setItem('userDetails', JSON.stringify(data.user));
//             router.push('/admin');
//             router.refresh();
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
//                 <h2 className="text-2xl font-bold text-center">Admin Login</h2>
//                 {error && (
//                     <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>
//                 )}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                     >
//                         {loading ? 'Loading...' : 'Sign in'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }







// app/login/page.tsx - Enhanced Login Page
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'; // Assuming you have a custom Input component
import { Button } from '@/components/ui/button'; // Assuming you have a custom Button component
import { Alert } from '@/components/ui/alert'; // Assuming you have a custom Alert component
import { Mail, Lock } from 'lucide-react'; // Importing icons from Lucide React

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    // Authentication Effect
    useEffect(() => {
        const userDetailsStr = localStorage.getItem('userDetails');
        if (userDetailsStr) {
            router.push('/admin');
            return;
        }
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('userDetails', JSON.stringify(data.user));
            router.push('/admin');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafaff]">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-[#2f3b69]">
                <h2 className="text-3xl font-bold text-center text-[#2f3b69]">Admin Login</h2>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">
                            Email
                        </label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[#2f3b69] hover:bg-[#253057] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f3b69] disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Sign in'}
                    </Button>
                </form>
            </div>
        </div>
    );
}