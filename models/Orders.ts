import mongoose, { Document, Schema, Types } from 'mongoose';


export interface IOrder extends Document {
    orderNumber: string;
    enquiryId: Types.ObjectId; // Reference to the Enquiry
    items: { productId: Types.ObjectId, quantity: number }[]; // Array of products in the order
    totalAmount: number; // The total amount of the order
    status: string; // e.g. 'pending', 'completed', 'shipped'
    datePlaced: Date;
}

const orderSchema: Schema<IOrder> = new Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    enquiryId: {
        type: Schema.Types.ObjectId,
        ref: 'Enquiry', // Reference to the Enquiry model
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered',],
        default: 'pending'
    },
    datePlaced: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Optionally populate the enquiry data when querying the order
orderSchema.pre('find', function () {
    this.populate('enquiryId'); // Populate the enquiry data when finding orders
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
