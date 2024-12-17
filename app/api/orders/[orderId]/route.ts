// // app/api/orders/[orderId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import connectMongo from '@/lib/mongodb';
// import Order from '@/models/Orders';

// export async function PUT(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
//     try {
//         await connectMongo();

//         const { orderId } = await params;

//         if (!orderId) {
//             return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
//         }

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//         }

//         if (order.status === 'delivered') {
//             return NextResponse.json({ message: 'Order is already delivered' }, { status: 400 });
//         }

//         order.status = 'delivered';
//         await order.save();

//         return NextResponse.json({ message: 'Order status updated to delivered', order }, { status: 200 });

//     } catch (error) {
//         console.error('Error updating order status:', error);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }







// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/models/Orders';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectMongo();

        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'delivered') {
            return NextResponse.json({ message: 'Order is already delivered' }, { status: 400 });
        }

        order.status = 'delivered';
        await order.save();

        return NextResponse.json({ message: 'Order status updated to delivered', order }, { status: 200 });

    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectMongo();

        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        await Order.findByIdAndDelete(orderId);

        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
