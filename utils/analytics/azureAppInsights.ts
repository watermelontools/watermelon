const appInsights = require("applicationinsights");
const instrumentationKey =
  "InstrumentationKey=bb2eac7f-33dd-426c-92c5-4dd922b2befb;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/";

appInsights
  .setup(instrumentationKey)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .start();
let client = appInsights.defaultClient;
export function trackEvent({ name, properties }) {
  client.trackEvent({ name, properties });
}
