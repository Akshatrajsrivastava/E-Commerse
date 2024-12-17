"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '@/components/ProductDetails';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface Product {
    id: string; // Ensure this is a string to match the MongoDB _id
    title: string;
    price: number;
    discountedPrice?: number;
    description: string;
    images: string[];
}

interface SimilarProduct {
    id: string; // Ensure this is a string to match the MongoDB _id
    title: string;
    price: number;
    discountedPrice?: number;
    image: string;
}

const ProductData: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const param = useParams();
    const { ProductId } = param; // Get productId from the URL params
    console.log(ProductId)

    useEffect(() => {
        if (!ProductId) return; // Don't run if the productId is not available yet

        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/product/${ProductId}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                console.log(data);
                setProduct(data);


                const response1 = await fetch(`/api/product/category/${ProductId}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data1 = await response1.json();
                console.log(data1);
                setSimilarProducts(data1);
                setLoading(false);
                // You can implement a similar API to fetch similar products
                // setSimilarProducts([]); // Placeholder, update with actual similar products fetching logic
            } catch (error) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProductData();
    }, [ProductId]);

    if (loading) {
        return <LoadingScreen/>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className='flex items-center justify-between'>
            <ProductDetail product={product}  />
            {/* <ProductDetail product={product}  /> */}
            {/* Uncomment if you want to show recent products and suggestions */}
            {/* <RecentAndSuggestions /> */}
        </div>
    );
};

export default ProductData;
