
// import React, { useState } from 'react';
// import Header from './Header';
// import SimilarProductsCarousel from './SimilarProductsCarousel';
// import EnquiryModal from './EnquiryModal';

// interface Product {
//     id: number;
//     title: string;
//     price: number;
//     discountedPrice?: number;
//     description: string;
//     images: string[];
// }

// interface ProductDetailProps {
//     product: any;
// }

// const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
//     const [currentImage, setCurrentImage] = useState(product.images[0]);
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div className="w-full min-h-screen">
//             <Header />

//             <div className="mx-auto p-4 sm:p-6 bg-white w-full max-w-7xl">
//                 <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Image Section with Thumbnails */}
//                     <div className="flex flex-col-reverse sm:flex-row lg:flex-row gap-4 lg:w-2/3">
//                         {/* Thumbnails */}
//                         <div className="flex sm:flex-col overflow-x-auto lg:overflow-visible gap-2 sm:gap-4">
//                             {product.images.map((image: any, index: any) => (
//                                 <img
//                                     key={index}
//                                     src={image}
//                                     alt={`Thumbnail ${index + 1}`}
//                                     className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-lg cursor-pointer hover:opacity-75 transition"
//                                     onClick={() => setCurrentImage(image)}
//                                 />
//                             ))}
//                         </div>

//                         {/* Main Image */}
//                         <div className="flex-1 flex justify-center items-center">
//                             <img
//                                 src={currentImage}
//                                 alt={product.title}
//                                 className="w-full max-w-[500px] h-auto aspect-square object-contain rounded-lg shadow-lg"
//                             />
//                         </div>
//                     </div>

//                     {/* Product Details Section */}
//                     <div className="lg:w-1/3 flex flex-col">
//                         <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{product.title}</h1>

//                         <div className="mt-4">
//                             {product.discountedPrice ? (
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-lg sm:text-xl font-bold text-red-600">
//                                         ${product.discountedPrice.toFixed(2)}
//                                     </span>
//                                     <span className="text-sm sm:text-base line-through text-gray-500">
//                                         ${product.price.toFixed(2)}
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <span className="text-lg sm:text-xl font-bold text-gray-900">
//                                     ${product.price.toFixed(2)}
//                                 </span>
//                             )}
//                         </div>

//                         {/* Mobile: Enquire Now Button Above Description */}
//                         <button
//                             onClick={() => setIsOpen(true)}
//                             className="mt-4 sm:hidden w-full px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
//                         >
//                             Enquire Now
//                         </button>

//                         <p className="mt-4 text-sm sm:text-base text-gray-700">
//                             {product.description}
//                         </p>

//                         {/* Desktop: Enquire Now Button Below Description */}
//                         <button
//                             onClick={() => setIsOpen(true)}
//                             className="mt-6 hidden sm:block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
//                         >
//                             Enquire Now
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Similar Products Section */}
//             <div className="mt-8 w-full">
//                 <SimilarProductsCarousel category={product.category.name} />
//             </div>

//             {/* Enquiry Modal */}
//             <EnquiryModal
//                 productId={product.id}
//                 isOpen={isOpen}
//                 onClose={() => setIsOpen(false)}
//             />
//         </div>
//     );
// };

// export default ProductDetail;







"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    ChevronLeft,
    ChevronRight,
    Star,
    ShoppingCart,
    Info
} from 'lucide-react';
import Header from './Header';
import SimilarProductsCarousel from './SimilarProductsCarousel';
import EnquiryModal from './EnquiryModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    title: string;
    price: number;
    discountedPrice?: number;
    description: string;
    images: string[];
    category?: { name: string };
}

interface ProductDetailProps {
    product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    return (
        <div className="w-full min-h-screen bg-[#fafaff]">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <Card className="border-2 border-[#2f3b69]/10 shadow-xl">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Image Gallery Section */}
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={product.images[currentImageIndex]}
                                        alt={product.title}
                                        className="w-full aspect-square object-contain bg-white"
                                    />

                                    {/* Image Navigation Buttons */}
                                    {product.images.length > 1 && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white"
                                                onClick={handlePrevImage}
                                            >
                                                <ChevronLeft className="text-[#2f3b69]" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white"
                                                onClick={handleNextImage}
                                            >
                                                <ChevronRight className="text-[#2f3b69]" />
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Image Thumbnails */}
                                <div className="flex justify-center mt-4 space-x-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`
                                                w-16 h-16 rounded-lg overflow-hidden 
                                                border-2 transition-all
                                                ${index === currentImageIndex
                                                    ? 'border-[#2f3b69]'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                }
                                            `}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h1 className="text-2xl font-bold text-[#2f3b69]">
                                        {product.title}
                                    </h1>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Star
                                                    fill="#2f3b69"
                                                    color="#2f3b69"
                                                    className="w-6 h-6"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Add to Favorites
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {/* Price Section */}
                                <div className="flex items-center space-x-4">
                                    {product.discountedPrice ? (
                                        <>
                                            <span className="text-2xl font-bold text-[#2f3b69]">
                                                ${product.discountedPrice.toFixed(2)}
                                            </span>
                                            <Badge variant="destructive">
                                                {Math.round(
                                                    ((product.price - product.discountedPrice) / product.price) * 100
                                                )}% OFF
                                            </Badge>
                                            <span className="text-gray-500 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold text-[#2f3b69]">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Description with Markdown Support */}
                                <div className="prose max-w-none text-gray-700">
                                    <ReactMarkdown>{product.description}</ReactMarkdown>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-4">
                                    <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full text-white bg-[#2f3b69] hover:bg-[#2f3b69]/90"
                                            >
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Enquire Now
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Product Enquiry</DialogTitle>
                                            </DialogHeader>
                                            <EnquiryModal
                                                productId={product.id}
                                                isOpen={isEnquiryOpen}
                                                onClose={() => setIsEnquiryOpen(false)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Similar Products Section */}
            <div className="container mx-auto px-4 py-8">
                <SimilarProductsCarousel category={product?.category?.name} />
            </div>
        </div>
    );
};

export default ProductDetail;