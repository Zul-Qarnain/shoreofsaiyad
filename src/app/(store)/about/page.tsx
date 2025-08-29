
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
              ✨ Memento was born from a simple thought—finding the perfect gift for the women we love, without the worry of overpriced or low-quality ornaments.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Here, you’ll discover premium-quality female ornaments at reasonable prices—often more affordable than the local market. Each piece is designed to bring elegance, beauty, and joy, whether it’s for your mother, sister, or someone special.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              And this is just the beginning. Very soon, we’ll be introducing more exciting products to make your gifting moments even more memorable.
            </p>
             <p className="mt-4 text-lg text-gray-600">
              🌸 Stay with us, support us, and be a part of the Memento journey.
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
