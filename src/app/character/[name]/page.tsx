"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

interface Icon {
  id: string;
  name: string;
  url: string;
}

interface Character {
  name: string;
  defaultIcon: string | null;
  icons: Icon[];
}

export default function CharacterPage() {
  const params = useParams();
  const characterName = decodeURIComponent(params.name as string);
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedArt, setSelectedArt] = useState<Icon | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/getSplashArts?character=${characterName}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch character data");
        }
        const data: Character[] = await response.json();
        const foundCharacter = data.find(
          (c) => c.name.toLowerCase() === characterName.toLowerCase(),
        );

        if (!foundCharacter) {
          notFound();
        } else {
          setCharacter(foundCharacter);
          const defaultIcon = foundCharacter.defaultIcon
            ? foundCharacter.icons.find(
                (icon) => icon.url === foundCharacter.defaultIcon,
              )
            : foundCharacter.icons[0];
          setSelectedArt(defaultIcon || foundCharacter.icons[0]);
        }
      } catch (error) {
        console.error("Fetch data error:", error);
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
        {character.icons.map((art) => (
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
