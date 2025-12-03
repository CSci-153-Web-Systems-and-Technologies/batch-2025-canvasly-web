export const navItems = [
  { name: "Home", href: "/" },
  { name: "Following", href: "/following" },
  { name: "Artists", href: "/artists" },
  { name: "Purchase", href: "/purchase" },
  { name: "Request", href: "/" },
];

export const pageTabs = [
  { name: "Profile" },
  { name: "Followers" },
  { name: "Followings" },
];

export interface PostInput {
  title: string;
  image_post_url: string;
  post_description?: string | null;
  art_type: string;
  price?: number | null;
  cld_id?: string | null;
}
