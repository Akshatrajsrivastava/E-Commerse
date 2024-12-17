import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
    bannerType: 'main' | 'secondary1' | 'secondary2';
    bannerUrl: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const bannerSchema: Schema<IBanner> = new Schema(
    {
        bannerType: {
            type: String,
            required: true,
            enum: ['main', 'secondary1', 'secondary2']
        },
        bannerUrl: {
            type: String,
            required: true,
            trim: true,
            match: [
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                'Please provide a valid URL',
            ],
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

// Ensure only one active banner per type
bannerSchema.index({ bannerType: 1 }, { unique: true });

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);