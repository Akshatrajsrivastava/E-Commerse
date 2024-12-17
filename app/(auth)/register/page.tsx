// app/register/page.tsx
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Mail, Lock, User, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        // Basic password validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Optionally store user details or redirect to login
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafaff]">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-[#2f3b69]">
                <h2 className="text-3xl font-bold text-center text-[#2f3b69]">Create an Account</h2>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">
                            Full Name
                        </label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>
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
                                placeholder="Create a password"
                                minLength={6}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">
                            Confirm Password
                        </label>
                        <div className="relative mt-1">
                            <KeyRound className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10"
                                placeholder="Confirm your password"
                                minLength={6}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[#2f3b69] hover:bg-[#253057] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f3b69] disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-[#2f3b69] hover:underline font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}