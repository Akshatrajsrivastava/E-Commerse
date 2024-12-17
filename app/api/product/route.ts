import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/models/Products';
import Category from '@/models/Category';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to convert FormDataEntryValue to Buffer
async function formDataEntryToBuffer(entry: FormDataEntryValue): Promise<Buffer> {
    if (typeof entry === 'object' && (entry instanceof (File as any) || entry instanceof (Blob as any))) {
        const arrayBuffer = await entry.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    throw new Error('Invalid file entry');
}

// Upload images to Cloudinary
async function uploadToCloudinary(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Failed to upload to Cloudinary'));
                    return;
                }
                resolve(result.secure_url);
            }
        );

        // Create a readable stream from the buffer and pipe it to the upload stream
        const Readable = require('stream').Readable;
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
}

// Create Product
export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const formData = await request.formData();

        // Extract data from FormData
        const title = formData.get('title') as string;
        const price = parseFloat(formData.get('price') as string);
        const discountedPrice = formData.get('discountedPrice') ?
            parseFloat(formData.get('discountedPrice') as string) :
            undefined;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageEntries = formData.getAll('images');

        // Validate required fields
        if (!title || !price || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return NextResponse.json(
                { error: 'Invalid category' },
                { status: 400 }
            );
        }

        // Upload images to Cloudinary if present
        const imageUrls: string[] = [];
        if (imageEntries.length > 0) {
            try {
                for (const entry of imageEntries) {
                    const buffer = await formDataEntryToBuffer(entry);
                    const imageUrl = await uploadToCloudinary(buffer);
                    imageUrls.push(imageUrl);
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json(
                    { error: 'Failed to upload images' },
                    { status: 500 }
                );
            }
        }

        // Create and save the product
        const newProduct = new Product({
            title,
            price,
            discountedPrice,
            description,
            images: imageUrls,
            category,
        });

        await newProduct.save();

        return NextResponse.json(
            { message: 'Product created successfully', product: newProduct },
            { status: 201 }
        );
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// // Get All Products
// export async function GET(request: NextRequest) {
//     try {
//         await connectMongo();

//         // Support for pagination and filtering
//         const { searchParams } = new URL(request.url);
//         const page = parseInt(searchParams.get('page') || '1');
//         const limit = parseInt(searchParams.get('limit') || '10');
//         const category = searchParams.get('category');

//         const query = category ? { category } : {};

//         const products = await Product.find(query)
//             .populate('category')
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .sort({ createdAt: -1 });

//         const total = await Product.countDocuments(query);

//         return NextResponse.json({
//             products,
//             totalPages: Math.ceil(total / limit),
//             currentPage: page
//         });
//     } catch (error) {
//         console.error('Fetch products error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }


// Get All Products (without any filtering, pagination, sorting, or category population)
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Fetch all products from the Product collection
        const products = await Product.find();

        return NextResponse.json({
            products,
        });
    } catch (error) {
        console.error('Fetch products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
