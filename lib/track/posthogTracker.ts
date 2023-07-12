import "server-only";

import { PostHog } from "posthog-node";

export default function PostHogTracker() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  });
  return posthogClient;
}
