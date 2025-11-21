import CosmicClash from "../cosmic-clash/page";

interface GamePageProps {
  params: { slug: string };
}

export default function GamePage({ params }: GamePageProps) {
  const { slug } = params;

  // Simple conditional rendering (you can expand this later)
  if (slug === "cosmic-clash") {
    return <CosmicClash />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
      <h1 className="text-2xl">Game page for: {slug}</h1>
    </div>
  );
}
