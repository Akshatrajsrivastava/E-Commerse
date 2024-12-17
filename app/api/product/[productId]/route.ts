import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/models/Products';
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
            { resource_type: 'auto' },
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

// Helper function to validate prices
function validatePrices(price: number, discountedPrice?: number): string | null {
    if (!price || price <= 0) {
        return 'Price must be greater than 0';
    }

    if (discountedPrice !== undefined && discountedPrice !== null) {
        if (discountedPrice <= 0) {
            return 'Discounted price must be greater than 0';
        }
        if (discountedPrice >= price) {
            return 'Discounted price must be less than the original price';
        }
    }

    return null;
}

// Update Product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
    // { params }: { params: { productId: string } }
) {
    const {productId} = await params;

    try {
        await connectMongo();
        const formData = await request.formData();

        // Extract and parse the form data
        const title = formData.get('title') as string;
        const price = parseFloat(formData.get('price') as string);
        const discountedPriceStr = formData.get('discountedPrice') as string;
        const discountedPrice = discountedPriceStr ? parseFloat(discountedPriceStr) : undefined;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageEntries = formData.getAll('images');

        // Validate prices before proceeding
        const priceError = validatePrices(price, discountedPrice);
        if (priceError) {
            return NextResponse.json(
                { error: priceError },
                { status: 400 }
            );
        }

        // Prepare the updated fields
        const updatedData: any = {
            title,
            price,
            description,
            category
        };

        // Only include discountedPrice if it's provided and valid
        if (discountedPrice !== undefined) {
            updatedData.discountedPrice = discountedPrice;
        }

        // Handle image updates (if new images are provided)
        if (imageEntries.length > 0) {
            const imageUrls: string[] = [];

            for (const entry of imageEntries) {
                const buffer = await formDataEntryToBuffer(entry);
                const imageUrl = await uploadToCloudinary(buffer);
                imageUrls.push(imageUrl);
            }

            updatedData.images = imageUrls;
        }

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedData,
            {
                new: true,
                runValidators: false // Disable mongoose validation since we're handling it manually
            }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('validation')) {
                return NextResponse.json(
                    { error: 'Validation error: Please check your input' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to convert FormDataEntryValue to Buffer
async function formDataEntryToBuffer(entry: FormDataEntryValue): Promise<Buffer> {
    if (entry && typeof (entry as any).arrayBuffer === 'function') {
        const arrayBuffer = await (entry as File | Blob).arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    throw new Error('Invalid file entry');
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;

        await connectMongo();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Only attempt to populate if the product has a category
        if (product.category) {
            await product.populate('category');
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Fetch product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
// Delete Product
export async function DELETE(
    request: NextRequest,
    // { params }: { params: { productId: string } }
    { params }: { params: Promise<{ productId: string }> }

) {
    try {
        const productId = await params;
        await connectMongo();
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}