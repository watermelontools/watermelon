import { PostHog } from "posthog-node";
interface PostHogEvent {
  event: string;
  distinctId?: string;
  properties?: Record<string, any>;
  groups?: Record<string, any>;
}

function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  return {
    capture: ({ event, distinctId, properties, groups }: PostHogEvent) => {
      posthogClient.capture({
        distinctId: distinctId || "unknown_user",
        event,
        properties,
        groups,
      });
    },
  };
}

const posthog = PostHogClient();

export default posthog;
