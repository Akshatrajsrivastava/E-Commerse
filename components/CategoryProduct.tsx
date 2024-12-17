


// import React, { useEffect, useState } from 'react';
// import MiniCard from './miniCard';
// import { ChevronRight } from 'lucide-react';
// import LoadingScreen from './ui/LoadingScreen';

// type Product = {
//     _id: string;
//     images: string[];
//     title: string;
//     price: number;
//     discountedPrice?: number;
// };

// const CategoryProductSkeleton = () => {
//     return (
//         <div className="container mx-auto w-full px-4">
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                 {[...Array(12)].map((_, index) => (
//                     <div key={index} className="space-y-2">
//                         <div className="bg-gray-200 h-40 w-full aspect-square rounded-lg animate-pulse"></div>
//                         <div className="space-y-2">
//                             <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
//                             <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const CategoryProduct = ({ category }: { category: string }) => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (category) {
//             const fetchProducts = async () => {
//                 setIsLoading(true);
//                 setError(null);
//                 try {
//                     const response = await fetch(`/api/product/get-products-by-category/${category}`);
//                     if (!response.ok) {
//                         throw new Error('Failed to fetch products');
//                     }
//                     const data = await response.json();
//                     setProducts(data);
//                 } catch (error) {
//                     setError('Failed to load products. Please try again later.');
//                     console.error('Error fetching products:', error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchProducts();
//         }
//     }, [category]);

//     if (error) {
//         return (
//             <div className="min-h-[80vh] flex items-center justify-center px-4">
//                 <div className="text-center p-6 bg-red-50 rounded-lg max-w-md w-full">
//                     <p className="text-red-600">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-[80vh] px-4 md:px-6 lg:px-8 py-8 bg-gray-50 w-full mx-auto">
//             {/* Category Header */}
//             <div className="mb-8 max-w-screen-xl mx-auto">
//                 <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
//                     <span>Home</span>
//                     <ChevronRight className="w-4 h-4" />
//                     <span className="text-gray-900">{category}</span>
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                     {category} Collection
//                 </h1>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                     Discover our carefully curated selection of {category.toLowerCase()} products
//                 </p>
//             </div>

//             {/* Products Grid */}
//             {isLoading ? (
//                 <LoadingScreen />
//             ) : (
//                 <div className="max-w-screen-xl mx-auto">
//                     {products.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-12">
//                             <div className="text-center">
//                                 <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
//                                 <p className="mt-1 text-sm text-gray-500">
//                                     We couldn't find any {category.toLowerCase()} products at the moment.
//                                 </p>
//                             </div>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 animate-fade-in">
//                                 {products.map((product) => (
//                                     <div
//                                         key={product._id}
//                                         className="transform hover:-translate-y-1 transition-transform duration-300"
//                                     >
//                                         <MiniCard
//                                             productId={product._id}
//                                             image={product.images[0]}
//                                             title={product.title}
//                                             price={product.price}
//                                             previousPrice={product.discountedPrice}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Results Summary */}
//                             {/* <div className="mt-6 text-sm text-gray-500 text-center">
//                                 Showing {products.length} {products.length === 1 ? 'product' : 'products'} in {category}
//                             </div> */}
//                         </>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CategoryProduct;






import React, { useEffect, useState } from 'react';
import MiniCard from './miniCard';
import { ChevronRight } from 'lucide-react';
import LoadingScreen from './ui/LoadingScreen';
// import { Button, Card, Typography } from 'shadcn-ui'; // Assuming shadcn-ui provides these components
import { Button } from './ui/button';
import { Card } from './ui/card';

const colors = {
    secondary: '#2f3b69',
    background: '#fafaff',
    primary: '#2f3b69',
};

type Product = {
    _id: string;
    images: string[];
    title: string;
    price: number;
    discountedPrice?: number;
};

const CategoryProductSkeleton = () => {
    return (
        <div className="container mx-auto w-full px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, index) => (
                    <Card key={index} className="bg-gray-200 animate-pulse rounded-lg">
                        <div className="h-40 w-full aspect-square rounded-lg"></div>
                        <div className="space-y-2 p-2">
                            <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const CategoryProduct = ({ category }: { category: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <Card className="p-6 bg-red-50 rounded-lg max-w-md w-full">
                    <h1 className="text-red-600">{error}</h1>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] w-full px-4 md:px-6 lg:px-8 py-8" style={{ backgroundColor: colors.background }}>
            {/* Category Header */}
            <div className="mb-8 max-w-screen-xl mx-auto">
                <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900">{category}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {category} Collection
                </h1>
                <h1 className="text-gray-600 text-sm sm:text-base">
                    Discover our carefully curated selection of {category.toLowerCase()} products
                </h1>
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="max-w-screen-xl mx-auto">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <h1 className="mt-2 text-sm font-semibold text-gray-900">No products found</h1>
                            <h1 className="mt-1 text-sm text-gray-500">
                                We couldn't find any {category.toLowerCase()} products at the moment.
                            </h1>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 animate-fade-in">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="transform hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <MiniCard
                                            productId={product._id}
                                            image={product.images[0]}
                                            title={product.title}
                                            price={product.price}
                                            previousPrice={product.discountedPrice}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Results Summary */}
                            {/* <div className="mt-6 text-sm text-gray-500 text-center">
                                Showing {products.length} {products.length === 1 ? 'product' : 'products'} in {category}
                            </div> */}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryProduct;