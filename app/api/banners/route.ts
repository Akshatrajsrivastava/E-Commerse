// import { NextRequest, NextResponse } from 'next/server';
// import connectMongo from '@/lib/mongodb';
// import Banner from '@/models/Banner';
// import cloudinary from 'cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Helper function to upload images to Cloudinary
// async function uploadToCloudinary(buffer: Buffer): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.v2.uploader.upload_stream(
//             {
//                 resource_type: 'auto',
//                 folder: 'banners' // Optional: organize banners in a specific folder
//             },
//             (error, result) => {
//                 if (error || !result) {
//                     reject(error || new Error('Failed to upload to Cloudinary'));
//                     return;
//                 }
//                 resolve(result.secure_url);
//             }
//         );

//         const Readable = require('stream').Readable;
//         const readableStream = new Readable();
//         readableStream.push(buffer);
//         readableStream.push(null);
//         readableStream.pipe(uploadStream);
//     });
// }

// // Helper function to convert FormDataEntryValue to Buffer
// async function formDataEntryToBuffer(entry: FormDataEntryValue): Promise<Buffer> {
//     if (entry && typeof (entry as any).arrayBuffer === 'function') {
//         const arrayBuffer = await (entry as File | Blob).arrayBuffer();
//         return Buffer.from(arrayBuffer);
//     }
//     throw new Error('Invalid file entry');
// }

// // POST API to upload an image and save its URL
// export async function POST(request: NextRequest) {
//     try {
//         await connectMongo();
//         const formData = await request.formData();

//         const imageEntry = formData.get('image');
//         const bannerType = formData.get('bannerType') as string;

//         if (!imageEntry) {
//             return NextResponse.json(
//                 { error: 'No image provided' },
//                 { status: 400 }
//             );
//         }

//         if (!['main', 'secondary1', 'secondary2'].includes(bannerType)) {
//             return NextResponse.json(
//                 { error: 'Invalid banner type' },
//                 { status: 400 }
//             );
//         }

//         const buffer = await formDataEntryToBuffer(imageEntry);
//         const imageUrl = await uploadToCloudinary(buffer);

//         // Deactivate any existing active banner of this type
//         await Banner.updateMany(
//             { bannerType, isActive: true },
//             { isActive: false }
//         );

//         // Create new banner
//         const newBanner = new Banner({
//             bannerType,
//             bannerUrl: imageUrl,
//             isActive: true
//         });
//         await newBanner.save();

//         return NextResponse.json({
//             message: 'Banner uploaded and saved successfully',
//             data: newBanner,
//         });
//     } catch (error) {
//         console.error('Banner upload error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }

// // GET API to retrieve active banners
// export async function GET() {
//     try {
//         await connectMongo();

//         const activeBanners = await Banner.find({ isActive: true });

//         return NextResponse.json({
//             message: 'Active banners retrieved successfully',
//             data: activeBanners,
//         });
//     } catch (error) {
//         console.error('Error retrieving banners:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }





import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Banner from '@/models/Banner';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload images to Cloudinary
async function uploadToCloudinary(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'banners' // Optional: organize banners in a specific folder
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Failed to upload to Cloudinary'));
                    return;
                }
                resolve(result.secure_url);
            }
        );

        const Readable = require('stream').Readable;
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
}

// Helper function to convert FormDataEntryValue to Buffer
async function formDataEntryToBuffer(entry: FormDataEntryValue): Promise<Buffer> {
    if (entry && typeof (entry as any).arrayBuffer === 'function') {
        const arrayBuffer = await (entry as File | Blob).arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    throw new Error('Invalid file entry');
}

// POST API to upload an image and save its URL
export async function POST(request: NextRequest) {
    try {
        await connectMongo();
        const formData = await request.formData();

        const imageEntry = formData.get('image');
        const bannerType = formData.get('bannerType') as string;

        if (!imageEntry) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        if (!['main', 'secondary1', 'secondary2'].includes(bannerType)) {
            return NextResponse.json(
                { error: 'Invalid banner type' },
                { status: 400 }
            );
        }

        const buffer = await formDataEntryToBuffer(imageEntry);
        const imageUrl = await uploadToCloudinary(buffer);

        // Find and update existing banner, or create a new one if not exists
        const updatedBanner = await Banner.findOneAndUpdate(
            { bannerType },
            {
                bannerUrl: imageUrl,
                isActive: true
            },
            {
                upsert: true,  // Create if not exists
                new: true,     // Return the updated/new document
                runValidators: true  // Run schema validations
            }
        );

        return NextResponse.json({
            message: 'Banner uploaded and saved successfully',
            data: updatedBanner,
        });
    } catch (error) {
        console.error('Banner upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET API to retrieve active banners
export async function GET() {
    try {
        await connectMongo();

        const activeBanners = await Banner.find({ isActive: true });

        return NextResponse.json({
            message: 'Active banners retrieved successfully',
            data: activeBanners,
        });
    } catch (error) {
        console.error('Error retrieving banners:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}