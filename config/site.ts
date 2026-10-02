export type SiteConfig = {
  name: string;
  nameMl: string;
  tagline: string;
  description: string;
  url: string;
  links: {
    spotify: string;
    ytMusic: string;
  };
  onboardLabel: string;
  lastStopLabel: string;
  lastStopMessage: string;
  timeZone: string;
  routes: string[];
  radioMode: boolean;
};

export const siteConfig: SiteConfig = {
  name: "Ordinary",
  nameMl: "ഓർഡിനറി",
  tagline: "The sound of a Kerala private bus.",
  description:
    "Take a seat on an old Kerala town bus and ride along to the Malayalam songs that play through its speakers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  links: {
    spotify: "https://open.spotify.com/playlist/4TCIOtGVnhVf6qtb0kPwTF",
    ytMusic: "https://music.youtube.com/playlist?list=PLkX31-lqoSPdV5dI4SQPTYxxlwRiSOLzD",
  },
  onboardLabel: "onboard",
  lastStopLabel: "അവസാന സ്റ്റോപ്പ് ടൈമർ",
  lastStopMessage: "ലാസ്റ്റ് സ്റ്റോപ്പ്. കൂടെ യാത്ര ചെയ്തതിന് നന്ദി.",
  timeZone: "Asia/Kolkata",
  routes: [
    "Thrissur",
    "Guruvayur",
    "Kunnamkulam",
    "Chavakkad",
    "Irinjalakuda",
    "Kodungallur",
  ],
  radioMode: false,
};
