export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/dazzlingtoursofficial/",
    iconName: "instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/dazzlingtourscompany/",
    iconName: "facebook",
  },
  // {
  //   id: "tiktok",
  //   name: "TikTok",
  //   url: "https://www.tiktok.com",
  //   iconName: "tiktok",
  // },
  // {
  //   id: "youtube",
  //   name: "YouTube",
  //   url: "https://www.youtube.com",
  //   iconName: "youtube",
  // },
  // {
  //   id: "twitter",
  //   name: "Twitter",
  //   url: "https://twitter.com",
  //   iconName: "twitter",
  // },
  // {
  //   id: "linkedin",
  //   name: "LinkedIn",
  //   url: "https://linkedin.com",
  //   iconName: "linkedin",
  // },
];
