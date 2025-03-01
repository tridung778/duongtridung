export function convertLotteryResultsNorthSide(arrString: string) {
  const keys = ["G.DB", "G.1", "G.2", "G.3", "G.4", "G.5", "G.6", "G.7"];
  const arr = JSON.parse(arrString);

  const lotteryResults: { [key: string]: string[] } = {};
  arr.forEach((item: string, index: number) => {
    lotteryResults[keys[index]] = item.split(",");
  });

  return lotteryResults;
}

export function convertLotteryResultsSouthSide(arrString: string) {
  const keys = ["G.DB", "G.1", "G.2", "G.3", "G.4", "G.5", "G.6", "G.7", "G.8"];
  const arr = JSON.parse(arrString);

  const lotteryResults: { [key: string]: string[] } = {};
  arr.forEach((item: string, index: number) => {
    lotteryResults[keys[index]] = item.split(",");
  });

  return lotteryResults;
}
