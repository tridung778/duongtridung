"use client";
import { getLotteryData } from "@/utils/fecht-lottery-api";
import { useEffect, useState } from "react";

const TraVeNhanhPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getLotteryData("miba").then((res) => {
      setData(res);
    });
  }, []);
  return (
    <div>
      {data && (
        <div>
          <h2>Dữ liệu từ API:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TraVeNhanhPage;
