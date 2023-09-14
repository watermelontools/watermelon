import { PostHog } from "posthog-node";
interface PostHogEvent {
  event: string;
  distinctId?: string;
  properties?: Record<string, any>;
  groups?: Record<string, any>;
}
function PostHogClient(apiKey: string) {
  if (!apiKey) return { capture: () => {} };
  const posthogClient = new PostHog(apiKey, {
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
      console.log("posthog event", event, properties);
      if (process.env.NODE_ENV === "development") {
        console.log(
          `PostHog event: ${event} with properties: ${JSON.stringify(
            properties
          )}`
        );
      }
    },
  };
}

const posthog = PostHogClient(process.env.NEXT_PUBLIC_POSTHOG_KEY!);

export default posthog;
