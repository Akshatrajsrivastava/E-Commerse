

// "use client";
// import { useRouter } from 'next/navigation';
// import React from 'react';
// import Image from 'next/image';

// interface ProductCardProps {
//     productId: string;
//     image: string;
//     title: string;
//     price: any; // Ensure this is always a number
//     className?: string;
//     previousPrice?: any;
//     maxTitleLength?: number;
// }

// const MiniCard: React.FC<ProductCardProps> = ({
//     image,
//     title,
//     price,
//     previousPrice,
//     className,
//     productId,
//     maxTitleLength = 30,
// }) => {
//     const router = useRouter();

//     const truncateTitle = (title: string, maxLength: number) => {
//         if (title.length > maxLength) {
//             return `${title.substring(0, maxLength)}...`;
//         }
//         return title;
//     };

//     // Function to safely format price
//     const formatPrice = (value: number | undefined) => {
//         return typeof value === 'number' ? value.toFixed(2) : '0.00';
//     };

//     return (
//         <div
//             className={`
//                 w-[180px] h-[260px]  
//                 relative border rounded-lg shadow-lg 
//                 overflow-hidden group cursor-pointer 
//                 flex flex-col
//                 ${className}`}
//             onClick={() => router.push(`/Product/${productId}`)}
//         >
//             {/* Image Container with Fixed Height */}
//             <div className="relative w-full h-[180px] flex-shrink-0">
//                 <Image
//                     src={image}
//                     alt={title}
//                     fill
//                     sizes="180px"
//                     className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
//                     priority={false}
//                 />
//             </div>

//             {/* Product Details with Fixed Height */}
//             <div className="p-2 h-[80px] flex flex-col justify-between bg-white">
//                 <h2 className="text-sm font-semibold line-clamp-2">
//                     {truncateTitle(title, maxTitleLength)}
//                 </h2>
//                 <div className="flex items-baseline">
//                     <span className="text-base font-bold text-gray-900">
//                         ₹{formatPrice(price)}
//                     </span>
//                     {previousPrice && (
//                         <span className="ml-1 text-xs text-gray-500 line-through">
//                             ₹{formatPrice(previousPrice)}
//                         </span>
//                     )}
//                 </div>
//             </div>

//             {/* Hover Overlay */}
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <button className="bg-white text-gray-800 font-semibold py-1 px-4 rounded text-sm hover:bg-gray-100 transition-colors">
//                     View Details
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MiniCard;





"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component in your shadcn UI library
import { Info } from 'lucide-react'; // Importing an icon from Lucide

interface ProductCardProps {
    productId: string;
    image: string;
    title: string;
    price: any; // Ensure this is always a number
    className?: string;
    previousPrice?: any;
    maxTitleLength?: number;
}

const MiniCard: React.FC<ProductCardProps> = ({
    image,
    title,
    price,
    previousPrice,
    className,
    productId,
    maxTitleLength = 30,
}) => {
    const router = useRouter();

    const truncateTitle = (title: string, maxLength: number) => {
        if (title.length > maxLength) {
            return `${title.substring(0, maxLength)}...`;
        }
        return title;
    };

    const formatPrice = (value: number | undefined) => {
        return typeof value === 'number' ? value.toFixed(2) : '0.00';
    };

    return (
        <div
            className={`
                w-[180px] h-[260px]  
                relative border rounded-lg shadow-lg 
                overflow-hidden group cursor-pointer 
                flex flex-col bg-[#fafaff] transition-transform duration-300 ease-in-out 
                hover:shadow-xl hover:bg-[#e6e6e6] ${className}`}
            onClick={() => router.push(`/Product/${productId}`)}
        >
            {/* Image Container with Fixed Height */}
            <div className="relative w-full h-[180px] flex-shrink-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    priority={false}
                />
            </div>

            {/* Product Details with Fixed Height */}
            <div className="p-2 h-[80px] flex flex-col justify-between">
                <h2 className="text-sm font-semibold text-[#2f3b69] line-clamp-2">
                    {truncateTitle(title, maxTitleLength)}
                </h2>
                <div className="flex items-baseline">
                    <span className="text-base font-bold text-[#2f3b69]">
                        ₹{formatPrice(price)}
                    </span>
                    {previousPrice && (
                        <span className="ml-1 text-xs text-gray-500 line-through">
                            ₹{formatPrice(previousPrice)}
                        </span>
                    )}
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#2f3b69] bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="outline" className="text-white flex items-center">
                    <Info className="mr-1" />
                    View Details
                </Button>
            </div>
        </div>
    );
};

export default MiniCard;