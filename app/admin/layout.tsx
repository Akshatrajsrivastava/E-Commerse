// src/app/admin/layout.tsx
import React from 'react';
import Navbar from '@/components/Admin/Navbar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;