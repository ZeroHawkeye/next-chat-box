import { createRouter, createRootRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import App from "@/App";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/pages/index")),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: lazyRouteComponent(() => import("@/pages/chat")),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: lazyRouteComponent(() => import("@/pages/settings")),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
