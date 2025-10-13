import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding database...");

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: "mayi-id-001",
      username: "Mayi",
      email_address: "mayi@prisma.io",
      image_url: "https://example.com/avatar.jpg",
      description: "I'm so pretttyyyyy",

      // Create posts for the user
      posts: {
        create: [
          {
            title: "Follow Prisma on Twitter",
            art_type: "Digital Art",
            post_description:
              "A colorful digital art piece inspired by modern design.",
            image_post_url: "https://example.com/image1.jpg",
            price: 29.99,

            // Create related likes, comments, and trends
            likes: {
              create: [
                {
                  author: {
                    create: {
                      id: "liker-id-001",
                      username: "ArtFan",
                      email_address: "artfan@example.com",
                      description: "I love digital art!",
                    },
                  },
                },
              ],
            },

            comments: {
              create: [
                {
                  comment: "This is absolutely stunning!",
                  author: {
                    create: {
                      id: "commenter-id-001",
                      username: "CommenterJane",
                      email_address: "jane@example.com",
                      description: "Art critic and admirer.",
                    },
                  },
                },
              ],
            },

            trends: {
              create: [
                {
                  name: "Digital Illustration",
                },
                {
                  name: "Colorful Style",
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      posts: {
        include: {
          likes: true,
          comments: true,
          trends: true,
        },
      },
    },
  });

  console.log("Seed complete:");
  console.dir(user, { depth: null });
}

main()
  .catch((e) => {
    console.error(" Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
  
  import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "Mayi",
    id: "M,yi@prisma.io",
    description: "Im so pretttyyyyy",
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
*/

/*

import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding database...");

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: "mayi-id-001",
      username: "Mayi",
      email_address: "mayi@prisma.io",
      image_url: "https://example.com/avatar.jpg",
      description: "I'm so pretttyyyyy",

      // Create posts for the user
      posts: {
        create: [
          {
            title: "Follow Prisma on Twitter",
            art_type: "Digital Art",
            post_description:
              "A colorful digital art piece inspired by modern design.",
            image_post_url: "https://example.com/image1.jpg",
            price: 29.99,

            // Create related likes, comments, and trends
            likes: {
              create: [
                {
                  author: {
                    create: {
                      id: "liker-id-001",
                      username: "ArtFan",
                      email_address: "artfan@example.com",
                      description: "I love digital art!",
                    },
                  },
                },
              ],
            },

            comments: {
              create: [
                {
                  comment: "This is absolutely stunning!",
                  author: {
                    create: {
                      id: "commenter-id-001",
                      username: "CommenterJane",
                      email_address: "jane@example.com",
                      description: "Art critic and admirer.",
                    },
                  },
                },
              ],
            },

            trends: {
              create: [
                {
                  name: "Digital Illustration",
                },
                {
                  name: "Colorful Style",
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      posts: {
        include: {
          likes: true,
          comments: true,
          trends: true,
        },
      },
    },
  });

  console.log("Seed complete:");
  console.dir(user, { depth: null });
}

main()
  .catch((e) => {
    console.error(" Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


*/
