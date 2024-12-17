

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Eye, Package, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
// import {
//     Alert,
//     AlertDescription,
//     AlertTitle
// } from "@/components/ui/alert";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
//     DialogClose
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

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

// interface IOrder {
//     _id: string;
//     orderNumber: string;
//     totalAmount: number;
//     status: 'pending' | 'delivered';
//     datePlaced: Date;
//     items: {
//         productId: IProduct;
//         quantity: number;
//     }[];
//     enquiryId: {
//         name: string;
//         email: string;
//         phoneNumber: string;
//         address: string;
//     };
// }

// // Product Details Modal Component
// const ProductDetailsModal: React.FC<{
//     product: IProduct;
//     onClose: () => void
// }> = ({ product, onClose }) => {
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M6 18L18 6M6 6l12 12"
//                         />
//                     </svg>
//                 </button>

//                 {/* Modal Content */}
//                 <div className="grid md:grid-cols-2 gap-8">
//                     {/* Product Images */}
//                     <div className="grid grid-cols-2 gap-4">
//                         {product.images.map((image, index) => (
//                             <div
//                                 key={index}
//                                 className="aspect-square overflow-hidden rounded-xl"
//                             >
//                                 <img
//                                     src={image}
//                                     alt={`Product ${index + 1}`}
//                                     className="w-full h-full object-cover hover:scale-105 transition-transform"
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Product Details */}
//                     <div className="space-y-4">
//                         <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>

//                         <div className="bg-gray-50 p-4 rounded-xl">
//                             <p className="text-sm text-gray-600 mb-2">Description</p>
//                             <p className="text-gray-800">{product.description}</p>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">Price</p>
//                                 <p className="text-2xl font-bold text-green-600">
//                                     ${product.discountedPrice || product.price}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Main Orders Page Component
// export default function OrdersPage() {
//     // State Management
//     const [orders, setOrders] = useState<IOrder[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
//     const [activeTab, setActiveTab] = useState<'pending' | 'delivered'>('pending');
//     const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

//     // New state for alerts
//     const [alert, setAlert] = useState<{
//         type: 'success' | 'error';
//         message: string;
//     } | null>(null);

//     // Clear alert after 3 seconds
//     useEffect(() => {
//         if (alert) {
//             const timer = setTimeout(() => {
//                 setAlert(null);
//             }, 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [alert]);

//     // Fetch Orders Effect
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await fetch('/api/orders');
//                 const data = await response.json();
//                 if (Array.isArray(data)) {
//                     setOrders(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching orders:', error);
//                 setAlert({
//                     type: 'error',
//                     message: 'Failed to fetch orders'
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchOrders();
//     }, []);

//     // Mark Order as Delivered
//     const handleMarkAsDelivered = async (orderId: string) => {
//         try {
//             const response = await fetch(`/api/orders/${orderId}`, {
//                 method: 'PUT',
//             });

//             if (response.ok) {
//                 setOrders((prevOrders) =>
//                     prevOrders.map((order) =>
//                         order._id === orderId ? { ...order, status: 'delivered' } : order
//                     )
//                 );
//                 setAlert({
//                     type: 'success',
//                     message: 'Order marked as delivered successfully'
//                 });
//             } else {
//                 setAlert({
//                     type: 'error',
//                     message: 'Failed to mark order as delivered'
//                 });
//             }
//         } catch (error) {
//             console.error('Error marking order as delivered:', error);
//             setAlert({
//                 type: 'error',
//                 message: 'An error occurred while marking order as delivered'
//             });
//         }
//     };

//     // Delete Order Handler
//     const handleDeleteOrder = async () => {
//         if (!orderToDelete) return;

//         try {
//             const response = await fetch(`/api/orders/${orderToDelete}`, {
//                 method: 'DELETE',
//             });

//             if (response.ok) {
//                 // Remove the order from the state
//                 setOrders((prevOrders) =>
//                     prevOrders.filter((order) => order._id !== orderToDelete)
//                 );

//                 // Show success alert
//                 setAlert({
//                     type: 'success',
//                     message: 'Order deleted successfully'
//                 });

//                 // Close the confirmation dialog
//                 setOrderToDelete(null);
//             } else {
//                 // Show error alert
//                 setAlert({
//                     type: 'error',
//                     message: 'Failed to delete order'
//                 });
//             }
//         } catch (error) {
//             console.error('Error deleting order:', error);
//             setAlert({
//                 type: 'error',
//                 message: 'An error occurred while deleting the order'
//             });
//         }
//     };

