import Image from 'next/image';

interface ApexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function ApexLogo({ size = 'md', showText = true, className = '' }: ApexLogoProps) {
  const dimensions = {
    sm: { box: 'w-8 h-8', img: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', img: 44, text: 'text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', img: 56, text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', img: 80, text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${dimensions.box} rounded-2xl overflow-hidden border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.35)] shrink-0 transition-transform duration-300 hover:scale-105`}>
        <Image
          src="/images/apex_brand_logo.jpg"
          alt="Apex Fit Logo"
          fill
          sizes="80px"
          priority
          className="object-cover"
        />
      </div>

      {showText && (
        <div>
          <h2 className={`font-black tracking-wider uppercase bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent ${dimensions.text}`}>
            Apex Fit AI
          </h2>
          <p className={`${dimensions.sub} text-blue-400 font-mono tracking-widest uppercase`}>
            Next-Gen Athletic Suite
          </p>
        </div>
      )}
    </div>
  );
}
