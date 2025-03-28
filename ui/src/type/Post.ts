export type Post = {
    _id: string;
    title: string;
    summary: string;
    content: string;
    image?: string;
    author: {
        username: string;
        _id: string;
    };
    likes?: number;
    comments?: Comment[];
    createdAt: string;
    updatedAt: string;
};

export type Comment = {
    _id?: string;
    content: string;
    author?: {
        _id?: string;
        username: string;
    } | null;
    createdAt: string;
}
