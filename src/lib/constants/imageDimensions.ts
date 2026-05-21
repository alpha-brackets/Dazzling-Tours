export enum ImageVariant {
  HERO = "hero",
  CARD = "card",
  THUMBNAIL = "thumbnail",
  AVATAR = "avatar",
}

export const IMAGE_DIMENSIONS = {
  [ImageVariant.HERO]: { width: 1920, height: 1080, label: "1920x1080 (16:9)" },
  [ImageVariant.CARD]: { width: 800, height: 600, label: "800x600 (4:3)" },
  [ImageVariant.THUMBNAIL]: { width: 400, height: 400, label: "400x400 (1:1)" },
  [ImageVariant.AVATAR]: { width: 400, height: 400, label: "400x400 (1:1)" },
};
