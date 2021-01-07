import Image from "next/image";
const BlurredChart = ({}) => (
  <div>
    <div style={{ filter: "blur(5px)" }} className="grid grid-cols-1">
      <p className="row-start-2">Coming soon</p>
      <Image
        src="/images/chart1.png"
        width={500}
        height={300}
        className="col-span-full row-span-full row-start-1"
      />
    </div>
    <div style={{ filter: "blur(5px)" }}>
      <Image src="/images/chart2.png" width={500} height={300} />
    </div>
  </div>
);

export default BlurredChart;
