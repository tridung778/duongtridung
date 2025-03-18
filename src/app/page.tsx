import TrueFocus from "@/blocks/TextAnimations/TrueFocus/TrueFocus";

export default function Home() {
  return (
    <>
      <TrueFocus
        sentence="True Focus"
        manualMode={false}
        blurAmount={5}
        borderColor="red"
        animationDuration={2}
        pauseBetweenAnimations={1}
      />
    </>
  );
}
