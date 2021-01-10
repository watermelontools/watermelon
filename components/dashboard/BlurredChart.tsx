import Image from "next/image";
const BlurredChart = ({}) => (
  <div className="flex flex-wrap">
    {Array(6)
      .fill(0)
      .map((i, index) => (
        <div style={{ filter: "blur(4px)" }} key={index} className="m-1">
          <Image src={`/images/chart${index}.png`} width={500} height={300} />
        </div>
      ))}
  </div>
);

export default BlurredChart;
