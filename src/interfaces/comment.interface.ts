export interface Comment {
    pk: number;
    uuid: string;
    
    comment: string;
    
    article_id: number;
    author_id: number;
    
    likes?: number;
    replies?: number;
}

export interface CommentLike {
    comment_id: number;
    user_id: number;
}

export interface CommentReply {
    pk: number;
    uuid: string;
    
    comment_id: number;
    author_id: number;
    
    reply: string;
    // likes?: number;
}

export interface CommentReplyLike {
    reply_id: number;
    user_id: number;
}

export interface CommentParsed {
    uuid: string;
    article_id: number;
    author_id: number;
    comment: string;
    replies: number;
    likes: number;
}

export interface CommentReplyParsed {
    uuid: string;
    reply: string;
    comment: {
        uuid: string;
        comment: string;
    },
    author: {
      uuid: string;
      full_name: string;
      avatar: string;
    },
    likes: number;
}