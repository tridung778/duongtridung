"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { fetchCharacterData } from "@/app/api/getSplashArts/route"; // Đảm bảo đường dẫn đúng
import { notFound } from "next/navigation";

export default function CharacterPage({
  params,
}: {
  params: { name: string };
}) {
  const characterName = decodeURIComponent(params.name);
  const [character, setCharacter] = useState<any>(null);
  const [selectedArt, setSelectedArt] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCharacterData(characterName);
      if (!data) {
        notFound();
      } else {
        setCharacter(data);
        setSelectedArt(data.splashArts[0]);
      }
    };

    fetchData();
  }, [characterName]);

  if (!character || !selectedArt)
    return <div className="text-white">Đang tải...</div>;

  return (
    <div className="flex flex-col items-center bg-black text-white">
      <h1 className="my-4 text-4xl font-bold">{character.name}</h1>
      <div className="relative w-full max-w-2xl">
        <img
          src={selectedArt.url}
          alt={selectedArt.name}
          className="h-[400px] w-full rounded-lg object-cover"
        />
      </div>
      <h2 className="mt-8 text-2xl">Trang phục</h2>
      <div className="mt-4 flex max-w-xl gap-2 overflow-x-auto">
        {character.splashArts.map((art: any) => (
          <img
            key={art.id}
            src={art.url}
            alt={art.name}
            className={`h-16 w-16 cursor-pointer rounded-md object-cover transition-transform duration-200 ease-in-out ${
              art.id === selectedArt.id
                ? "scale-110 ring-4 ring-blue-500"
                : "opacity-75 hover:opacity-100"
            }`}
            onClick={() => setSelectedArt(art)}
          />
        ))}
      </div>
    </div>
  );
}
