// app/api/products/category/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/models/Products';

export async function GET(
    request: NextRequest,
    // { params }: { params: { productId: string } }
    { params }: { params: Promise<{ productId: string }> }

) {
    try {
        const { productId } = await params;  // Await params before using it

        // Connect to MongoDB
        await connectMongo();

        // Fetch the product to get the category
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Find all products in the same category, excluding the current product
        const productsInSameCategory = await Product.find({
            category: product.category
        }).where('_id').ne(productId); // Ensure the current product isn't included

        return NextResponse.json(productsInSameCategory);
    } catch (error) {
        console.error('Error fetching products in the same category:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