//     // Date Formatting Utility
//     const formatDate = (date: Date) => {
//         return new Date(date).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Filter orders based on active tab
//     const filteredOrders = orders.filter(order => order.status === activeTab);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
//             {/* Alert Component */}
//             {alert && (
//                 <div className="fixed top-4 right-4 z-50">
//                     <Alert
//                         variant={alert.type === 'success' ? 'default' : 'destructive'}
//                     >
//                         {alert.type === 'success' ? (
//                             <CheckCircle className="h-4 w-4" />
//                         ) : (
//                             <AlertCircle className="h-4 w-4" />
//                         )}
//                         <AlertTitle>
//                             {alert.type === 'success' ? 'Success' : 'Error'}
//                         </AlertTitle>
//                         <AlertDescription>
//                             {alert.message}
//                         </AlertDescription>
//                     </Alert>
//                 </div>
//             )}
//             <div className="container mx-auto max-w-6xl">
//                 {/* Page Header */}
//                 <div className="flex items-center mb-10 space-x-4">
//                     <Package className="w-10 h-10 text-blue-600" />
//                     <h1 className="text-4xl font-bold text-gray-800">Order Management</h1>
//                 </div>

//                 {/* Tab Navigation */}
//                 <div className="mb-6 flex space-x-4">
//                     {[
//                         {
//                             key: 'pending',
//                             label: 'Pending Orders',
//                             icon: <Clock className="w-5 h-5 mr-2" />
//                         },
//                         {
//                             key: 'delivered',
//                             label: 'Delivered Orders',
//                             icon: <CheckCircle className="w-5 h-5 mr-2" />
//                         }
//                     ].map((tab) => (
//                         <button
//                             key={tab.key}
//                             onClick={() => setActiveTab(tab.key as any)}
//                             className={`
//                                 flex items-center px-4 py-2 rounded-lg transition-all
//                                 ${activeTab === tab.key
//                                     ? 'bg-blue-500 text-white'
//                                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                                 }
//                             `}
//                         >
//                             {tab.icon}
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 border-solid"></div>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                         {filteredOrders.length === 0 ? (
//                             <div className="text-center py-10 text-gray-500">
//                                 No {activeTab} orders found
//                             </div>
//                         ) : (
//                             <table className="w-full">
//                                 {/* Table Header */}
//                                 <thead className="bg-blue-50 border-b border-gray-200">
//                                     <tr>
//                                         {['Order Number', 'Product', 'Customer', 'Date', 'Actions'].map((header) => (
//                                             <th
//                                                 key={header}
//                                                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                             >
//                                                 {header}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>

//                                 {/* Table Body */}
//                                 <tbody>
//                                     {filteredOrders.map((order) => (
//                                         <tr
//                                             key={order._id}
//                                             className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
//                                         >
//                                             <td className="px-6 py-4">{order.orderNumber}</td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center space-x-3">
//                                                     <span className="font-medium">{order.items[0].productId.title}</span>
//                                                     <button
//                                                         onClick={() => {
//                                                             setSelectedProduct(order.items[0].productId);
//                                                         }}
//                                                         className="
//                                                             inline-flex items-center 
//                                                             px-2 py-1 
//                                                             bg-blue-50 text-blue-600 
//                                                             hover:bg-blue-100 
//                                                             rounded-md 
//                                                             text-xs 
//                                                             transition-colors
//                                                             focus:outline-none 
//                                                             focus:ring-2 
//                                                             focus:ring-blue-300
//                                                         "
//                                                     >
//                                                         <Eye className="w-3 h-3 mr-1" />
//                                                         View
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div>
//                                                     <p><strong >{order?.enquiryId?.name}</strong></p>
//                                                     <p>{order?.enquiryId?.email}</p>
//                                                     <p>{order?.enquiryId?.phoneNumber}</p>
//                                                     <p>{order?.enquiryId?.address}</p>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">{formatDate(order.datePlaced)}</td>
//                                             <td className="px-6 py-4 text-center">
//                                                 {activeTab === 'pending' ? (
//                                                     <button
//                                                         onClick={() => handleMarkAsDelivered(order._id)}
//                                                         className="
//                                                             inline-flex items-center 
//                                                             px-3 py-1.5 
//                                                             bg-green-50 text-green-600 
//                                                             hover:bg-green-100 
//                                                             rounded-md 
//                                                             text-sm 
//                                                             transition-colors
//                                                             focus:outline-none 
//                                                             focus:ring-2 
//                                                             focus:ring-green-300
//                                                         "
//                                                     >
//                                                         <CheckCircle className="w-4 h-4 mr-2" />
//                                                         Mark as Delivered
//                                                     </button>
//                                                 ) : (
//                                                     <div className="flex space-x-2 justify-center">
//                                                         <button
//                                                             onClick={() => setOrderToDelete(order._id)}
//                                                             className="
//                                                                 inline-flex items-center 
//                                                                 px-3 py-1.5 
//                                                                 bg-red-50 text-red-600 
//                                                                 hover:bg-red-100 
//                                                                 rounded-md 
//                                                                 text-sm 
//                                                                 transition-colors
//                                                                 focus:outline-none 
//                                                                 focus:ring-2 
//                                                                 focus:ring-red-300
//                                                             "
//                                                         >
//                                                             <Trash2 className="w-4 h-4 mr-2" />
//                                                             Delete
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 )}

