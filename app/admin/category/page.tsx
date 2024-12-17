


// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, Loader2 } from 'lucide-react';

// const CategoriesPage: React.FC = () => {
//     const [categories, setCategories] = useState<any[]>([]);
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch('/api/category');
//             if (response.ok) {
//                 const data = await response.json();
//                 setCategories(data);
//             } else {
//                 console.error('Failed to fetch categories');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const addCategory = async () => {
//         setIsSubmitting(true);
//         try {
//             const response = await fetch('/api/category', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ name, description }),
//             });

//             if (response.ok) {
//                 await fetchCategories();
//                 setName('');
//                 setDescription('');
//             } else {
//                 console.error('Failed to add category');
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const deleteCategory = async (id: string) => {
//         try {
//             const response = await fetch('/api/category', {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ id }),
//             });

//             if (response.ok) {
//                 await fetchCategories();
//             } else {
//                 console.error('Failed to delete category');
//             }
//         } catch (error) {
//             console.error('Error deleting category:', error);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <div className="container mx-auto">
//                 <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//                     <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h1>

//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             addCategory();
//                         }}
//                         className="space-y-4 mb-8"
//                     >
//                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Category Name
//                                 </label>
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     placeholder="Enter category name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Description
//                                 </label>
//                                 <input
//                                     id="description"
//                                     type="text"
//                                     placeholder="Enter description"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-end">
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                                         Adding...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="-ml-1 mr-2 h-4 w-4" />
//                                         Add Category
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <div>
//                         <h2 className=" text-xl font-semibold text-gray-900 mb-4">Existing Categories</h2>
//                         {isLoading ? (
//                             <div className="flex justify-center py-8">
//                                 <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//                             </div>
//                         ) : categories.length === 0 ? (
//                             <p className="text-center py-8 text-gray-500">No categories found. Add your first category above.</p>
//                         ) : (
//                             <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
//                                 {categories.map((category) => (
//                                     <div
//                                         key={category._id}
//                                         className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
//                                     >
//                                         <div>
//                                             <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
//                                             {category.description && (
//                                                 <p className="text-sm text-gray-500">{category.description}</p>
//                                             )}
//                                         </div>
//                                         <button
//                                             onClick={() => deleteCategory(category._id)}
//                                             className="inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                                         >
//                                             <Trash2 className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CategoriesPage;




'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/category');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                await fetchCategories();
                setName('');
                setDescription('');
            } else {
                console.error('Failed to add category');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch('/api/category', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                await fetchCategories();
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaff] p-8">
            <div className="container mx-auto">
                <Card className="shadow-md rounded-lg p-6 mb-8 bg-white">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-[#2f3b69] mb-6">Manage Categories</h1>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addCategory();
                            }}
                            className="space-y-4 mb-8"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter category name"
                                        value={name}
                                        onChange={(e:any) => setName(e.target.value)}
                                        required
                                        className="border border-gray-300 rounded-md focus:ring-[#2f3b69] focus:border-[#2f3b69]"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e:any) => setDescription(e.target.value)}
                                        className="border border-gray-300 rounded-md focus:ring-[#2f3b69] focus:border-[#2f3b69]"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2f3b69] hover:bg-[#2c3a68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f3b69] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="-ml-1 mr-2 h-4 w-4" />
                                            Add Category
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div>
                            <h2 className="text-xl font-semibold text-[#2f3b69] mb-4">Existing Categories</h2>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#2f3b69]" />
                                </div>
                            ) : categories.length === 0 ? (
                                <p className="text-center py-8 text-gray-500">No categories found. Add your first category above.</p>
                            ) : (
                                <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <div
                                            key={category._id}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                                        >
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                                                {category.description && (
                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() => deleteCategory(category._id)}
                                                className="inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CategoriesPage;