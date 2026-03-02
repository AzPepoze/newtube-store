import { and, eq, like, or, sql } from 'drizzle-orm';
import { themes } from './schema';
import type { Database } from './index';

type ThemeSort = 'popular' | 'newest' | 'alpha';

const sortColumns: Record<ThemeSort, ReturnType<typeof sql>> = {
    popular: sql`${themes.downloads} DESC`,
    newest: sql`${themes.createdAt} DESC`,
    alpha: sql`${themes.name} ASC`,
};

export function searchThemes(db: Database, search: string, sort: ThemeSort = 'popular') {
    const pattern = `%${search}%`;
    return db
        .select()
        .from(themes)
        .where(and(
            eq(themes.isPublic, true),
            or(like(themes.name, pattern), like(themes.description, pattern))
        ))
        .orderBy(sortColumns[sort] ?? sortColumns.popular)
        .all();
}

export function getThemeById(db: Database, id: string) {
    return db.query.themes.findFirst({
        where: eq(themes.id, id),
        with: { owner: { columns: { name: true, avatarUrl: true } } },
    });
}

export function getThemesByOwner(db: Database, ownerId: string) {
    return db.select().from(themes).where(eq(themes.ownerId, ownerId)).all();
}

export function createTheme(db: Database, ownerId: string, data: {
    name: string;
    description?: string;
    imgs?: unknown[];
    settings?: unknown;
    customStyleshiftItems?: unknown[];
}) {
    const id = crypto.randomUUID();
    return db.insert(themes).values({
        id,
        ownerId,
        name: data.name,
        description: data.description,
        images: JSON.stringify(data.imgs ?? []),
        settings: JSON.stringify(data.settings ?? {}),
        customStyleshift: JSON.stringify(data.customStyleshiftItems ?? []),
    }).returning({ id: themes.id }).get();
}

export async function updateTheme(db: Database, id: string, ownerId: string, data: {
    name: string;
    description?: string;
    imgs?: unknown[];
    settings?: unknown;
    customStyleshiftItems?: unknown[];
}) {
    const result = await db
        .update(themes)
        .set({
            name: data.name,
            description: data.description,
            images: JSON.stringify(data.imgs ?? []),
            settings: JSON.stringify(data.settings ?? {}),
            customStyleshift: JSON.stringify(data.customStyleshiftItems ?? []),
        })
        .where(and(eq(themes.id, id), eq(themes.ownerId, ownerId)))
        .run();

    return result.meta.changes > 0;
}

export async function deleteTheme(db: Database, id: string, ownerId: string) {
    const result = await db
        .delete(themes)
        .where(and(eq(themes.id, id), eq(themes.ownerId, ownerId)))
        .run();

    return result.meta.changes > 0;
}
