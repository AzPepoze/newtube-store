import { Elysia } from 'elysia';
import { env } from 'cloudflare:workers';
import { searchThemes, getThemeById, createTheme, updateTheme, deleteTheme } from '../db/themes';
import { contextPlugin } from '../plugins/context';
import { authGuard } from '../plugins/auth-guard';

export const themeRoute = new Elysia({ prefix: '/themes' })
    .use(contextPlugin)
    .get('/', async ({ query, db }) => {
        return searchThemes(db, query.q || '', query.sort as any || 'popular');
    })
    .get('/:id', async ({ params, set, db }) => {
        const theme = await getThemeById(db, params.id);
        if (!theme) {
            set.status = 404;
            return 'Not Found';
        }
        return theme;
    })
    .use(authGuard)
    .post('/', async ({ userId, body, db, set }) => {
        const { success } = await env.THEME_RATE_LIMITER.limit({ key: userId! });
        if (!success) {
            set.status = 429;
            return 'Too many themes created. Try again later.';
        }
        return createTheme(db, userId!, body as any);
    })
    .put('/:id', async ({ userId, params, body, set, db }) => {
        const updated = await updateTheme(db, params.id, userId!, body as any);
        if (!updated) {
            set.status = 403;
            return 'Theme not found or Unauthorized';
        }
        set.status = 204;
    })
    .delete('/:id', async ({ userId, params, set, db }) => {
        const deleted = await deleteTheme(db, params.id, userId!);
        if (!deleted) {
            set.status = 403;
            return 'Theme not found or Unauthorized';
        }
        set.status = 204;
    });
