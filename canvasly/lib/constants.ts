export const navItems = [
  { name: "Home", href: "/" },
  { name: "Illustrations", href: "/" },
  { name: "Artists", href: "/" },
  { name: "Works", href: "/" },
  { name: "Purchase", href: "/" },
  { name: "Request", href: "/" },
];

export interface PostInput {
  title: string;
  image_post_url: string;
  post_description?: string | null;
  art_type: string;
  price?: number | null;
  cld_id?: string | null;
}
