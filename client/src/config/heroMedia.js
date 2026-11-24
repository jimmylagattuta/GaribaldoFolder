
const CLOUDINARY =
  "https://res.cloudinary.com/djtsuktwb/video/upload";

const DESKTOP_ASSET =
  "v1795295619/Nursury2k_2_w1as7t";

const MOBILE_ASSET =
  "v1795295565/Garidalbis_Nursery_Portrait_Smooth_1080x1920_gutoem";

// Desktop poster: responsive, automatically compressed
const desktopPoster = (width) =>
  `${CLOUDINARY}/so_2,w_${width},c_limit,f_auto,q_auto/${DESKTOP_ASSET}.jpg`;

// Mobile poster: stronger compression and capped at 720px
const mobilePoster = (width) =>
  `${CLOUDINARY}/so_2,w_${width},c_limit,f_auto,q_60/${MOBILE_ASSET}.jpg`;

export const heroMedia = {
  desktop: {
    video:
      `${CLOUDINARY}/w_1920,c_limit,q_auto,f_mp4/${DESKTOP_ASSET}.mp4`,

    poster: desktopPoster(1600),

    posterSrcSet: [
      `${desktopPoster(960)} 960w`,
      `${desktopPoster(1600)} 1600w`,
      `${desktopPoster(1920)} 1920w`,
    ].join(", "),

    posterSizes: "100vw",
  },

  mobile: {
    // Reduced bandwidth using Cloudinary's eco quality preset
    video:
      `${CLOUDINARY}/w_720,c_limit,q_auto:eco,f_mp4/${MOBILE_ASSET}.mp4`,

    poster: mobilePoster(720),

    posterSrcSet: [
      `${mobilePoster(480)} 480w`,
      `${mobilePoster(720)} 720w`,
    ].join(", "),

    posterSizes: "100vw",
  },
};
