import { getSrcPath } from "../getSrcPath";

export const getPublicUploadsPath = () => {
  const srcPath = getSrcPath();

  return srcPath + "/../public/uploads/";
};
