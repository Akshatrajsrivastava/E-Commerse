import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry'; // Import your Enquiry model
import Product from '@/models/Products'; // Import Product model to validate productId

// Create Enquiry
export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        // Parse form data
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const address = formData.get('address') as string;
        const productId = formData.get('productId') as string;

        // Validate required fields
        if (!name || !email || !phoneNumber || !productId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if the provided productId exists in the database
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 400 }
            );
        }

        // Create new Enquiry object with status set to 'none' by default
        const newEnquiry = new Enquiry({
            name,
            email,
            phoneNumber,
            address: address || '', // Address is optional
            productId,
            status: 'none', // Set status to 'none' by default
        });

        // Save the enquiry
        await newEnquiry.save();

        return NextResponse.json(
            { message: 'Enquiry submitted successfully', enquiry: newEnquiry },
            { status: 201 }
        );
    } catch (error) {
        console.error('Add enquiry error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get All Enquiries
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Fetch all enquiries without pagination or filtering
        const enquiries = await Enquiry.find()
            .populate('productId') // Optionally populate the product details if needed

        // Return only the enquiry data
        return NextResponse.json(enquiries);
    } catch (error) {
        console.error('Fetch enquiries error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
