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
import { Train, Search, Ticket } from "lucide-react";
import Sidebar from "@/components/Sidebar";

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

  const TraVeNhanhContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Train className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Tra Vé Nhanh
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Hỗ trợ tra cứu vé số nhanh chóng và chính xác
          </p>
        </div>

        {/* Main Content */}
        <div className="rounded-lg border-0 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
          <div className="mx-auto max-w-2xl">
            {/* Search Form */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Ticket className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tra Cứu Vé Số
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Chọn đài và nhập số vé để kiểm tra kết quả
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Chọn Đài
                  </label>
                  <Combobox datas={mangDai} setValue={setValue} value={value} />
                </div>

                <div className="md:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Số Vé
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập số vé..."
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-end md:col-span-1">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    size="lg"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Tìm Kiếm
                  </Button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Hướng Dẫn Sử Dụng:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Chọn đài xổ số bạn muốn tra cứu</li>
                <li>• Nhập số vé cần kiểm tra</li>
                <li>• Nhấn &quot;Tìm Kiếm&quot; để xem kết quả</li>
                <li>• Hệ thống sẽ hiển thị tất cả giải thưởng trúng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <TraVeNhanhContent />
    </Sidebar>
  );
};

export default TraVeNhanhPage;
