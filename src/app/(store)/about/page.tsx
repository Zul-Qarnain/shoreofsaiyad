import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Our Story
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Memento started with a simple idea: to bring the world's most
              cherished memories and crafts into your home. We travel far and
              wide to curate a collection of unique souvenirs, each with its own
              story.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Our mission is to connect you with beautiful, handcrafted items that
              evoke a sense of place and time. We believe that a souvenir is more
              than just an object; it's a tangible piece of a journey, a memory
              made real.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              We partner with local artisans and small businesses to ensure that
              every purchase supports a community and preserves traditional
              craftsmanship. Thank you for being a part of our story.
            </p>
          </div>
          <div className="relative h-96 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://picsum.photos/800/600"
              alt="Artisan crafting a souvenir"
              fill
              className="object-cover"
              data-ai-hint="artisan craft"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
