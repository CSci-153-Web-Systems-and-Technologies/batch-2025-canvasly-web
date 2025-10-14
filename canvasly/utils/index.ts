export const getFileTypeFromUrl = (url: string) => {
  if (url === null || url === undefined) return "unkown";

  const extension = url.split(".").pop();

  switch (extension) {
    case "jpeg":
    case "jpg":
    case "png":
    case "gif":
      return "image";
    case "mp4":
    case "avi":
    case "mov":
      return "video";
    default:
      return "unkown";
  }
};

export const updateQueryCacheLikes = (
  postsLikes,
  postId,
  userId,
  actionType
) => {
  if (actionType === "like") {
    return [...postsLikes, { authorId: userId, postId }];
  } else {
    return postsLikes.filter((like) => like.authorId !== userId);
  }
};
