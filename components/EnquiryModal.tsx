

// EnquiryModal.tsx
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EnquiryModalProps {
    productId: string; // Changed to string to match MongoDB _id
    isOpen: boolean;
    onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, productId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation Rules
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/; //   phone number format

        // Validation Checks
        const validationErrors: string[] = [];

        // Name Validation
        if (name.trim().length < 2) {
            validationErrors.push("Name must be at least 2 characters long.");
        }

        // Email Validation
        if (!emailRegex.test(email.trim())) {
            validationErrors.push("Please enter a valid email address.");
        }

        // Phone Number Validation
        if (!phoneRegex.test(phoneNumber.trim())) {
            validationErrors.push("Please enter a valid Indian phone number.");
        }

        // Address Validation (optional, but can add length check if needed)
        if (address && address.trim().length > 200) {
            validationErrors.push("Address cannot exceed 200 characters.");
        }

        // If there are validation errors, set error and return
        if (validationErrors.length > 0) {
            setError(validationErrors.join(" "));
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('phoneNumber', phoneNumber.trim());
            formData.append('address', address.trim());
            formData.append('productId', productId);

            const response = await fetch('/api/Enquiry', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit enquiry');
            }

            setIsSubmitted(true);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit enquiry');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setIsSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                {isSubmitted ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="text-green-500 mb-4" size={48} />
                        <h2 className="text-xl font-bold mb-2">Thank you for your enquiry!</h2>
                        <p className="text-center text-gray-600 mb-4">
                            We will contact you soon with more information.
                        </p>
                        <button
                            onClick={handleClose}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">Product Enquiry</h2>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="address">
                                    Address (optional)
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnquiryModal;