"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  Scale,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState("");

  const calculateBMI = (
    weight: number,
    height: number,
    unit: string,
  ): number => {
    if (unit === "metric") {
      return weight / Math.pow(height / 100, 2);
    } else {
      return (weight / Math.pow(height, 2)) * 703;
    }
  };

  const getBMICategory = (bmi: number): BMIResult => {
    if (bmi < 18.5) {
      return {
        bmi,
        category: "Thiếu cân",
        description:
          "Bạn có thể cần tăng một chút cân. Hãy cân nhắc tham khảo ý kiến bác sĩ.",
        color: "text-blue-600 dark:text-blue-400",
        icon: (
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        ),
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        bmi,
        category: "Cân nặng bình thường",
        description:
          "Tuyệt vời! Bạn đang ở trong khoảng cân nặng khỏe mạnh. Hãy duy trì lối sống hiện tại.",
        color: "text-green-600 dark:text-green-400",
        icon: (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        ),
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        bmi,
        category: "Thừa cân",
        description:
          "Hãy cân nhắc thay đổi lối sống để đạt được cân nặng khỏe mạnh hơn.",
        color: "text-yellow-600 dark:text-yellow-400",
        icon: (
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        ),
      };
    } else {
      return {
        bmi,
        category: "Béo phì",
        description: "Khuyến nghị tham khảo ý kiến bác sĩ để được hướng dẫn.",
        color: "text-red-600 dark:text-red-400",
        icon: (
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        ),
      };
    }
  };

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!weight || !height) {
      setError("Vui lòng nhập cả cân nặng và chiều cao.");
      return;
    }

    if (weightNum <= 0 || heightNum <= 0) {
      setError("Cân nặng và chiều cao phải là số dương.");
      return;
    }

    if (unit === "metric" && (weightNum > 300 || heightNum > 250)) {
      setError(
        "Vui lòng nhập giá trị thực tế cho cân nặng (kg) và chiều cao (cm).",
      );
      return;
    }

    if (unit === "imperial" && (weightNum > 660 || heightNum > 96)) {
      setError(
        "Vui lòng nhập giá trị thực tế cho cân nặng (lbs) và chiều cao (inches).",
      );
      return;
    }

    const bmi = calculateBMI(weightNum, heightNum, unit);
    const bmiResult = getBMICategory(bmi);
    setResult(bmiResult);
  };

  const handleReset = () => {
    setWeight("");
    setHeight("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Máy Tính BMI
            </h1>
            {/* <div className="ml-4">
              <ModeToggle />
            </div> */}
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Tính chỉ số khối cơ thể (BMI) để hiểu rõ phân loại cân nặng và nhận
            thông tin sức khỏe cá nhân.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Scale className="h-5 w-5" />
                Nhập Thông Số Của Bạn
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Chọn hệ thống đơn vị ưa thích và nhập cân nặng, chiều cao của
                bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Hệ Thống Đơn Vị
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <SelectValue placeholder="Chọn hệ thống đơn vị" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                    <SelectItem value="metric">Hệ mét (kg, cm)</SelectItem>
                    <SelectItem value="imperial">
                      Hệ Anh (lbs, inches)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="weight"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Cân nặng {unit === "metric" ? "(kg)" : "(lbs)"}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={unit === "metric" ? "70" : "154"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="height"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Chiều cao {unit === "metric" ? "(cm)" : "(inches)"}
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={unit === "metric" ? "170" : "67"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  size="lg"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Tính BMI
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Đặt Lại
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result ? (
              <>
                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <TrendingUp className="h-5 w-5" />
                      Kết Quả BMI Của Bạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">
                        {result.bmi.toFixed(1)}
                      </div>
                      <div
                        className={`text-xl font-semibold ${result.color} flex items-center justify-center gap-2`}
                      >
                        {result.icon}
                        {result.category}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                      <p className="text-gray-700 dark:text-gray-200">
                        {result.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Heart className="h-5 w-5" />
                      Phân Loại BMI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded bg-blue-50 p-2 dark:bg-blue-900/20">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Thiếu cân
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          &lt; 18.5
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded bg-green-50 p-2 dark:bg-green-900/20">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Cân nặng bình thường
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          18.5 - 24.9
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded bg-yellow-50 p-2 dark:bg-yellow-900/20">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Thừa cân
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          25.0 - 29.9
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded bg-red-50 p-2 dark:bg-red-900/20">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Béo phì
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          30.0 trở lên
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-full border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Heart className="h-5 w-5" />
                    Kết Quả Sẽ Xuất Hiện Ở Đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <Calculator className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <p>
                      Nhập thông số của bạn và nhấn &quot;Tính BMI&quot; để xem
                      kết quả.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Alert className="mx-auto max-w-2xl border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Lưu Ý Sức Khỏe:</strong> BMI là công cụ sàng lọc và có thể
              không chính xác cho tất cả mọi người. Nó không tính đến khối lượng
              cơ, mật độ xương, tuổi tác, giới tính hoặc dân tộc. Để được tư vấn
              sức khỏe cá nhân, vui lòng tham khảo ý kiến chuyên gia y tế.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
