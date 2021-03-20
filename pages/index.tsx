import BlurredChart from "../components/dashboard/BlurredChart";
import PagePadder from "../components/PagePadder";

function HomePage() {
  return (
    <PagePadder>
      <h1>Welcome to Watermelon🍉!</h1>
      <p>
        Watermelon is the best way to connect your coworkers through shared
        interests.
      </p>
      <h2>Connections (coming soon)</h2>
      <p>Understand your workspace</p>
      <BlurredChart />
    </PagePadder>
  );
}

export default HomePage;
