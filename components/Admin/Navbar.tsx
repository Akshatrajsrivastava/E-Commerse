// // src/components/Navbar.tsx
// import React from 'react';
// import Link from 'next/link';

// const Navbar: React.FC = () => {
//     return (
//         <nav className="bg-gray-800 text-white p-4">
//             <div className="container mx-auto flex justify-between">
//                 <div className="text-xl font-bold">Admin Panel</div>
//                 <div>
//                     <Link href="/admin" className="px-4 hover:bg-gray-700">Dashboard</Link>
//                     <Link href="/admin/category" className="px-4 hover:bg-gray-700">Categories</Link>
//                     <Link href="/admin/product" className="px-4 hover:bg-gray-700">Products</Link>
//                     <Link href="/admin/orders" className="px-4 hover:bg-gray-700">Orders</Link>
//                     {/* Add more links as needed */}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;






// src/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import logo from '@/public/Logop.png'
import logo1 from '@/public/Logop.png'

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#2f3b69] text-[#fafaff] shadow-lg">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo Section */}
                <Link href="/admin" className="flex items-center space-x-3">
                    <Image
                        src={logo1}  // Replace with your actual logo path
                        alt="Admin Panel Logo"
                        width={120}  // Adjust width as needed
                        height={50}  // Adjust height as needed
                        className="rounded-lg"
                    />
                    {/* <span className="text-xl font-bold tracking-wide text-[#fafaff]">
                        Admin Dashboard
                    </span> */}
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link href="/admin" className="group relative">
                        <span className="px-3 py-2 rounded-md 
                            text-[#fafaff] 
                            group-hover:bg-[#fafaff] 
                            group-hover:text-[#2f3b69] 
                            transition-colors duration-300">
                            Dashboard
                        </span>
                    </Link>
                    <Link href="/admin/category" className="group relative">
                        <span className="px-3 py-2 rounded-md 
                            text-[#fafaff] 
                            group-hover:bg-[#fafaff] 
                            group-hover:text-[#2f3b69] 
                            transition-colors duration-300">
                            Categories
                        </span>
                    </Link>
                    <Link href="/admin/product" className="group relative">
                        <span className="px-3 py-2 rounded-md 
                            text-[#fafaff] 
                            group-hover:bg-[#fafaff] 
                            group-hover:text-[#2f3b69] 
                            transition-colors duration-300">
                            Products
                        </span>
                    </Link>
                    <Link href="/admin/orders" className="group relative">
                        <span className="px-3 py-2 rounded-md 
                            text-[#fafaff] 
                            group-hover:bg-[#fafaff] 
                            group-hover:text-[#2f3b69] 
                            transition-colors duration-300">
                            Orders
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;