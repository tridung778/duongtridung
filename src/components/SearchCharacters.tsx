"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface CharacterData {
  name: string;
  defaultIcon: string | null;
  icons: { id: string; name: string; url: string }[];
}

interface SearchCharactersProps {
  initialCharacters: CharacterData[];
}

export function SearchCharacters({ initialCharacters }: SearchCharactersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState(initialCharacters);

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm.trim()) {
        setCharacters(initialCharacters);
        return;
      }

      const res = await fetch(
        `/api/getIconArts?character=${encodeURIComponent(searchTerm)}`,
        { cache: "no-store" },
      );

      if (res.ok) {
        const data: CharacterData[] = await res.json();
        setCharacters(Array.isArray(data) ? data : []);
      }
    };

    fetchData();
  }, [searchTerm, initialCharacters]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-center">
        <Input
          placeholder="Tìm kiếm tướng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md border-gray-700 bg-gray-800 text-white"
        />
      </div>

      {filteredCharacters.length === 0 ? (
        <p className="text-center text-white">Không tìm thấy tướng.</p>
      ) : (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {filteredCharacters.map((character) => (
            <Link
              key={character.name}
              href={`/character/${encodeURIComponent(character.name)}`}
              className="block"
            >
              <div className="text-center">
                {character.defaultIcon && (
                  <div className="relative mx-auto h-24 w-24 overflow-hidden">
                    <Image
                      src={character.defaultIcon}
                      alt={character.name}
                      width={96}
                      height={96}
                      className="h-full w-full rounded-md object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                )}
                <p className="mt-1 text-xs text-white">{character.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
