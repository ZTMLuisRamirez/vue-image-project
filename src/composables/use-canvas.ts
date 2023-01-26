import { ref } from "vue";
import { open_image, filter, putImageData } from "@silvia-odwyer/photon";

export default function useCanvas() {
  const canvasEl = ref<HTMLCanvasElement | null>(null);
  let canvasCtx: CanvasRenderingContext2D | null = null;
  const imgEl = new Image();
  const canvasImgURL = ref("");

  function calculateAspectRatio(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight, srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  function loadImage(url: string) {
    if (!canvasEl.value) return;

    canvasCtx = canvasEl.value.getContext("2d");

    imgEl.addEventListener("load", drawOriginalImage);

    imgEl.src = url;
  }

  function drawOriginalImage() {
    if (!canvasCtx || !canvasEl.value) return;

    const newImgDimension = calculateAspectRatio(
      imgEl.naturalWidth,
      imgEl.naturalHeight,
      448,
      448
    );

    canvasEl.value.width = newImgDimension.width;
    canvasEl.value.height = newImgDimension.height;

    canvasCtx.drawImage(
      imgEl,
      0,
      0,
      newImgDimension.width,
      newImgDimension.height
    );

    canvasImgURL.value = canvasEl.value.toDataURL();
  }

  function filterImage(filterName: string) {
    if (!canvasCtx || !canvasEl.value) return;

    const photonImage = open_image(canvasEl.value, canvasCtx);

    if (filterName.length) {
      filter(photonImage, filterName);
    }

    putImageData(canvasEl.value, canvasCtx, photonImage);

    canvasImgURL.value = canvasEl.value.toDataURL();
  }

  return {
    canvasEl,
    loadImage,
    drawOriginalImage,
    filterImage,
    canvasImgURL,
  };
}
