import { getOptimizedImage } from "@/lib/utils/imageUtils";

export default function loadBackgroundImages() {
  const backgroundImages = document.querySelectorAll("[data-background]");

  if (backgroundImages.length > 0) {
    backgroundImages.forEach((element) => {
      if (element instanceof HTMLElement) {
        const image = element.dataset.background;
        if (image) {
          // Pass a large width for background images by default
          const optimizedImage = getOptimizedImage(image, 1920);
          element.style.backgroundImage = `url('${optimizedImage}')`;
        }
      }
    });
  }
}
