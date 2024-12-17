// app/api/product/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  connectMongo  from '@/lib/mongodb';
import Product from '@/models/Products'; // Adjust the import path as needed

export async function GET(request: NextRequest) {
    try {
        // Get the search query from URL parameters
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();

        // If no query, return empty results
        if (!query || query.length < 2) {
            return NextResponse.json({
                products: [],
                totalResults: 0
            });
        }

        // Connect to MongoDB
        await connectMongo();

        // Create a case-insensitive regex search
        const searchRegex = new RegExp(query, 'i');

        // Perform search across multiple fields
        const products = await Product.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                // Remove category search or modify carefully
            ]
        })
            .limit(10) // Limit to 10 suggestions
            .select('title images price discountedPrice') // Select only necessary fields
            .lean(); // Convert to plain JavaScript object

        return NextResponse.json({
            products,
            totalResults: products.length
        });

    } catch (error) {
        console.error('Search products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}