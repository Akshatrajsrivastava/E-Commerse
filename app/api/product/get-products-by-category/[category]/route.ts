import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/models/Products';
import Category from '@/models/Category';

export async function GET(request: NextRequest, { params }: { params: Promise<{ category: string }> }
) {
    // console.log('Received request for category:', params.category);
    const {category} = await params; // Get the category from the URL parameters

    if (!category) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    try {
        await connectMongo();

        // Find the category by name
        const categories = await Category.findOne({ name: category });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Find products that belong to the found category
        const products = await Product.find({ category: categories._id }).populate('category', 'name');

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}