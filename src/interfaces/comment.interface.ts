/**
 * Interfaces for comments, replies, likes, and parsed comment structures.
 * Used to define the structure of comment data and related operations in the application.
 */
export interface Comment {
    pk: number;           // Primary key for the comment
    uuid: string;         // Unique identifier for the comment
    comment: string;      // Comment text
    article_id: number;   // Associated article's primary key
    author_id: number;    // Author's user ID
    likes?: number;       // Optional number of likes
    replies?: number;     // Optional number of replies
}

/**
 * Like entity for a comment.
 * - comment_id: Comment's primary key
 * - user_id: User's primary key
 */
export interface CommentLike {
    comment_id: number;
    user_id: number;
}

/**
 * Reply entity for a comment.
 * - pk: Primary key
 * - uuid: Unique identifier
 * - comment_id: Associated comment's primary key
 * - author_id: Author's user ID
 * - reply: Reply text
 * - likes: Optional number of likes
 */
export interface CommentReply {
    pk: number;
    uuid: string;
    comment_id: number;
    author_id: number;
    reply: string;
    likes?: number;
}

/**
 * Like entity for a comment reply.
 * - reply_id: Reply's primary key
 * - user_id: User's primary key
 */
export interface CommentReplyLike {
    reply_id: number;
    user_id: number;
}

/**
 * Parsed comment structure for API responses.
 * - uuid, comment: Comment details
 * - article: Object with uuid and title
 * - author: Object with uuid, full_name, avatar
 * - replies, likes: Counts
 */
export interface CommentParsed {
    uuid: string;
    comment: string;

    article: {
        uuid: string;
        title: string;
    },
    author: {
        uuid: string;
        full_name: string;
        avatar: string;
    },

    replies: number;
    likes: number;
}

/**
 * Parsed reply structure for API responses.
 * - uuid, reply: Reply details
 * - comment: Object with uuid and comment text
 * - author: Object with uuid, full_name, avatar
 * - likes: Count
 */
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