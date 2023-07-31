"use client";
import { useEffect, useState } from "react";

export default function TimeToRedirect({ url }) {
  const [timeToRedirect, setTimeToRedirect] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect(timeToRedirect - 1);
      if (timeToRedirect === 0) window.location.href = url;
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToRedirect]);
  return (
    <div>
      {timeToRedirect > 0 ? (
        <p>We will try opening it in {timeToRedirect}...</p>
      ) : null}
    </div>
  );
}
