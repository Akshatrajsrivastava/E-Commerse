// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
    try {
        await connectMongo();
        const categories = await Category.find({});
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Fetch categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectMongo();
        const { name, description } = await request.json();

        const newCategory = new Category({ name, description });
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Add category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongo();
        const { id } = await request.json();

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}