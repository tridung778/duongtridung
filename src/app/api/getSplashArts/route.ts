import { drive_v3, google } from "googleapis";
import path from "path";
import { unstable_cache } from "next/cache";

interface CharacterData {
  name: string;
  defaultIcon: string | null;
  splashArts: { id: string; name: string; url: string }[];
}

// Hàm fetch dữ liệu từ Google Drive (không thay đổi logic gốc)
const getCharacterData = async (
  characterName: string,
): Promise<CharacterData | null> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive: drive_v3.Drive = google.drive({ version: "v3", auth });
  const iconArtFolderId = "1rIBgjLAocYKRwU1fDPvsA_Cz-FeIFiHf";
  const splashArtFolderId = "15I50L-80QPJmiJ6Dg8t36q-1g_g9W8tp";

  const iconFolders = await drive.files
    .list({
      q: `'${iconArtFolderId}' in parents and name = '${characterName}'`,
      fields: "files(id, name)",
    })
    .then((res) => res.data.files || []);

  if (!iconFolders.length) return null;

  const iconFolder = iconFolders[0];
  const icons = await drive.files
    .list({
      q: `'${iconFolder.id}' in parents`,
      fields: "files(id, name, mimeType, webContentLink)",
    })
    .then((res) => res.data.files || []);

  const defaultIcon =
    icons.find((file) => file.mimeType?.startsWith("image/"))?.webContentLink ||
    null;

  const splashFolders = await drive.files
    .list({
      q: `'${splashArtFolderId}' in parents and name = '${characterName}'`,
      fields: "files(id, name)",
    })
    .then((res) => res.data.files || []);

  let splashArts: { id: string; name: string; url: string }[] = [];
  if (splashFolders.length) {
    const splashFolder = splashFolders[0];
    splashArts = await drive.files
      .list({
        q: `'${splashFolder.id}' in parents`,
        fields: "files(id, name, mimeType, webContentLink)",
      })
      .then((res) =>
        (res.data.files || [])
          .filter((file) => file.mimeType?.startsWith("image/"))
          .map((file) => ({
            id: file.id!,
            name: file.name!,
            url: `https://lh3.googleusercontent.com/d/${file.id}=w1000?authuser=1/view`,
          })),
      );
  }

  return { name: characterName, defaultIcon, splashArts };
};

// Wrap hàm getCharacterData với unstable_cache
export const fetchCharacterData = unstable_cache(
  getCharacterData,
  ["character-data"], // Key để xác định cache
  {
    revalidate: 3600, // Thời gian cache (1 giờ)
    tags: ["character-data"], // Tags để invalidate cache nếu cần
  },
);
