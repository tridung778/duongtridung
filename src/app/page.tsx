"use client";

import Lanyard from "@/blocks/Components/Lanyard/Lanyard";
import TrueFocus from "@/blocks/TextAnimations/TrueFocus/TrueFocus";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const HomeContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative flex h-screen items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <Lanyard position={[0, 0, 20]} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 text-center">
          <div className="space-y-6">
            <div className="text-6xl font-bold text-gray-900 md:text-8xl dark:text-white">
              Hi
            </div>

            <div className="text-4xl font-bold md:text-6xl">
              <TrueFocus
                sentence="I'm TriDung"
                manualMode={false}
                blurAmount={5}
                borderColor="green"
                animationDuration={1}
                pauseBetweenAnimations={1}
              />
            </div>

            <div className="text-4xl font-bold text-gray-900 md:text-6xl dark:text-white">
              is a Software Developer
            </div>

            {/* Subtitle */}
            <div className="mx-auto mt-8 max-w-2xl text-xl text-gray-600 md:text-2xl dark:text-gray-300">
              Passionate about creating innovative solutions and building
              amazing user experiences
            </div>

            {/* Skills/Tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "Firebase",
                "Tailwind CSS",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-500/10 blur-xl dark:bg-blue-400/10"></div>
        <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-purple-500/10 blur-xl dark:bg-purple-400/10"></div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <HomeContent />
    </Sidebar>
  );
}
