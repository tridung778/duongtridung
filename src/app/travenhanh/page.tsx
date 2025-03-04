/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { getLotteryData } from "@/utils/fecht-lottery-api";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { mangDai } from "@/utils/mangDai";
import { Combobox } from "@/components/ui/combobox";
import Swal from "sweetalert2";
import {
  convertLotteryResultsNorthSide,
  convertLotteryResultsSouthSide,
} from "@/utils/convertLotteryResults";
import {
  findWinningPrizeNorthSide,
  findWinningPrizeSouthSide,
} from "@/utils/findWinningPrize";

interface LotteryResults {
  [key: string]: string[];
}

const TraVeNhanhPage = () => {
  const [data, setData] = useState<any>();
  const [value, setValue] = useState("miba");
  const [number, setNumber] = useState<string>("");

  useEffect(() => {
    getLotteryData(value).then((res) => {
      setData(res);
    });
  }, [value]);

  const handleSearch = useCallback(() => {
    if (!/^\d+$/.test(number)) {
      Swal.fire({
        title: "Vui lòng nhập đúng định dạng số",
        icon: "info",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (data && ["mb", "mn", "mt"].includes(data.t.navCate)) {
      const results = data.t.issueList.flatMap((item: any) => {
        let lotteryResults: LotteryResults = {};
        const prizes = [];
        if (data.t.navCate === "mb") {
          lotteryResults = convertLotteryResultsNorthSide(item.detail);
          prizes.push(...findWinningPrizeNorthSide(number, lotteryResults));
        }
        if (data.t.navCate === "mn" || data.t.navCate === "mt") {
          lotteryResults = convertLotteryResultsSouthSide(item.detail);
          prizes.push(...findWinningPrizeSouthSide(number, lotteryResults));
        }
        return prizes.length > 0
          ? prizes.map(
              (prize) =>
                `Số ${number} trúng giải ${prize} ngày ${item.turnNum} đài ${data.t.name}`,
            )
          : [];
      });

      Swal.fire({
        title: "Kết quả trúng thưởng",
        html:
          results.length > 0
            ? `<div style="text-align: left;">${results.join("<br>")}</div>`
            : `Số ${number} không trúng giải nào`,
        icon: results.length > 0 ? "success" : "info",
        confirmButtonText: "Đóng",
      });
    }
  }, [data, number]);

  return (
    <div>
      <div className="mx-5 flex h-96 flex-col items-center justify-center">
        <div className="text-4xl">Tra vé nhanh 🚀</div>
        <div>Một trang web giúp hỗ trợ tra cứu vé số nhanh hơn!</div>
        <div className="mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3">
          <Combobox datas={mangDai} setValue={setValue} value={value} />
          <Input
            type="text"
            onChange={(e) => setNumber(e.target.value)}
            className="w-[180px]"
          />
          <Button onClick={handleSearch} className="col-span-2 lg:col-span-1">
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TraVeNhanhPage;
