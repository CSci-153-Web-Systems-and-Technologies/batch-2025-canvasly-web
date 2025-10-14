export interface SupabaseUser {
  id: string;
  image_url: string;
  username: string;
  description: string;
  email_addresses?: {
    email_address: string;
  }[];
}

export type CreateUserInput = {
  id: string;
  image_url?: string | null;
  username?: string | null;
  description?: string | null;
  email?: string | null;
};

export type SupabaseEventType =
  | "user.created"
  | "user.updated"
  | "user.deleted";

export interface SupabaseWebhookEvent {
  type: SupabaseEventType;
  data: SupabaseUser;
}
