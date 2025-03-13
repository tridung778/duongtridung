export function hasZeroBeforeUnitDigit(filename: string): boolean {
  // Lấy phần số từ tên file (loại bỏ phần mở rộng .jpg)
  const numberPart = filename.replace(".jpg", "");

  // Kiểm tra có ít nhất 2 số 0 liên tiếp trong chuỗi số
  return /00/.test(numberPart);
}
