import Lanyard from "@/blocks/Components/Lanyard/Lanyard";
import TrueFocus from "@/blocks/TextAnimations/TrueFocus/TrueFocus";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex h-[80vh] items-center justify-center">
          <div>
            <div className="text-4xl">Hi</div>
            <TrueFocus
              sentence="I'm TriDung"
              manualMode={false}
              blurAmount={5}
              borderColor="green"
              animationDuration={1}
              pauseBetweenAnimations={1}
            />
            <div className="text-4xl">is a Software Developer</div>
          </div>
          <div className="absolute top-15 right-0 left-0">
            <Lanyard position={[0, 0, 20]} />
          </div>
        </div>
      </div>
    </>
  );
}
