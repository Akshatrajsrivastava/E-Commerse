import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/models/Orders'; // Import Order model
import Enquiry from '@/models/Enquiry'; // Import Enquiry model to link with orders
import Product from '@/models/Products'; // Import Product model to link with order items

// Helper function to generate a random order number
function generateOrderNumber() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase letter (a-z)
    return `${randomNumber}${randomChar}`;
}

// Create Order
export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        // Parse form data
        const formData = await request.formData();

        const orderNumber = generateOrderNumber(); // Generate random order number
        const enquiryId = formData.get('enquiryId') as string;  // Reference to Enquiry
        const items = JSON.parse(formData.get('items') as string); // Parse items (array of productId and quantity)
        const totalAmount = parseFloat(formData.get('totalAmount') as string);
        const status = formData.get('status') as string;

        // Validate required fields
        if (!enquiryId || !items || !totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate enquiryId
        const enquiry = await Enquiry.findById(enquiryId);
        if (!enquiry) {
            return NextResponse.json(
                { error: 'Enquiry not found' },
                { status: 400 }
            );
        }

        // Validate product IDs in items
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { error: `Product with ID ${item.productId} not found` },
                    { status: 400 }
                );
            }
        }

        // Create new Order
        const newOrder = new Order({
            orderNumber, // Set generated order number
            enquiryId, // Reference to the Enquiry
            items,
            totalAmount,
            status: status || 'pending',  // Default to 'pending' if no status provided
            datePlaced: new Date()
        });

        // Save the order
        await newOrder.save();

        return NextResponse.json(
            { message: 'Order created successfully', order: newOrder },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get All Orders
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Fetch all orders
        const orders = await Order.find()
            .populate('enquiryId')  // Populate the Enquiry data
            .populate('items.productId') // Populate the product details for each item in the order
            .populate('items.productId.categoryId'); // Populate the product details for each item in the order

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
