export const findWinningPrizeSouthSide = (
  number: string,
  lotteryResults: LotteryResults
): string[] => {
  if (!lotteryResults || typeof lotteryResults !== "object") {
    console.error("Invalid lottery results format:", lotteryResults);
    return [];
  }

  const results: string[] = [];
  const specialPrize = lotteryResults["G.DB"]?.[0];

  const checkPrize = (category: string, length: number): void => {
    if (
      lotteryResults[category]?.some((n) => n.endsWith(number.slice(-length)))
    ) {
      results.push(category);
    }
  };

  checkPrize("G.8", 2); // Giải 8
  checkPrize("G.7", 3); // Giải 7
  checkPrize("G.6", 4); // Giải 6
  checkPrize("G.5", 4); // Giải 5
  checkPrize("G.4", 5); // Giải 4
  checkPrize("G.3", 5); // Giải 3
  checkPrize("G.2", 5); // Giải nhì
  checkPrize("G.1", 5); // Giải nhất

  if (specialPrize === number) {
    results.push("G.DB"); // Giải đặc biệt
  } else if (specialPrize?.slice(-5) === number.slice(-5)) {
    results.push("G.PhuDB"); // Giải phụ đặc biệt
  } else {
    const diffCount = Array.from(specialPrize || "").filter(
      (digit, i) => digit !== number[i]
    ).length;
    if (diffCount === 1) results.push("G.KhuyenKhich"); // Giải khuyến khích
  }

  return results;
};

interface LotteryResults {
  [key: string]: string[];
}

interface CheckPrizeFunction {
  (category: string, length: number, count: number): void;
}

export const findWinningPrizeNorthSide = (
  number: string,
  lotteryResults: LotteryResults
): string[] => {
  if (!lotteryResults || typeof lotteryResults !== "object") {
    console.error("Invalid lottery results format:", lotteryResults);
    return [];
  }

  const results: string[] = [];
  const specialPrize = lotteryResults["G.DB"]?.[0];

  const checkPrize: CheckPrizeFunction = (category, length, count) => {
    if (
      lotteryResults[category]
        ?.slice(0, count)
        .some((n) => n.endsWith(number.slice(-length)))
    ) {
      results.push(category);
    }
  };

  checkPrize("G.7", 2, 4); // Giải 7
  checkPrize("G.6", 3, 3); // Giải 6
  checkPrize("G.5", 4, 6); // Giải 5
  checkPrize("G.4", 4, 4); // Giải 4
  checkPrize("G.3", 5, 6); // Giải 3
  checkPrize("G.2", 5, 2); // Giải nhì
  checkPrize("G.1", 5, 1); // Giải nhất

  if (specialPrize === number) {
    results.push("G.DB"); // Giải đặc biệt
  } else if (specialPrize?.slice(-4) === number.slice(-4)) {
    results.push("G.PhuDB"); // Giải phụ đặc biệt
  } else {
    const diffCount = Array.from(specialPrize || "").filter(
      (digit, i) => digit !== number[i]
    ).length;
    if (diffCount === 1) results.push("G.KhuyenKhich"); // Giải khuyến khích
  }

  return results;
};
