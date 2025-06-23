import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'walmart/customerQuery',
                    resource_type: file.type.startsWith('video') ? 'video' : 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url,
        });
    } catch (error) {
        return NextResponse.json(
            { error: `Upload failed: ${error}` },
            { status: 500 }
        );
    }
}