//                 {/* Product Details Modal */}
//                 {selectedProduct && (
//                     <ProductDetailsModal
//                         product={selectedProduct}
//                         onClose={() => setSelectedProduct(null)}
//                     />
//                 )}

//                 {/* Delete Confirmation Dialog */}
//                 {orderToDelete && (
//                     <Dialog
//                         open={!!orderToDelete}
//                         onOpenChange={() => setOrderToDelete(null)}
//                     >
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Confirm Delete</DialogTitle>
//                                 <DialogDescription>
//                                     Are you sure you want to delete this order?
//                                     This action cannot be undone.
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <DialogFooter>
//                                 <DialogClose asChild>
//                                     <Button variant="outline">Cancel</Button>
//                                 </DialogClose>
//                                 <Button
//                                     variant="destructive"
//                                     onClick={handleDeleteOrder}
//                                 >
//                                     Delete
//                                 </Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//                 )}
//             </div>
//         </div>
//     );
// }










'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Package, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface IOrder {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: 'pending' | 'delivered';
    datePlaced: Date;
    items: {
        productId: IProduct;
        quantity: number;
    }[];
    enquiryId: {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
    };
}

// Product Details Modal Component
const ProductDetailsModal: React.FC<{
    product: IProduct;
    onClose: () => void
}> = ({ product, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button - Improved positioning and hover state */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Modal Content - Improved responsiveness */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Images - Enhanced layout */}
                    <div className="grid grid-cols-2 gap-4">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className="aspect-square overflow-hidden rounded-xl border"
                            >
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Product Details - Improved typography and spacing */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">{product.title}</h2>

                        <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${product.discountedPrice || product.price}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Orders Page Component
export default function OrdersPage() {
    // State Management
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'delivered'>('pending');
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    // New state for alerts
    const [alert, setAlert] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Clear alert after 3 seconds
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Fetch Orders Effect
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setAlert({
                    type: 'error',
                    message: 'Failed to fetch orders'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Mark Order as Delivered
    const handleMarkAsDelivered = async (orderId: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
            });

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: 'delivered' } : order
                    )
                );
                setAlert({
                    type: 'success',
                    message: 'Order marked as delivered successfully'
                });
            } else {
                setAlert({
                    type: 'error',
                    message: 'Failed to mark order as delivered'
                });
            }
        } catch (error) {
            console.error('Error marking order as delivered:', error);
            setAlert({
                type: 'error',
                message: 'An error occurred while marking order as delivered'
            });
        }
    };

    // Delete Order Handler
    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            const response = await fetch(`/api/orders/${orderToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order._id !== orderToDelete)
                );

                setAlert({
                    type: 'success',
                    message: 'Order deleted successfully'
                });

                setOrderToDelete(null);
            } else {
                setAlert({
                    type: 'error',
                    message: 'Failed to delete order'
                });
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            setAlert({
                type: 'error',
                message: 'An error occurred while deleting the order'
            });
        }
    };

    // Date Formatting Utility
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Improved Alert Component
    const renderAlert = () => {
        if (!alert) return null;

        const alertStyles = {
            success: {
                background: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-800',
                icon: <CheckCircle className="h-5 w-5 text-green-600" />
            },
            error: {
                background: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-800',
                icon: <AlertCircle className="h-5 w-5 text-red-600" />
            }
        };

        const currentStyle = alertStyles[alert.type];

        return (
            <div className={`
                fixed top-4 right-4 z-50 
                ${currentStyle.background} 
                ${currentStyle.border} 
                ${currentStyle.text}
                border rounded-lg 
                shadow-lg 
                p-4 
                flex 
                items-center 
                space-x-3
                animate-in 
                slide-in-from-top-2
                duration-300
            `}>
                {currentStyle.icon}
                <div>
                    <p className="font-semibold">
                        {alert.type === 'success' ? 'Success' : 'Error'}
                    </p>
                    <p className="text-sm">{alert.message}</p>
                </div>
            </div>
        );
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => order.status === activeTab);

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-50">
            {/* Improved Alert Rendering */}
            {renderAlert()}

            <div className="container mx-auto max-w-6xl">
                {/* Page Header - Improved vertical alignment */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <Package className="w-10 h-10 text-[#2f3b69]" />
                        <h1 className="text-4xl font-bold text-[#2f3b69]">Order Management</h1>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 flex space-x-4">
                    {[
                        {
                            key: 'pending',
                            label: 'Pending Orders',
                            icon: <Clock className="w-5 h-5 mr-2" />
                        },
                        {
                            key: 'delivered',
                            label: 'Delivered Orders',
                            icon: <CheckCircle className="w-5 h-5 mr-2" />
                        }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`
                                flex items-center px-4 py-2 rounded-lg transition-all
                                ${activeTab === tab.key
                                    ? 'bg-[#2f3b69] text-white'
                                    : 'bg-white text-[#2f3b69] hover:bg-gray-100'
                                }
                            `}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#2f3b69] border-solid"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No {activeTab} orders found
                            </div>
                        ) : (
                            <table className="w-full">
                                {/* Table Header */}
                                <thead className="bg-[#2f3b69] text-white">
                                    <tr>
                                        {['Order Number', 'Product' ,'Total Price','Quantity', 'Customer', 'Date', 'Actions'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">{order.orderNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-medium">{order.items[0].productId.title}</span>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(order.items[0].productId);
                                                        }}
                                                        className="
                                                            inline-flex items-center 
                                                            px-2 py-1 
                                                            bg-[#fafaff] text-[#2f3b69] 
                                                            hover:bg-gray-100 
                                                            rounded-md 
                                                            text-xs 
                                                            transition-colors
                                                            focus:outline-none 
                                                            focus:ring-2 
                                                            focus:ring-[#2f3b69]
                                                        "
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">₹{order.totalAmount}</td>
                                            <td className="px-6 py-4">x {order.totalAmount / order.items[0].productId.discountedPrice}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p><strong>{order?.enquiryId?.name}</strong></p>
                                                    <p>{order?.enquiryId?.email}</p>
                                                    <p>{order?.enquiryId?.phoneNumber}</p>
                                                    <p>{order?.enquiryId?.address}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{formatDate(order.datePlaced)}</td>
                                            <td className="px-6 py-4 text-center">
                                                {activeTab === 'pending' ? (
                                                    <button
                                                        onClick={() => handleMarkAsDelivered(order._id)}
                                                        className="
                                                            inline-flex items-center 
                                                            px-3 py-1.5 
                                                            bg-green-50 text-green-600 
                                                            hover:bg-green-100 
                                                            rounded-md 
                                                            text-sm 
                                                            transition-colors
                                                            focus:outline-none 
                                                            focus:ring-2 
                                                            focus:ring-green-300
                                                        "
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Mark as Delivered
                                                    </button>
                                                ) : (
                                                    <div className="flex space-x-2 justify-center">
                                                        <button
                                                            onClick={() => setOrderToDelete(order._id)}
                                                            className="
                                                                inline-flex items-center 
                                                                px-3 py-1.5 
                                                                bg-red-50 text-red-600 
                                                                hover:bg-red-100 
                                                                rounded-md 
                                                                text-sm 
                                                                transition-colors
                                                                focus:outline-none 
                                                                focus:ring-2 
                                                                focus:ring-red-300
                                                            "
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Product Details Modal */}
                {selectedProduct && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                {orderToDelete && (
                    <Dialog
                        open={!!orderToDelete}
                        onOpenChange={() => setOrderToDelete(null)}
                        
                    >
                        <DialogContent className='bg-white'>
                            <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this order? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteOrder}
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}