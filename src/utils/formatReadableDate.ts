export function formatReadableDate(
  isoString: string,
  timeZone: string = "Asia/Ho_Chi_Minh",
) {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Dùng định dạng 24h
    timeZone, // Múi giờ mặc định là Việt Nam (UTC+7)
  };

  return date.toLocaleString("vi-VN", options).replace(/,/, " -");
}
