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
