import mongoose, { Document, Schema, Types } from 'mongoose';
import { IProduct } from '@/models/Products'; // Assuming the Product model is in the same directory

export interface IEnquiry extends Document {
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
    date: Date;
    productId: Types.ObjectId; // Reference to the Product
    status: 'accepted' | 'rejected' |'none'; // This matches the 'status' field in the schema
}

const enquirySchema: Schema<IEnquiry> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
    },
    address: {
        type: String,
        maxlength: [700, 'Address cannot exceed 700 characters'],
        default: ''  // Default value as empty string
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected','none'], // Enum for the status field
        default:'none',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', enquirySchema);
