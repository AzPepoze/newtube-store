import { Elysia } from 'elysia';
import { env } from 'cloudflare:workers';
import { authGuard } from '../plugins/auth-guard';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const imageRoute = new Elysia({ prefix: '/images' })
    .use(authGuard)
    .post('/upload', async ({ userId, request, set }) => {
        const { success } = await env.UPLOAD_RATE_LIMITER.limit({ key: userId! });
        if (!success) {
            set.status = 429;
            return 'Too many uploads. Try again later.';
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file || !file.type.startsWith('image/')) {
            set.status = 400;
            return 'Invalid file. Must be an image.';
        }

        if (file.size > MAX_FILE_SIZE) {
            set.status = 413;
            return 'File too large. Maximum size is 5MB.';
        }

        const extension = file.type.split('/')[1] ?? 'webp';
        const objectKey = `${crypto.randomUUID()}.${extension}`;

        await env.IMAGES.put(objectKey, file.stream(), {
            httpMetadata: { contentType: file.type },
        });

        const publicUrl = `${env.R2_PUBLIC_URL}/${objectKey}`;

        return { url: publicUrl };
    });
