// "use client";

// import React, { useState, FormEvent } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';

// interface BannerUploadProps {
//     bannerType: 'main' | 'secondary1' | 'secondary2';
//     onUploadSuccess: (imageUrl: string) => void;
// }

// export function BannerUpload({ bannerType, onUploadSuccess }: BannerUploadProps) {
//     const [file, setFile] = useState<File | null>(null);
//     const [isUploading, setIsUploading] = useState(false);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setFile(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!file) {
//             toast.error('Please select an image');
//             return;
//         }

//         setIsUploading(true);

//         try {
//             const formData = new FormData();
//             formData.append('image', file);
//             formData.append('bannerType', bannerType);

//             const response = await fetch('/api/banners', {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 toast.success('Banner uploaded successfully');
//                 onUploadSuccess(result.data.banner);
//                 setFile(null);
//             } else {
//                 toast.error(result.error || 'Upload failed');
//             }
//         } catch (error) {
//             toast.error('An error occurred during upload');
//             console.error(error);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//                 <Label htmlFor={`banner-${bannerType}`}>
//                     Upload {bannerType.charAt(0).toUpperCase() + bannerType.slice(1)} Banner
//                 </Label>
//                 <Input
//                     id={`banner-${bannerType}`}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="mt-2"
//                 />
//             </div>
//             <Button
//                 type="submit"
//                 disabled={!file || isUploading}
//                 className="w-full"
//             >
//                 {isUploading ? 'Uploading...' : 'Upload Banner'}
//             </Button>
//         </form>
//     );
// }





"use client";

import React, { useState, FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';

interface BannerUploadProps {
    bannerType: 'main' | 'secondary1' | 'secondary2';
    onUploadSuccess: (imageUrl: string) => void;
}

export function BannerUpload({ bannerType, onUploadSuccess }: BannerUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF.');
                return;
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            setFile(selectedFile);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select an image');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('bannerType', bannerType);

            const response = await fetch('/api/banners', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Banner uploaded successfully');
                onUploadSuccess(result.data.banner);
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast.error(result.error || 'Upload failed');
            }
        } catch (error) {
            toast.error('An error occurred during upload');
            console.error(error);
        } finally {
            setIsUploading(false);
            window.location.reload();
        }
    };

    const clearPreview = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor={`banner-${bannerType}`}>
                    Upload {bannerType.charAt(0).toUpperCase() + bannerType.slice(1)} Banner
                </Label>
                <Input
                    ref={fileInputRef}
                    id={`banner-${bannerType}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="mt-2"
                />
            </div>

            {preview && (
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
                    <Image
                        src={preview}
                        alt="Preview of uploaded banner"
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                    <button
                        type="button"
                        onClick={clearPreview}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                        ✕
                    </button>
                </div>
            )}

            <Button
                type="submit"
                disabled={!file || isUploading}
                className="w-full"
            >
                {isUploading ? 'Uploading...' : 'Upload Banner'}
            </Button>
        </form>
    );
}