import Image from "next/image";

const posts = [
  "/instagram/post-1.png",
  "/instagram/post-2.png",
  "/instagram/post-3.png",
  "/instagram/post-4.png",
  "/instagram/post-5.png",
  "/instagram/post-6.png",
];

const InstagramSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div className="!mb-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-zinc-950 sm:text-4xl">
            @SHIRTCLUB
          </h2>

          <a
            href="#"
            className="text-xs font-medium text-zinc-700 hover:underline sm:text-sm"
          >
            Ver no Instagram ›
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, index) => (
            <a
              href="#"
              key={index}
              className="group relative h-[150px] overflow-hidden rounded-lg bg-zinc-100 sm:h-[170px] lg:h-[160px]"
            >
              <Image
                src={post}
                alt={`Post Instagram ${index + 1}`}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;