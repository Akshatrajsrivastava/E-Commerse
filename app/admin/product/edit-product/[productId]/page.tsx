// 'use client';

// import ProductForm from '@/components/Admin/ProductForm';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation';  // Import useParams hook

// interface Product {
//     title: string;
//     price: number;
//     discountedPrice?: number;
//     description: string;
//     category: string;
//     images: string[];
// }

// export default function EditProductPage() {
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [initialData, setInitialData] = useState<Product | null>(null);
//     const router = useRouter();

//     const { productId } = useParams();  // Use the useParams hook to access the params

//     useEffect(() => {
//         const fetchProductData = async () => {
//             try {
//                 const response = await fetch(`/api/product/${productId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch product data');
//                 }
//                 const data = await response.json();
//                 setInitialData(data);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'An unexpected error occurred');
//                 console.error('Fetch error:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (productId) {
//             fetchProductData();
//         }
//     }, [productId]);

//     const handleSubmit = async (formData: FormData) => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             const response = await fetch(`/api/product/${productId}`, {
//                 method: 'PUT',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to update product');
//             }

//             router.push('/admin/product');
//             router.refresh();
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An unexpected error occurred');
//             console.error('Submission error:', err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="max-w-2xl mx-auto">
//                 <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                         <span className="block sm:inline">{error}</span>
//                     </div>
//                 )}

//                 {initialData && (
//                     <ProductForm
//                         initialData={initialData}
//                         onSubmit={handleSubmit}
//                         isLoading={isLoading}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }




'use client';

import ProductForm from '@/components/Admin/ProductForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
// import { Alert, Button, Loader, Card } from 'shadcn/ui'; // Importing ShadCN components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit } from 'lucide-react'; // Importing Lucide icon
import LoadingScreen from '@/components/ui/LoadingScreen';

interface Product {
    title: string;
    price: number;
    discountedPrice?: number;
    description: string;
    category: string;
    images: string[];
}

export default function EditProductPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Product | null>(null);
    const router = useRouter();

    const { productId } = useParams();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`/api/product/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const data = await response.json();
                setInitialData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/product/${productId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update product');
            }

            router.push('/admin/product');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            // <div className="flex items-center justify-center h-screen">
            //     <Loader />
            // </div>
            <LoadingScreen/>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <Edit className="mr-2 text-primary" />
                        <h1 className="text-3xl font-bold text-secondary">Edit Product</h1>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {initialData && (
                        <ProductForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    )}

                    <Button
                        onClick={() => router.push('/admin/product')}
                        className="mt-4 bg-secondary text-white hover:bg-primary"
                    >
                        Cancel
                    </Button>
                </Card>
            </div>
        </div>
    );
}