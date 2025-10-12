import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "Mayi",
    id: "M,yi@prisma.io",
    description: "Im an nig",
    email_address: "mayi@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          description: "asd",
          art_type: "Digital Art",
          image_post_url: "https://example.com/image1.jpg",
          price: 29.99,
          published: true,
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
