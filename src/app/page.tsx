import Image from 'next/image';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.531 3.25a2.463 2.463 0 0 0-2.3-.52l-1.031.543a12.61 12.61 0 0 0-4.406-.859 12.574 12.574 0 0 0-4.406.86l-1.031-.544a2.46 2.46 0 0 0-2.3.52c-1.438 1.054-1.438 2.805 0 3.858l.563.41c-2.156 1.83-3.219 4.148-3.328 6.554a2.75 2.75 0 0 0 .75 2.016 2.65 2.65 0 0 0 2.156.883c1.031.648 2.25.961 3.516.961 1.266 0 2.484-.313 3.516-.96a2.65 2.65 0 0 0 2.156-.884 2.75 2.75 0 0 0 .75-2.016c-.109-2.406-1.172-4.723-3.328-6.553l.563-.41c1.438-1.054 1.438-2.805 0-3.859zm-10.828 9.11c-1.109 0-2.016-.954-2.016-2.125 0-1.172.906-2.125 2.016-2.125s2.016.953 2.016 2.125c0 1.171-.907 2.125-2.016 2.125zm6.586 0c-1.109 0-2.016-.954-2.016-2.125 0-1.172.907-2.125 2.016-2.125s2.016.953 2.016 2.125c0 1.171-.906 2.125-2.016 2.125z" />
  </svg>
);


const links = [
  {
    href: 'https://comunidadedayone.com.br/pagina-oficial/',
    label: 'D.A.Y COMMUNITY',
    backgroundImage: 'https://i.imgur.com/iXUBEal.jpeg',
  },
  {
    href: 'https://www.instagram.com/kaiccn_',
    label: 'Instagram',
    icon: <Instagram className="size-5" />,
  },
  {
    href: 'https://discord.gg/yDXTRvJCuQ',
    label: 'Comunidade Gratuita',
    icon: <DiscordIcon className="size-5" />,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: <Linkedin className="size-5" />,
  },
  {
    href: 'https://x.com',
    label: 'Twitter / X',
    icon: <Twitter className="size-5" />,
  },
];

export default function Home() {
  const profilePic = PlaceHolderImages.find(p => p.id === 'profile_picture');

  return (
    <main className="page-wrapper relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <Image
        src="https://i.imgur.com/jf8g3JT.gif"
        alt="Animated background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
        unoptimized
      />
      <div className="absolute inset-0 z-10 bg-black/70"></div>
      <div className="z-20 flex w-full flex-col items-center justify-center text-center">
        {profilePic && (
          <div className="relative w-32 h-32 rounded-full mb-4 border-2 border-primary/50 shadow-lg overflow-hidden">
            <Image
              src={profilePic.imageUrl}
              alt={profilePic.description}
              layout="fill"
              objectFit="cover"
              data-ai-hint={profilePic.imageHint}
              priority
            />
          </div>
        )}

        <h1 className="font-headline text-4xl font-bold text-foreground">
          Kaic Cavalcante
        </h1>
        <p className="font-body text-lg text-foreground/80 mt-1">@Kaiccn_</p>

        <div className="mt-8 flex w-full max-w-xs flex-col items-center space-y-4 sm:max-w-sm">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="outline"
              className="w-full h-16 text-base font-bold bg-accent/60 border-white/10 backdrop-blur-sm hover:bg-accent hover:text-foreground transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full text-white relative overflow-hidden group"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="z-10 w-full h-full flex items-center justify-center">
                {link.backgroundImage && (
                  <>
                    <Image
                      src={link.backgroundImage}
                      alt={link.label}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-10 bg-black/70"></div>
                  </>
                )}
                <div className="relative z-20 flex items-center gap-4">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
