import axios from "axios";

export const getLotteryData = async (code: string) => {
  const res = await axios.get(
    `https://xoso188.net/api/front/open/lottery/history/list/5/${code}`
  );
  return res.data;
};
