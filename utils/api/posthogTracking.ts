import posthog from "../posthog/posthog";

export function successPosthogTracking({ url, email, data }) {
  posthog.capture({
    distinctId: email,
    event: `${url}-success`,
    properties: data,
  });
}
export function failedPosthogTracking({ url, email, error }) {
  posthog.capture({
    distinctId: email,
    event: `${url}-failed`,
    properties: error,
  });
}
export function missingParamsPosthogTracking({ url, missingParams }) {
  posthog.capture({
    event: `${url}-missing-params`,
    properties: missingParams,
  });
}
export function unauthorizedPosthogTracking({ url, email, error }) {
  posthog.capture({
    distinctId: email,
    event: `${url}-unauthorized`,
    properties: error,
  });
}
