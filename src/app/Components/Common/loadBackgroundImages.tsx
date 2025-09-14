export default function loadBackgroundImages() {
  const backgroundImages = document.querySelectorAll("[data-background]");

  if (backgroundImages.length > 0) {
    backgroundImages.forEach((element) => {
      if (element instanceof HTMLElement) {
        const image = element.dataset.background;
        if (image) {
          element.style.backgroundImage = `url('${image}')`;
        }
      }
    });
  }
}
