import { google, drive_v3 } from "googleapis";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import auth from "./../../../lib/auth";

interface CharacterData {
  name: string; // Tên nhân vật (tên folder)
  defaultIcon: string | null; // URL ảnh mặc định từ "icon art"
  icons: { id: string; name: string; url: string }[]; // Danh sách tất cả icon
}

const fetchCharacterData = unstable_cache(
  async (drive: drive_v3.Drive, iconArtFolderId: string) => {
    // Lấy folder con từ "icon art"
    const iconFolders = await drive.files
      .list({
        q: `'${iconArtFolderId}' in parents`,
        fields: "files(id, name)",
      })
      .then((res) => res.data.files || []);

    // Tạo map để ánh xạ tên nhân vật với ID folder
    const iconFolderMap = new Map(iconFolders.map((f) => [f.name!, f.id!]));

    // Lấy dữ liệu từ các folder icon art
    const characterPromises = Array.from(iconFolderMap.entries()).map(
      async ([characterName, iconFolderId]) => {
        // Lấy ảnh từ "icon art"
        const iconQuery = await drive.files.list({
          q: `'${iconFolderId}' in parents`,
          fields: "files(id, name, mimeType, webContentLink)",
          pageSize: 100,
        });

        const icons = (iconQuery.data.files || [])
          .filter((file) => file.mimeType?.startsWith("image/"))
          .map((file) => ({
            id: file.id!,
            name: file.name!,
            url: `https://lh3.googleusercontent.com/d/${file.id}=w1000?authuser=1/view`,
          }));

        const defaultIcon =
          icons.find((file) => {
            // Kiểm tra tên file có chứa ít nhất 2 số 0 liên tiếp
            return /00/.test(file.name);
          })?.url || null;

        return {
          name: characterName,
          defaultIcon,
          icons,
        };
      },
    );

    const results = await Promise.all(characterPromises);
    return results;
  },
  ["character-icon-data"],
  { revalidate: 3600, tags: ["character-icon-data"] },
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const character = searchParams.get("character")?.toLowerCase();

    const drive: drive_v3.Drive = google.drive({ version: "v3", auth });
    const iconArtFolderId = "1rIBgjLAocYKRwU1fDPvsA_Cz-FeIFiHf";

    const allCharacters = await fetchCharacterData(drive, iconArtFolderId);

    if (allCharacters.length === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy nhân vật nào" },
        { status: 200 },
      );
    }

    // Lọc theo tên nhân vật nếu có query
    const filteredCharacters = character
      ? allCharacters.filter((c) => c.name.toLowerCase().includes(character))
      : allCharacters;

    if (filteredCharacters.length === 0) {
      return NextResponse.json(
        { message: `Không tìm thấy nhân vật "${character}"` },
        { status: 200 },
      );
    }

    return NextResponse.json(filteredCharacters, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
