export interface Theme {
    id: string;
    owner_id: string;
    name: string;
    description: string;
    images: string[];
    settings: any;
    custom_styleshift?: any[];
    downloads: number;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
    created_at?: string;
}
