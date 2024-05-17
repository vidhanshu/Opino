import { ExpoRouter } from "expo-router/types/expo-router";

export function clearHistoryAndRoute(
  router: ExpoRouter.Router,
  newPath: string
) {
  while (router.canGoBack()) {
    // Pop from stack until one element is left
    router.back();
  }
  router.replace(newPath);
}
