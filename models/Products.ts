import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    price: number;
    discountedPrice: number;
    description: string;
    images: string[];
    category: Types.ObjectId;
    createdAt: Date;
}

const productSchema: Schema<IProduct> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Product title cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
        set: (v: number) => Math.round(v * 100) / 100 // Ensures 2 decimal places
    },
    discountedPrice: {
        type: Number,
        required: true,
        min: [0, 'Discounted price cannot be negative'],
        validate: {
            validator: function (this: IProduct, value: number) {
                return !value || value < this.price;
            },
            message: 'Discounted price must be less than the original price'
        }
    },
    description: {
        type: String,
        required: true,
        // Optimized for React Markdown
        maxlength: [10000, 'Description cannot exceed 10000 characters']
    },
    images: {
        type: [String],
        validate: {
            validator: function (v: string[]) {
                return v.length <= 4;
            },
            message: 'You can upload a maximum of 4 images'
        },
        default: []
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Adds updatedAt field automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Optional: Add a virtual to check if product is on discount
productSchema.virtual('isDiscounted').get(function (this: IProduct) {
    return this.discountedPrice && this.discountedPrice < this.price;
});

// Optional: Compound index for performance
productSchema.index({ category: 1, createdAt: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);