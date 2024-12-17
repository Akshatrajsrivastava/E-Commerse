
'use client';

import React, { useEffect, useState } from 'react';
import {
    Package,
    MessageCircle,
    Users,
    ShoppingCart,
    Mail,
    Plus,
    Minus,
    Eye,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Ensure you have the correct path for Button
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"; // Ensure you have the correct path for Tooltip
import { CheckCircle2, XCircle} from "lucide-react"; // Import icons
import LoadingScreen from '@/components/ui/LoadingScreen';


// Interfaces
interface IProduct {
    _id: string;
    title: string;
    price: number;
    discountedPrice: number;
    description: string;
    images: string[];
    category: string;
    createdAt: Date;
}

interface IEnquiry {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
    date: Date;
    status: 'accepted' | 'rejected' | 'none';
    productId: IProduct;
    accepted: boolean;
    createdAt: Date;
}

// CreateOrderModal Component
const CreateOrderModal: React.FC<{
    enquiry: IEnquiry;
    onClose: () => void;
    onSubmit: (orderData: FormData) => void;
}> = ({ enquiry, onClose, onSubmit }) => {
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(enquiry.productId.discountedPrice || enquiry.productId.price);
    const basePrice = enquiry.productId.discountedPrice || enquiry.productId.price;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
            setTotalAmount(Number((newQuantity * basePrice).toFixed(2)));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('enquiryId', enquiry._id);
        formData.append('items', JSON.stringify([{
            productId: enquiry.productId._id,
            quantity: quantity,
            price: basePrice
        }]));
        formData.append('totalAmount', totalAmount.toString());
        formData.append('status', 'pending');

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="bg-[#fafaff] rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-[#2f3b69] mb-4">Create Order</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">Product</label>
                        <p className="text-gray-700">{enquiry.productId.title}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">Base Price</label>
                        <p className="text-gray-700">${basePrice}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">Quantity</label>
                        <div className="flex items-center space-x-3">
                            <Button
                                type="button"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="p-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b69] hover:text-white transition duration-200"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center text-[#2f3b69]">{quantity}</span>
                            <Button
                                type="button"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                className="p-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b69] hover:text-white transition duration-200"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2f3b69]">Total Amount</label>
                        <input
                            type="number"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-[#2f3b69] shadow-sm focus:border-[#2f3b69] focus:ring-[#2f3b69] bg-white"
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b69] hover:text-white transition duration-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-[#2f3b69] text-white rounded-md hover:bg-[#1e2a4d] transition duration-200"
                        >
                            Create Order
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ProductModal: React.FC<{
    product: IProduct | null;
    onClose: () => void;
}> = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % product.images.length
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <Card className="bg-[#fafaff] rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
                {/* Image Section */}
                <div className="relative bg-gray-100 flex items-center justify-center p-6">
                    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-in-out"
                        />

                        {/* Image Navigation Buttons */}
                        {product.images.length > 1 && (
                            <>
                                <Button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-[#2f3b69] hover:text-white p-2 rounded-full shadow-md transition duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={handleNextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-[#2f3b69] hover:text-white p-2 rounded-full shadow-md transition duration-200"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-[#2f3b69] mb-4">{product.title}</h2>

                        {/* Description Section (Uncomment if needed) */}
                        {/* <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">Description</p>
                            <p className="text-gray-700">{product.description || 'No description available'}</p>
                        </div> */}

                        {/* Category Section (Uncomment if needed) */}
                        {/* <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">Category</p>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {product.category}
                            </span>
                        </div> */}

                        <div className="flex items-center mb-6">
                            <p className="text-2xl font-bold text-[#2f3b69] mr-4">
                                ${product.discountedPrice || product.price}
                            </p>
                            {product.discountedPrice && product.price !== product.discountedPrice && (
                                <p className="text-gray-500 line-through">
                                    ${product.price}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Added on: {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                        <Button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#2f3b69] text-white rounded-full hover:bg-[#1e2a4d] transition-colors"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </ div>
    );
};

// Main Admin Dashboard Component
export default function AdminDashboard() {
    const [user, setUser] = useState<any | null>(null);
    const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
    const [productCount, setProductCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');
    const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
    const router = useRouter();

    // Authentication Effect
    useEffect(() => {
        const userDetailsStr = localStorage.getItem('userDetails');
        if (!userDetailsStr) {
            router.push('/login');
            return;
        }

        try {
            const userDetails = JSON.parse(userDetailsStr);
            setUser(userDetails);
        } catch {
            localStorage.removeItem('userDetails');
            router.push('/login');
        }
    }, [router]);

    // Fetch Enquiries Effect
    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                const pendingOrders = data.orders
                    ? data.orders.filter((order: any) => order.status === 'pending')
                    : data.filter((order: any) => order.status === 'pending');

                setPendingOrdersCount(pendingOrders.length);
            } catch (error) {
                console.error('Error fetching pending orders:', error);
                setPendingOrdersCount(0);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product');
                const data = await response.json();
                setProductCount(data?.products?.length || 0);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProductCount(0);
            }
        };

        const fetchEnquiries = async () => {
            try {
                const response = await fetch('/api/Enquiry');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setEnquiries(data);
                }
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingOrders();
        fetchProducts();
        fetchEnquiries();
    }, []);

    // Filter Enquiries
    const filteredEnquiries = enquiries.filter(enquiry => {
        if (activeTab === 'pending') {
            return enquiry.status === 'none';
        } else {
            return enquiry.status === 'rejected';
        }
    });

    // Handlers
    const handleAddToOrders = async (enquiryId: string) => {
        try {
            const response = await fetch(`/api/orders/${enquiryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setEnquiries(prevEnquiries =>
                    prevEnquiries.map(enquiry =>
                        enquiry._id === enquiryId
                            ? { ...enquiry, accepted: true, status: 'accepted' }
                            : enquiry
                    )
                );
            }
        } catch (error) {
            console.error('Error accepting enquiry:', error);
        }
    };

    const handleCreateOrder = async (formData: FormData) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await handleAddToOrders(formData.get('enquiryId') as string);
                setShowOrderModal(false);
                alert('Order created successfully');
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order');
        }
    };

    const changeStatusToRejected = async (enquiryId: string) => {
        try {
            const response = await fetch(`/api/Enquiry/${enquiryId}`, {
                method: 'PATCH',
            });

            if (response.ok) {
                setEnquiries(prevEnquiries =>
                    prevEnquiries.filter(enquiry => enquiry._id !== enquiryId)
                );
            }
        } catch (error) {
            console.error('Error deleting enquiry:', error);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pendingEnquiriesCount = enquiries.filter(e => e.status === 'none').length;
    const rejectedEnquiriesCount = enquiries.filter(e => e.status === 'rejected').length;
    const totalEnquiriesCount = enquiries.length;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#fafaff] text-[#2f3b69]">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-[#2f3b69]">Admin Dashboard</h1>
                        <p className="text-sm text-[#2f3b69]/70">Welcome back, {user?.name || 'Admin'}</p>
                    </div>
                    <div className='flex flex-row gap-3'>
                    <button
                        onClick={() => {
                            router.push('admin/banner');
                        }}
                        className="px-6 py-2 bg-white  text-[#2f3b69] border border-[#2f3b69] hover:text-white rounded-full hover:bg-[#2f3b69]/90 transition shadow-md"
                    >
                        Banners
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userDetails');
                            router.push('/login');
                        }}
                        className="px-6 py-2 bg-[#2f3b69] text-white rounded-full hover:bg-[#2f3b69]/90  transition shadow-md"
                    >
                        Logout
                    </button>
                    </div>
                   
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        {
                            title: 'Pending Enquiries',
                            count: pendingEnquiriesCount,
                            icon: <Mail className="w-10 h-10 text-[#2f3b69]/50" />,
                            bgColor: 'bg-blue-50'
                        },
                        {
                            title: 'Products Listed',
                            count: productCount,
                            icon: <Package className="w-10 h-10 text-[#2f3b69]/50" />,
                            bgColor: 'bg-green-50'
                        },
                        {
                            title: 'Pending Orders',
                            count: pendingOrdersCount,
                            icon: <ShoppingCart className="w-10 h-10 text-[#2f3b69]/50" />,
                            bgColor: 'bg-purple-50'
                        }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} border border-[#2f3b69]/10 rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-all`}
                        >
                            <div>
                                <h3 className="text-sm font-medium text-[#2f3b69]/70 mb-2">{stat.title}</h3>
                                <p className="text-3xl font-bold text-[#2f3b69]">{stat.count}</p>
                            </div>
                            {stat.icon}
                        </div>
                    ))}
                </div>

                {/* Enquiries Section */}
                <div className="bg-white rounded-xl shadow-md border border-[#2f3b69]/10">
                    {/* Tabs */}
                    <div className="border-b border-[#2f3b69]/10 px-6 pt-6 pb-4">
                        <div className="flex space-x-4">
                            {['pending', 'rejected'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as 'pending' | 'rejected')}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium transition
                                        ${activeTab === tab
                                            ? 'bg-[#2f3b69] text-white'
                                            : 'text-[#2f3b69]/70 hover:bg-[#2f3b69]/10'
                                        }
                                    `}
                                >
                                    {tab === 'pending' ? 'Pending Enquiries' : 'Rejected Enquiries'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enquiries Table */}

                    <div className="p-6">
                        {loading ? (
                            // <div className="text-center text-[#2f3b69]/70">Loading enquiries...</div>
                            <LoadingScreen/>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#2f3b69]/5 text-[#2f3b69]/70">
                                            {['Name', 'Email', 'Phone', 'Address', 'Date', 'Product', 'Actions']
                                                .map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className="px-4 py-3 text-left font-medium text-sm"
                                                    >
                                                        {header}
                                                    </th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnquiries.map(enquiry => (
                                            <tr key={enquiry._id}>
                                                <td className="border px-4 py-2">{enquiry.name}</td>
                                                <td className="border px-4 py-2">{enquiry.email}</td>
                                                <td className="border px-4 py-2">{enquiry.phoneNumber}</td>
                                                <td className="border px-4 py-2">{enquiry.address}</td>
                                                <td className="border px-4 py-2">{formatDate(enquiry.date)}</td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(enquiry.productId);
                                                            setShowProductModal(true);
                                                        }}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                                {activeTab === 'pending' && (
                                                    <td className="border px-4 py-2 flex space-x-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => {
                                                                            setSelectedEnquiry(enquiry);
                                                                            setShowOrderModal(true);
                                                                        }}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300"
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Accept
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Create an order from this enquiry</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => changeStatusToRejected(enquiry._id)}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Reject
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Reject this enquiry</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals remain the same */}
                {showOrderModal && selectedEnquiry && (
                    <CreateOrderModal
                        enquiry={selectedEnquiry}
                        onClose={() => setShowOrderModal(false)}
                        onSubmit={handleCreateOrder}
                    />
                )}

                {showProductModal && selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setShowProductModal(false)}
                    />
                )}
            </div>
        </div>

    );
}








// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//     Package,
//     MessageCircle,
//     Users,
//     ShoppingCart,
//     Mail,
//     Plus,
//     Minus,
//     Eye,
//     ArrowRight,
//     ArrowLeft,
//     Trash2 // Importing Trash2 icon for delete functionality
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button"; // Ensure you have the correct path for Button
// import { Card } from '@/components/ui/card';
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip"; // Ensure you have the correct path for Tooltip
// import { CheckCircle2, XCircle } from "lucide-react"; // Import icons
// import LoadingScreen from '@/components/ui/LoadingScreen';

// // Interfaces
// interface IProduct {
//     _id: string;
//     title: string;
//     price: number;
//     discountedPrice: number;
//     description: string;
//     images: string[];
//     category: string;
//     createdAt: Date;
// }

// interface IEnquiry {
//     _id: string;
//     name: string;
//     email: string;
//     phoneNumber: string;
//     address?: string;
//     date: Date;
//     status: 'accepted' | 'rejected' | 'none';
//     productId: IProduct;
//     accepted: boolean;
//     createdAt: Date;
// }

// // CreateOrderModal Component
// const CreateOrderModal: React.FC<{
//     enquiry: IEnquiry;
//     onClose: () => void;
//     onSubmit: (orderData: FormData) => void;
// }> = ({ enquiry, onClose, onSubmit }) => {
//     const [quantity, setQuantity] = useState(1);
//     const [totalAmount, setTotalAmount] = useState(enquiry.productId.discountedPrice || enquiry.productId.price);
//     const basePrice = enquiry.productId.discountedPrice || enquiry.productId.price;

//     const handleQuantityChange = (newQuantity: number) => {
//         if (newQuantity >= 1) {
//             setQuantity(newQuantity);
//             setTotalAmount(Number((newQuantity * basePrice).toFixed(2)));
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('enquiryId', enquiry._id);
//         formData.append('items', JSON.stringify([{
//             productId: enquiry.productId._id,
//             quantity: quantity,
//             price: basePrice
//         }]));
//         formData.append('totalAmount', totalAmount.toString());
//         formData.append('status', 'pending');

//         onSubmit(formData);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <Card className="bg-[#fafaff] rounded-lg shadow-lg p-6 max-w-md w-full">
//                 <h3 className="text-2xl font-bold text-[#2f3b69] mb-4">Create Order</h3>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-[#2f3b69]">Product</label>
//                         <p className="text-gray-700">{enquiry.productId.title}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-[#2f3b69]">Base Price</label>
//                         <p className="text-gray-700">${basePrice}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-[#2f3b69]">Quantity</label>
//                         <div className="flex items-center space-x-3">
//                             <Button
//                                 type="button"
//                                 onClick={() => handleQuantityChange(quantity - 1)}
//                                 className="p-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b69] hover:text-white transition duration-200"
//                             >
//                                 <Minus className="w-4 h-4" />
//                             </Button>
//                             <span className="w-12 text-center text-[#2f3b69]">{quantity}</span>
//                             <Button
//                                 type="button"
//                                 onClick={() => handleQuantityChange(quantity + 1)}
//                                 className="p-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b 69] hover:text-white transition duration-200"
//                             >
//                                 <Plus className="w-4 h-4" />
//                             </Button>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-[#2f3b69]">Total Amount</label>
//                         <input
//                             type="number"
//                             value={totalAmount}
//                             onChange={(e) => setTotalAmount(Number(e.target.value))}
//                             className="mt-1 block w-full rounded-md border-[#2f3b69] shadow-sm focus:border-[#2f3b69] focus:ring-[#2f3b69] bg-white"
//                             step="0.01"
//                             min="0"
//                         />
//                     </div>

//                     <div className="flex justify-end space-x-3 mt-6">
//                         <Button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border border-[#2f3b69] text-[#2f3b69] rounded-md hover:bg-[#2f3b69] hover:text-white transition duration-200"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="px-4 py-2 bg-[#2f3b69] text-white rounded-md hover:bg-[#1e2a4d] transition duration-200"
//                         >
//                             Create Order
//                         </Button>
//                     </div>
//                 </form>
//             </Card>
//         </div>
//     );
// };

// const ProductModal: React.FC<{
//     product: IProduct | null;
//     onClose: () => void;
// }> = ({ product, onClose }) => {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     if (!product) return null;

//     const handleNextImage = () => {
//         setCurrentImageIndex((prevIndex) =>
//             (prevIndex + 1) % product.images.length
//         );
//     };

//     const handlePrevImage = () => {
//         setCurrentImageIndex((prevIndex) =>
//             prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
//         );
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
//             <Card className="bg-[#fafaff] rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
//                 {/* Image Section */}
//                 <div className="relative bg-gray-100 flex items-center justify-center p-6">
//                     <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
//                         <img
//                             src={product.images[currentImageIndex]}
//                             alt={product.title}
//                             className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-in-out"
//                         />

//                         {/* Image Navigation Buttons */}
//                         {product.images.length > 1 && (
//                             <>
//                                 <Button
//                                     onClick={handlePrevImage}
//                                     className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-[#2f3b69] hover:text-white p-2 rounded-full shadow-md transition duration-200"
//                                 >
//                                     <ArrowLeft className="w-4 h-4" />
//                                 </Button>
//                                 <Button
//                                     onClick={handleNextImage}
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-[#2f3b69] hover:text-white p-2 rounded-full shadow-md transition duration-200"
//                                 >
//                                     <ArrowRight className="w-4 h-4" />
//                                 </Button>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 {/* Product Details Section */}
//                 <div className="p-8 flex flex-col justify-between">
//                     <div>
//                         <h2 className="text-3xl font-bold text-[#2f3b69] mb-4">{product.title}</h2>

//                         <div className="flex items-center mb-6">
//                             <p className="text-2xl font-bold text-[#2f3b69] mr-4">
//                                 ${product.discountedPrice || product.price}
//                             </p>
//                             {product.discountedPrice && product.price !== product.discountedPrice && (
//                                 <p className="text-gray-500 line-through">
//                                     ${product.price}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center">
//                         <p className="text-sm text-gray-500">
//                             Added on: {new Date(product.createdAt).toLocaleDateString()}
//                         </p>
//                         <Button
//                             onClick={onClose}
//                             className="px-6 py-2 bg-[#2f3b69] text-white rounded-full hover:bg-[#1e2a4d] transition-colors"
//                         >
//                             Close
//                         </Button>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// // Main Admin Dashboard Component
// export default function AdminDashboard() {
//     const [user, setUser] = useState<any | null>(null);
//     const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
//     const [productCount, setProductCount] = useState<number>(0);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [showProductModal, setShowProductModal] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
//     const [showOrderModal, setShowOrderModal] = useState(false);
//     const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
//     const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');
//     const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
//     const router = useRouter();

//     // Authentication Effect
//     useEffect(() => {
//         const userDetailsStr = localStorage.getItem('userDetails');
//         if (!userDetailsStr) {
//             router.push('/login');
//             return;
//         }

//         try {
//             const userDetails = JSON.parse(userDetailsStr);
//             setUser(userDetails);
//         } catch {
//             localStorage.removeItem('userDetails');
//             router.push('/login');
//         }
//     }, [router]);

//     // Fetch Enquiries Effect
//     useEffect(() => {
//         const fetchPendingOrders = async () => {
//             try {
//                 const response = await fetch('/api/orders');
//                 const data = await response.json();
//                 const pendingOrders = data.orders
//                     ? data.orders.filter((order: any) => order.status === 'pending')
//                     : data.filter((order: any) => order.status === 'pending');

//                 setPendingOrdersCount(pendingOrders.length);
//             } catch (error) {
//                 console.error('Error fetching pending orders:', error);
//                 setPendingOrdersCount(0);
//             }
//         };

//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch('/api/product');
//                 const data = await response.json();
//                 setProductCount(data?.products?.length || 0);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//                 setProductCount(0);
//             }
//         };

//         const fetchEnquiries = async () => {
//             try {
//                 const response = await fetch('/api/Enquiry');
//                 const data = await response.json();
//                 if (data && Array.isArray(data)) {
//                     setEnquiries(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching enquiries:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPendingOrders();
//         fetchProducts();
//         fetchEnquiries();
//     }, []);

//     // Filter Enquiries
//     const filteredEnquiries = enquiries.filter(enquiry => {
//         if (activeTab === 'pending') {
//             return enquiry.status === 'none';
//         } else {
//             return enquiry.status === 'rejected';
//         }
//     });

//     // Handlers
//     const handleAddToOrders = async (enquiryId: string) => {
//         try {
//             const response = await fetch(`/api/orders/${enquiryId}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 setEnquiries(prevEnquiries =>
//                     prevEnquiries.map(enquiry =>
//                         enquiry._id === enquiryId
//                             ? { ...enquiry, accepted: true, status: 'accepted' }
//                             : enquiry
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error('Error accepting enquiry:', error);
//         }
//     };

//     const handleCreateOrder = async (formData: FormData) => {
//         try {
//             const response = await fetch('/api/orders', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (response.ok) {
//                 await handleAddToOrders(formData.get('enquiryId') as string);
//                 setShowOrderModal(false);
//                 alert('Order created successfully');
//             } else {
//                 const error = await response.json();
//                 throw new Error(error.message);
//             }
//         } catch (error) {
//             console.error('Error creating order:', error);
//             alert('Failed to create order');
//         }
//     };
//     const changeStatusToRejected = async (enquiryId: string) => {
//         try {
//             const response = await fetch(`/ api / Enquiry / ${ enquiryId } `, {
//                 method: activeTab === 'pending' ? 'PATCH' : 'DELETE',
//             });

//             if (response.ok) {
//                 setEnquiries(prevEnquiries =>
//                     prevEnquiries.filter(enquiry => enquiry._id !== enquiryId)
//                 );
//             }
//         } catch (error) {
//             console.error('Error deleting/rejecting enquiry:', error);
//         }
//     };

//     const formatDate = (date: Date) => {
//         return new Date(date).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const pendingEnquiriesCount = enquiries.filter(e => e.status === 'none').length;
//     const rejectedEnquiriesCount = enquiries.filter(e => e.status === 'rejected').length;
//     const totalEnquiriesCount = enquiries.length;

//     if (!user) return null;

//     return (
//         <div className="min-h-screen bg-[#fafaff] text-[#2f3b69]">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Header */}
//                 <header className="flex justify-between items-center mb-10">
//                     <div>
//                         <h1 className="text-4xl font-bold text-[#2f3b69]">Admin Dashboard</h1>
//                         <p className="text-sm text-[#2f3b69]/70">Welcome back, {user?.name || 'Admin'}</p>
//                     </div>
//                     <div className='flex flex-row gap-3'>
//                         <button
//                             onClick={() => {
//                                 router.push('admin/banner');
//                             }}
//                             className="px-6 py-2 bg-white text-[#2f3b69] border border-[#2f3b69] hover:text-white rounded-full hover:bg-[#2f3b69]/90 transition shadow-md"
//                         >
//                             Banners
//                         </button>
//                         <button
//                             onClick={() => {
//                                 localStorage.removeItem('userDetails');
//                                 router.push('/login');
//                             }}
//                             className="px-6 py-2 bg-[#2f3b69] text-white rounded-full hover:bg-[#2f3b69]/90 transition shadow-md"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </header>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                     {[
//                         {
//                             title: 'Pending Enquiries',
//                             count: pendingEnquiriesCount,
//                             icon: <Mail className="w-10 h-10 text-[#2f3b69]/50" />,
//                             bgColor: 'bg-blue-50'
//                         },
//                         {
//                             title: 'Products Listed',
//                             count: productCount,
//                             icon: <Package className="w-10 h-10 text-[#2f3b69]/50" />,
//                             bgColor: 'bg-green-50'
//                         },
//                         {
//                             title: 'Pending Orders',
//                             count: pendingOrdersCount,
//                             icon: <ShoppingCart className="w-10 h-10 text-[#2f3b69]/50" />,
//                             bgColor: 'bg-purple-50'
//                         }
//                     ].map((stat, index) => (
//                         <div
//                             key={index}
//                             className={`${ stat.bgColor } border border - [#2f3b69] / 10 rounded - xl p - 6 flex items - center justify - between hover: shadow - lg transition - all`}
//                         >
//                             <div>
//                                 <h3 className="text-sm font-medium text-[#2f3b69]/70 mb-2">{stat.title}</h3>
//                                 <p className="text-3xl font-bold text-[#2f3b69]">{stat.count}</p>
//                             </div>
//                             {stat.icon}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Enquiries Section */}
//                 <div className="bg-white rounded-xl shadow-md border border-[#2f3b69]/10">
//                     {/* Tabs */}
//                     <div className="border-b border-[#2f3b69]/10 px-6 pt-6 pb-4">
//                         <div className="flex space-x-4">
//                             {['pending', 'rejected'].map((tab) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab as 'pending' | 'rejected')}
//                                     className={`
//     px - 4 py - 2 rounded - full text - sm font - medium transition
//                                         ${active Tab === tab
//         ? 'bg-[#2f3b69] text-white'
//         : 'text-[#2f3b69]/70 hover:bg-[#2f3b69]/10'
//     }
//     `}
//                                 >
//                                     {tab === 'pending' ? 'Pending Enquiries' : 'Rejected Enquiries'}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Enquiries Table */}
//                     <div className="p-6">
//                         {loading ? (
//                             <LoadingScreen />
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead>
//                                         <tr className="bg-[#2f3b69]/5 text-[#2f3b69]/70">
//                                             {['Name', 'Email', 'Phone', 'Address', 'Date', 'Product', 'Actions']
//                                                 .map((header, index) => (
//                                                     <th
//                                                         key={index}
//                                                         className="px-4 py-3 text-left font-medium text-sm"
//                                                     >
//                                                         {header}
//                                                     </th>
//                                                 ))
//                                             }
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {filteredEnquiries.map(enquiry => (
//                                             <tr key={enquiry._id}>
//                                                 <td className="border px-4 py-2">{enquiry.name}</td>
//                                                 <td className="border px-4 py-2">{enquiry.email}</td>
//                                                 <td className="border px-4 py-2">{enquiry.phoneNumber}</td>
//                                                 <td className="border px-4 py-2">{enquiry.address}</td>
//                                                 <td className="border px-4 py-2">{formatDate(enquiry.date)}</td>
//                                                 <td className="border px-4 py-2">
//                                                     <button
//                                                         onClick={() => {
//                                                             setSelectedProduct(enquiry.productId);
//                                                             setShowProductModal(true);
//                                                         }}
//                                                         className="text-blue-500 hover:underline"
//                                                     >
//                                                         View
//                                                     </button>
//                                                 </td>
//                                                 <td className="border px-4 py-2 flex space-x-2">
//                                                     {activeTab === 'pending' && (
//                                                         <>
//                                                             <TooltipProvider>
//                                                                 <Tooltip>
//                                                                     <TooltipTrigger asChild>
//                                                                         <Button
//                                                                             onClick={() => {
//                                                                                 setSelectedEnquiry(enquiry);
//                                                                                 setShowOrderModal(true);
//                                                                             }}
//                                                                             variant="outline"
//                                                                             size="sm"
//                                                                             className="text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300"
//                                                                         >
//                                                                             <CheckCircle2 className="mr-2 h-4 w-4" />
//                                                                             Accept
//                                                                         </Button>
//                                                                     </TooltipTrigger>
//                                                                     <TooltipContent>
//                                                                         <p>Create an order from this enquiry</p>
//                                                                     </TooltipContent>
//                                                                 </Tooltip>
//                                                             </TooltipProvider>

//                                                             <TooltipProvider>
//                                                                 <Tooltip>
//                                                                     <TooltipTrigger asChild>
//                                                                         <Button
//                                                                             onClick={() => changeStatusToRejected(enquiry._id)}
//                                                                             variant="outline"
//                                                                             size="sm"
//                                                                             className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
//                                                                         >
//                                                                             <XCircle className="mr-2 h-4 w-4" />
//                                                                             Reject
//                                                                         </Button>
//                                                                     </TooltipTrigger>
//                                                                     <TooltipContent>
//                                                                         <p>Reject this enquiry</p>
//                                                                     </TooltipContent>
//                                                                 </Tooltip>
//                                                             </TooltipProvider>
//                                                         </>
//                                                     )}
//                                                     {activeTab === 'rejected' && (
//                                                         <TooltipProvider>
//                                                             <Tooltip>
//                                                                 <TooltipTrigger asChild>
//                                                                     <Button
//                                                                         onClick={() => changeStatusToRejected(enquiry._id)}
//                                                                         variant="outline"
//                                                                         size="sm"
//                                                                         className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
//                                                                     >
//                                                                         <Trash2 className="mr-2 h-4 w-4" />
//                                                                         Delete
//                                                                     </Button>
//                                                                 </TooltipTrigger>
//                                                                 <TooltipContent>
//                                                                     <p>Permanently delete this enquiry</p>
//                                                                 </TooltipContent>
//                                                             </Tooltip>
//                                                         </TooltipProvider>
//                                                     )}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Modals remain the same */}
//                 {showOrderModal && selectedEnquiry && (
//                     <CreateOrderModal
//                         enquiry={selectedEnquiry}
//                         onClose={() => setShowOrderModal(false)}
//                         onSubmit={handleCreateOrder}
//                     />
//                 )}

//                 {showProductModal && selectedProduct && (
//                     <ProductModal
//                         product={selectedProduct}
//                         onClose={() => setShowProductModal(false)}
//                     />
//  )}
//             </div>
//         </div>
//     );
// }