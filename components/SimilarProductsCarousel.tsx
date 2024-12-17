

"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import MiniCard from './miniCard';


type Product = {
    _id: string;
    images: string[];
    title: string;
    price: string;
    discountedPrice?: number;
};

// Skeleton Component (remains the same)
const SimilarProductsSkeleton = () => {
    return (
        <div className="p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-300 w-40 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SimilarProductsList = ({ category }: any) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [randomProducts, setRandomProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
        };

        // Check initial screen size
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Function to get 6 random products (remains the same)
    const getRandomProducts = (allProducts: Product[]) => {
        if (allProducts.length <= 6) return allProducts;

        const shuffled = [...allProducts];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 6);
    };

    // Fetch products (remains the same)
    useEffect(() => {
        if (category) {
            const fetchProducts = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/product/get-products-by-category/${category}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    const data = await response.json();

                    setProducts(data);
                    setRandomProducts(getRandomProducts(data));
                } catch (error) {
                    setError('Failed to load products. Please try again later.');
                    console.error('Error fetching products:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProducts();
        }
    }, [category]);

    // Error handling (remains the same)
    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // If loading, show skeleton
    if (isLoading) {
        return <SimilarProductsSkeleton />;
    }

    // If no products, don't render anything
    if (randomProducts.length === 0) return null;

    return (
        <div className="  ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Similar Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-2 md:gap-6">
                {randomProducts.map((product, index) => (
                    isMobile ? (
                        <MiniCard
                            key={product._id || index}
                            productId={product._id}
                            image={product.images[0]}
                            title={product.title}
                            previousPrice={product.price}
                            price={product.discountedPrice}
                        />
                    ) : (
                        <ProductCard
                            key={product._id || index}
                            productId={product._id}
                            image={product.images[0]}
                            title={product.title}
                            previousPrice={`₹ ${product.price}`}
                            price={`₹ ${product.discountedPrice}`}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default SimilarProductsList;