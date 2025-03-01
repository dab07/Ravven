export type Post = {
    _id: string;
    title: string;
    summary?: string;
    content?: string;
    image?: string;
    author?: {
        username: string;
    };
    createdAt?: string;
};
