import { SearchCharacters } from "@/components/SearchCharacters";
interface CharacterData {
  name: string;
  defaultIcon: string | null;
  icons: { id: string; name: string; url: string }[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const fetchCharacters = async () => {
  const res = await fetch(`${BASE_URL}/api/getIconArts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! Status: ${res.status} - ${errorText}`);
  }

  const data: CharacterData[] = await res.json();
  return Array.isArray(data) ? data : [];
};

export default async function Home() {
  let characters: CharacterData[] = [];
  let errorMessage: string | null = null;

  try {
    characters = await fetchCharacters();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    errorMessage = (error as Error).message;
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto min-h-screen bg-gray-900 p-4 text-white">
        <h1 className="mb-6 text-3xl font-bold">Nhân Vật</h1>
        <p className="text-red-500">Lỗi: {errorMessage}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="container mx-auto min-h-screen bg-gray-900 p-4 text-white">
        <h1 className="mb-6 text-3xl font-bold">Nhân Vật</h1>
        <p>Không tìm thấy nhân vật nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-gray-900 p-4 text-white">
      <h1 className="mb-6 text-3xl font-bold">Nhân Vật</h1>
      <SearchCharacters initialCharacters={characters} />
    </div>
  );
}
