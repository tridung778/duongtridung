"use client";
import { useState, useRef, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as faceapi from "face-api.js";

export default function AvatarCreator() {
  const [selections, setSelections] = useState({
    character: "telannas",
    name: "Người chơi",
    skin: "default",
    rank: "thachdau",
    mastery: "s",
    team: "xanh",
    matches: "456",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load face-api models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      console.log("Face-api models loaded");
    };
    loadModels();
  }, []);

  const characters = [
    { value: "telannas", label: "Tel'Annas" },
    { value: "violet", label: "Violet" },
    { value: "rouie", label: "Rouie" },
    { value: "bonnie", label: "Bonnie" },
    { value: "lindis", label: "Lindis" },
    { value: "elsu", label: "Elsu" },
  ];

  const skins = [
    { value: "default", label: "Mặc định" },
    { value: "nhapten", label: "Nhập tên" },
    { value: "siga", label: "Sĩ Giả Tân Thế" },
  ];

  const ranks = [
    { value: "thachdau", label: "Thách đấu" },
    { value: "ss-mua", label: "SS Mùa" },
    { value: "an", label: "An" },
  ];

  const masteries = [
    { value: "s", label: "S" },
    { value: "tdchanh", label: "Tđ chiến" },
    { value: "phuhieu", label: "Phù hiệu" },
  ];

  const teams = [
    { value: "xanh", label: "Xanh" },
    { value: "do", label: "Đỏ" },
  ];

  const handleChange = (field: string, value: string) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Thiết lập kích thước Canvas cho demo (cố định để vừa đủ xem)
    const displayWidth = 400; // Kích thước cố định cho giao diện
    const displayHeight = 400;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Vẽ ảnh nền (scale xuống để vừa với Canvas demo)
    const background = new Image();
    background.src = `/images/photo-aov/heros/elsu/elsu.jpg`;
    background.crossOrigin = "Anonymous"; // Để tránh lỗi CORS nếu ảnh từ nguồn khác
    await new Promise((resolve) => (background.onload = resolve));
    const scale = Math.min(
      displayWidth / background.naturalWidth,
      displayHeight / background.naturalHeight,
    );
    ctx.drawImage(
      background,
      0,
      0,
      background.naturalWidth * scale,
      background.naturalHeight * scale,
    );

    // Phát hiện khuôn mặt trên ảnh gốc (không scale)
    const detections = await faceapi
      .detectSingleFace(background)
      .withFaceLandmarks();
    let facePosition = { x: 0, y: 0, width: 0, height: 0 };
    if (detections) {
      const { x, y, width, height } = detections.detection.box;
      facePosition = { x, y, width, height };
      console.log("Face detected:", facePosition);
    } else {
      console.log("No face detected, using default position");
      facePosition = {
        x: background.naturalWidth / 4,
        y: background.naturalHeight / 4,
        width: background.naturalWidth / 2,
        height: background.naturalHeight / 2,
      };
    }

    // Scale vị trí khuôn mặt về kích thước Canvas demo
    const scaledFaceX = facePosition.x * scale;
    const scaledFaceY = facePosition.y * scale;
    const scaledFaceWidth = facePosition.width * scale;
    const scaledFaceHeight = facePosition.height * scale;

    // Kích thước khung cố định
    const frameSize = 300; // Kích thước khung cố định (có thể thay đổi)
    const frameX = scaledFaceX - (frameSize - scaledFaceWidth) / 2;
    const frameY = scaledFaceY - (frameSize - scaledFaceHeight) / 2;

    // Vẽ khung (scale frame để vừa với Canvas demo)
    const frame = new Image();
    frame.src = "/images/photo-aov/frames/Thách Đấu - 1.png";
    await new Promise((resolve) => (frame.onload = resolve));
    const frameScale = frameSize / frame.naturalWidth; // Tỷ lệ scale khung
    ctx.drawImage(
      frame,
      frameX,
      frameY,
      frame.naturalWidth * frameScale,
      frame.naturalHeight * frameScale,
    );

    // Vẽ badge rank (đặt phía trên khung)
    const badge = new Image();
    badge.src = `/assets/badges/${selections.rank}.png`;
    await new Promise((resolve) => (badge.onload = resolve));
    const badgeSize = frameSize * 0.125; // 12.5% kích thước khung
    const badgeX = frameX + (frameSize - badgeSize) / 2;
    const badgeY = frameY - badgeSize / 2;
    ctx.drawImage(badge, badgeX, badgeY, badgeSize, badgeSize);

    // Vẽ text: Tên người chơi (phía dưới khung)
    const fontSizeName = frameSize * 0.06; // Font size tỷ lệ với khung
    ctx.font = `bold ${fontSizeName}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(
      selections.name,
      frameX + frameSize / 2,
      frameY + frameSize + fontSizeName + 10,
    );

    // Vẽ text: Tên nhân vật
    const fontSizeCharacter = fontSizeName * 0.8;
    ctx.font = `bold ${fontSizeCharacter}px Arial`;
    ctx.fillStyle = "#ffd700";
    ctx.fillText(
      selections.character.toUpperCase(),
      frameX + frameSize / 2,
      frameY + frameSize + fontSizeName + fontSizeCharacter + 20,
    );

    // Vẽ text: Số trận
    const fontSizeMatches = fontSizeName * 0.7;
    ctx.font = `bold ${fontSizeMatches}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      selections.matches,
      frameX + frameSize / 2,
      frameY +
        frameSize +
        fontSizeName +
        fontSizeCharacter +
        fontSizeMatches +
        30,
    );

    // Vẽ icon bổ trợ (góc dưới bên phải của khung)
    const boTroIcon = new Image();
    boTroIcon.src = "/assets/icons/bo-tro.png";
    await new Promise((resolve) => (boTroIcon.onload = resolve));
    const iconSize = frameSize * 0.075; // 7.5% kích thước khung
    ctx.drawImage(
      boTroIcon,
      frameX + frameSize - iconSize - 10,
      frameY + frameSize - iconSize - 10,
      iconSize,
      iconSize,
    );

    // Vẽ watermark
    const fontSizeWatermark = displayWidth * 0.03; // Font size tỷ lệ với chiều rộng Canvas demo
    ctx.font = `${fontSizeWatermark}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.fillText("www.taoanhdep.com", canvas.width - 10, canvas.height - 10);

    // Tạo ảnh tải xuống với kích thước gốc
    const downloadCanvas = document.createElement("canvas");
    const downloadCtx = downloadCanvas.getContext("2d");
    downloadCanvas.width = background.naturalWidth;
    downloadCanvas.height = background.naturalHeight;
    downloadCtx?.drawImage(
      background,
      0,
      0,
      background.naturalWidth,
      background.naturalHeight,
    );

    // Phát hiện khuôn mặt trên ảnh gốc cho tải xuống
    const downloadDetections = await faceapi
      .detectSingleFace(background)
      .withFaceLandmarks();
    let downloadFacePosition = { x: 0, y: 0, width: 0, height: 0 };
    if (downloadDetections) {
      const { x, y, width, height } = downloadDetections.detection.box;
      downloadFacePosition = { x, y, width, height };
    } else {
      downloadFacePosition = {
        x: background.naturalWidth / 4,
        y: background.naturalHeight / 4,
        width: background.naturalWidth / 2,
        height: background.naturalHeight / 2,
      };
    }

    // Vẽ khung với kích thước cố định trên ảnh tải xuống
    const downloadFrame = new Image();
    downloadFrame.src = "/images/photo-aov/frames/Thách Đấu - 1.png";
    await new Promise((resolve) => (downloadFrame.onload = resolve));
    const downloadFrameSize = 300; // Kích thước khung cố định khi tải xuống
    const downloadFrameX =
      downloadFacePosition.x -
      (downloadFrameSize - downloadFacePosition.width) / 2;
    const downloadFrameY =
      downloadFacePosition.y -
      (downloadFrameSize - downloadFacePosition.height) / 2;
    downloadCtx?.drawImage(
      downloadFrame,
      downloadFrameX,
      downloadFrameY,
      downloadFrameSize,
      downloadFrameSize,
    );

    // Vẽ các thành phần khác trên ảnh tải xuống
    const downloadBadge = new Image();
    downloadBadge.src = `/assets/badges/${selections.rank}.png`;
    await new Promise((resolve) => (downloadBadge.onload = resolve));
    const downloadBadgeSize = downloadFrameSize * 0.125;
    const downloadBadgeX =
      downloadFrameX + (downloadFrameSize - downloadBadgeSize) / 2;
    const downloadBadgeY = downloadFrameY - downloadBadgeSize / 2;
    downloadCtx?.drawImage(
      downloadBadge,
      downloadBadgeX,
      downloadBadgeY,
      downloadBadgeSize,
      downloadBadgeSize,
    );

    const downloadFontSizeName = downloadFrameSize * 0.06;
    downloadCtx!.font = `bold ${downloadFontSizeName}px Arial`;
    downloadCtx!.fillStyle = "#ffffff";
    downloadCtx!.textAlign = "center";
    downloadCtx!.fillText(
      selections.name,
      downloadFrameX + downloadFrameSize / 2,
      downloadFrameY + downloadFrameSize + downloadFontSizeName + 10,
    );

    const downloadFontSizeCharacter = downloadFontSizeName * 0.8;
    downloadCtx!.font = `bold ${downloadFontSizeCharacter}px Arial`;
    downloadCtx!.fillStyle = "#ffd700";
    downloadCtx!.fillText(
      selections.character.toUpperCase(),
      downloadFrameX + downloadFrameSize / 2,
      downloadFrameY +
        downloadFrameSize +
        downloadFontSizeName +
        downloadFontSizeCharacter +
        20,
    );

    const downloadFontSizeMatches = downloadFontSizeName * 0.7;
    downloadCtx!.font = `bold ${downloadFontSizeMatches}px Arial`;
    downloadCtx!.fillStyle = "#ffffff";
    downloadCtx!.fillText(
      selections.matches,
      downloadFrameX + downloadFrameSize / 2,
      downloadFrameY +
        downloadFrameSize +
        downloadFontSizeName +
        downloadFontSizeCharacter +
        downloadFontSizeMatches +
        30,
    );

    const downloadBoTroIcon = new Image();
    downloadBoTroIcon.src = "/assets/icons/bo-tro.png";
    await new Promise((resolve) => (downloadBoTroIcon.onload = resolve));
    const downloadIconSize = downloadFrameSize * 0.075;
    downloadCtx!.drawImage(
      downloadBoTroIcon,
      downloadFrameX + downloadFrameSize - downloadIconSize - 10,
      downloadFrameY + downloadFrameSize - downloadIconSize - 10,
      downloadIconSize,
      downloadIconSize,
    );

    const downloadFontSizeWatermark = background.naturalWidth * 0.03;
    downloadCtx!.font = `${downloadFontSizeWatermark}px Arial`;
    downloadCtx!.fillStyle = "#ffffff";
    downloadCtx!.textAlign = "right";
    downloadCtx!.fillText(
      "www.taoanhdep.com",
      background.naturalWidth - 10,
      background.naturalHeight - 10,
    );

    // Tải ảnh xuống với kích thước gốc
    const downloadDataURL = downloadCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadDataURL;
    downloadLink.download = "avatar.png";
    downloadLink.click();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Character Selection */}
      <div className="space-y-2">
        <Label>Nhân vật</Label>
        <RadioGroup
          value={selections.character}
          onValueChange={(value) => handleChange("character", value)}
          className="flex space-x-4"
        >
          {characters.map((char) => (
            <div key={char.value} className="flex items-center space-x-2">
              <RadioGroupItem value={char.value} id={char.value} />
              <Label htmlFor={char.value}>{char.label}</Label>
              <img
                src={`/assets/characters/${char.value}/skins/default.png`}
                alt={char.label}
                className="h-16 w-16 rounded object-cover"
              />
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label>Tên</Label>
        <Input
          value={selections.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Nhập tên"
        />
      </div>

      {/* Skin Selection */}
      <div className="space-y-2">
        <Label>Skin</Label>
        <Select
          value={selections.skin}
          onValueChange={(value) => handleChange("skin", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn skin" />
          </SelectTrigger>
          <SelectContent>
            {skins.map((skin) => (
              <SelectItem key={skin.value} value={skin.value}>
                {skin.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rank Selection */}
      <div className="space-y-2">
        <Label>Rank</Label>
        <Select
          value={selections.rank}
          onValueChange={(value) => handleChange("rank", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn rank" />
          </SelectTrigger>
          <SelectContent>
            {ranks.map((rank) => (
              <SelectItem key={rank.value} value={rank.value}>
                {rank.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mastery Selection */}
      <div className="space-y-2">
        <Label>Mastery</Label>
        <Select
          value={selections.mastery}
          onValueChange={(value) => handleChange("mastery", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn mastery" />
          </SelectTrigger>
          <SelectContent>
            {masteries.map((mastery) => (
              <SelectItem key={mastery.value} value={mastery.value}>
                {mastery.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Selection */}
      <div className="space-y-2">
        <Label>Đội</Label>
        <RadioGroup
          value={selections.team}
          onValueChange={(value) => handleChange("team", value)}
          className="flex space-x-4"
        >
          {teams.map((team) => (
            <div key={team.value} className="flex items-center space-x-2">
              <RadioGroupItem value={team.value} id={team.value} />
              <Label htmlFor={team.value}>{team.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Matches Input */}
      <div className="space-y-2">
        <Label>Số trận</Label>
        <Input
          type="number"
          value={selections.matches}
          onChange={(e) => handleChange("matches", e.target.value)}
          placeholder="Nhập số trận"
        />
      </div>

      {/* Canvas để xem trước và ghép ảnh */}
      <div className="space-y-2">
        <Label>Xem trước</Label>
        <canvas ref={canvasRef} className="rounded border shadow" />
      </div>

      {/* Create Button */}
      <Button onClick={generateImage}>Tạo ảnh</Button>
    </div>
  );
}
