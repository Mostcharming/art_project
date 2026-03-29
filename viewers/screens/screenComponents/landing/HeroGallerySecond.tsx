const CARDS = [
  // 1 — Far left (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/7.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#1a0a2e]',
    pos: 'left-[-10%] top-[30%] w-[17.7%] h-[30.5%]',
    partial: true,
  },
  // 2 — Left medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/6.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#1a237e]',
    pos: 'left-[6.1%] top-[20%] w-[17.7%] h-[40.6%]',
    partial: false,
  },
  // 3 — Left tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/5.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#111111]',
    pos: 'left-[22.2%] top-[8%] w-[17.7%] h-[49.5%]',
    partial: false,
  },
  // 4 — CENTER (tallest, no overflow)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/1.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#6b1a1a]',
    pos: 'left-[38.3%] top-[0%] w-[23.4%] h-[54.2%]',
    partial: false,
    isCenter: true,
  },
  // 5 — Right tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/2.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#7a2800]',
    pos: 'left-[60.1%] top-[8%] w-[17.7%] h-[49.5%]',
    partial: false,
  },
  // 6 — Right medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/3.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#d4d0c8]',
    pos: 'left-[76.2%] top-[20%] w-[17.7%] h-[39.4%]',
    partial: false,
  },
  // 7 — Far right (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/4.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#5a2d00]',
    pos: 'left-[92.3%] top-[30%] w-[17.7%] h-[29.3%]',
    partial: true,
  },
];

export function HeroGallerySecond() {
  return (
    <section className="relative w-full aspect-video">
      <div className="absolute inset-0 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 z-10 pointer-events-none" />

        {/* Cards */}
        {CARDS.map((card, index) => {
          const isFocused = !card.partial && index === 3;

          return (
            <div
              key={card.src}
              className={[
                'absolute overflow-hidden rounded-xl cursor-pointer group transition-all duration-300',
                card.bg,
                card.pos,
                card.isCenter ? 'rounded-[10px]' : '',
                isFocused
                  ? 'scale-[1.05] z-30 ring-4 ring-white/80 shadow-2xl'
                  : card.isCenter
                  ? 'z-10'
                  : 'z-0',
                !isFocused && !card.partial
                  ? 'hover:scale-[1.02] hover:z-20'
                  : '',
              ].join(' ')}
            >
              <img
                src={card.src}
                alt={card.alt}
                className={[
                  'w-full h-full object-cover object-top transition-transform duration-500',
                  isFocused ? 'scale-105' : 'group-hover:scale-105',
                ].join(' ')}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
