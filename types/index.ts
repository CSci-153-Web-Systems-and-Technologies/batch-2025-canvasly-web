export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export interface CommentType {
  id: number;
  comment?: string;
  authorId: string;
  postId: number;
  createdAt: string; // JSON converts DateTime to string
}

export interface PostType {
  id: number;
  title: string;
  image_post_url: string;
  price?: number;
  post_description?: string;
  authorId: string;
  comments: CommentType[];
  createdAt: string;
}

export type NotificationTypeEnum =
  | "FOLLOW"
  | "LIKE"
  | "COMMENT"
  | "PURCHASE_REQUEST"
  | "PURCHASE_ACCEPTED"
  | "PURCHASE_REJECTED";

export interface NotificationType {
  id: number;
  message: string;
  type: NotificationTypeEnum;
  read: boolean;
  createdAt: string;
  userId: string;
  fromUserId?: string;
  postId?: number;
  purchaseId?: number;
}

export interface PostInput {
  title: string;
  image_post_url: string;
  post_description?: string | null;
  art_type: string;
  price?: number | null;
  cld_id?: string | null;
}

export interface UserType {
  id: string;
  username: string | null;
  email: string | null;
  image_url: string | null;
  image_id: string | null;
  description: string | null;
}
