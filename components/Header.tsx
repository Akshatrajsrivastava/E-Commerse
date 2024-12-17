"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import logo from '@/public/Logop.png';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component in shadcn


interface Product {
    _id: string;
    title: string;
    images?: string[];
    price: number;
    discountedPrice?: number;
}

const Header: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 1) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`/api/product/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();
            setSuggestions(Array.isArray(data.products) ? data.products : []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (productId: string) => {
        if (productId) {
            router.push(`/Product/${productId}`);
            setShowSuggestions(false);
            setQuery('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (suggestions && suggestions.length > 0 && suggestions[0]?._id) {
                router.push(`/product/${suggestions[0]._id}`);
                setShowSuggestions(false);
                setQuery('');
            } else {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <header className="flex items-center justify-between bg-[#2f3b69] px-5 py-3 shadow-md relative">
            <div className="flex items-center rounded-lg">
                <Image
                    src={logo}
                    alt="Pixorus logo"
                    width={120}
                    height={100}
                    className="mr-2 rounded-lg"
                />
            </div>

            <div
                className="hidden md:flex items-center justify-center w-full max-w-xl relative"
                ref={searchRef}
            >
                <div className="relative w-full bg-white rounded-lg">
                    <Input
                        type="text"
                        placeholder="Search product"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        className="w-full  pl-10 pr-4 border border-[#2f3b69] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2f3b69]"
                    />
                    <span className="absolute left-3 top-2 text-[#2f3b69] flex items-center ">
                        <Search size={20} />
                    </span>

                    {showSuggestions && suggestions && suggestions.length > 0 && (
                                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto">
                                            {suggestions.map((product) => (
                                                product?._id && (
                                                    <div
                                                        key={product._id}
                                                        onClick={() => handleSelectSuggestion(product._id)}
                                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {product.images && product.images.length > 0 && (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.title || 'Product'}
                                                                width={50}
                                                                height={50}
                                                                className="w-12 h-12 object-cover mr-4"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-semibold">{product.title || 'Unnamed Product'}</p>
                                                            <p className="text-sm text-gray-500">
                                                                ${(product.discountedPrice || product.price || 0).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                </ div>
            </div>
        </header>
    );
};

export default Header;






// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { Search } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import logo from '@/app/logot.png';

// interface Product {
//     _id: string;
//     title: string;
//     images?: string[];
//     price: number;
//     discountedPrice?: number;
// }

// const Header: React.FC = () => {
//     const [query, setQuery] = useState('');
//     const [suggestions, setSuggestions] = useState<Product[]>([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const searchRef = useRef<HTMLDivElement>(null);
//     const router = useRouter();

//     // Debounce search to reduce unnecessary API calls
//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             if (query.trim().length > 1) {
//                 fetchSuggestions();
//             } else {
//                 setSuggestions([]);
//             }
//         }, 300);

//         return () => clearTimeout(delayDebounceFn);
//     }, [query]);

//     // Close suggestions when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//                 setShowSuggestions(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const fetchSuggestions = async () => {
//         try {
//             const response = await fetch(`/api/product/search?q=${encodeURIComponent(query)}`);

//             if (!response.ok) {
//                 throw new Error('Failed to fetch suggestions');
//             }

//             const data = await response.json();

//             // Safely set suggestions, ensuring it's always an array
//             setSuggestions(Array.isArray(data.products) ? data.products : []);
//         } catch (error) {
//             console.error('Error fetching suggestions:', error);
//             setSuggestions([]);
//         }
//     };

//     const handleSelectSuggestion = (productId: string) => {
//         if (productId) {
//             router.push(`/Product/${productId}`);
//             setShowSuggestions(false);
//             setQuery('');
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             // If suggestions exist, go to first suggestion
//             if (suggestions && suggestions.length > 0 && suggestions[0]?._id) {
//                 router.push(`/product/${suggestions[0]._id}`);
//                 setShowSuggestions(false);
//                 setQuery('');
//             } else {
//                 // Optionally, redirect to search results page
//                 router.push(`/search?q=${encodeURIComponent(query)}`);
//             }
//         }
//     };

//     return (
//         <header className="flex items-center justify-between bg-white px-5 py-3 shadow-md relative">
//             <div className="flex items-center">
//                 <Image
//                     src={logo}
//                     alt="Pixorus logo"
//                     width={120}
//                     height={100}
//                     className="mr-2"
//                 />
//             </div>

//             {/* Desktop Search Bar */}
//             <div
//                 className="hidden md:flex items-center justify-center w-full max-w-xl relative"
//                 ref={searchRef}
//             >
//                 <div className="relative w-full">
//                     <input
//                         type="text"
//                         placeholder="Search product"
//                         value={query}
//                         onChange={(e) => {
//                             setQuery(e.target.value);
//                             setShowSuggestions(true);
//                         }}
//                         onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
//                     />
//                     <span className="absolute left-3 top-3 text-gray-500">
//                         <Search size={20} />
//                     </span>

//                     {/* Suggestions Dropdown */}
//                     {showSuggestions && suggestions && suggestions.length > 0 && (
//                         <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto">
//                             {suggestions.map((product) => (
//                                 product?._id && (
//                                     <div
//                                         key={product._id}
//                                         onClick={() => handleSelectSuggestion(product._id)}
//                                         className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
//                                     >
//                                         {product.images && product.images.length > 0 && (
//                                             <Image
//                                                 src={product.images[0]}
//                                                 alt={product.title || 'Product'}
//                                                 width={50}
//                                                 height={50}
//                                                 className="w-12 h-12 object-cover mr-4"
//                                             />
//                                         )}
//                                         <div>
//                                             <p className="font-semibold">{product.title || 'Unnamed Product'}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 ${(product.discountedPrice || product.price || 0).toFixed(2)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;









