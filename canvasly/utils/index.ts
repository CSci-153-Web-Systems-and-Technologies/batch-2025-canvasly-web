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

export const checkPostForTrends = (post_description) => {
  if (post_description === null) {
    return null;
  } else if (post_description === undefined) {
    return null;
  }

  const firstSplit = post_description
    .trim()
    .split(/\s+/)
    .filter((word) => word.startsWith("#"))
    .map((word) => word.toLocaleLowerCase());

  let res = firstSplit;

  firstSplit.map((word) => {
    const secondSplit = word.split("#");
    if (secondSplit.length > 1) {
      res = [...res, ...secondSplit.slice(1, secondSplit.length)].filter(
        (el) => el !== word
      );
    }
  });

  res = [...new Set(res)];
  return res;
};
