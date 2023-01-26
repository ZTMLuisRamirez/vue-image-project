export default function useReader(
  file: File | null,
  handleLoad?: EventListener
) {
  const reader = new FileReader();

  if (file) reader.readAsDataURL(file);

  if (handleLoad) reader.addEventListener("load", handleLoad);

  return { reader };
}
