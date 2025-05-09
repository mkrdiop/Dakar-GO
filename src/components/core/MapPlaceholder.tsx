
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  centerText?: string;
}

export default function MapPlaceholder({ centerText = "Prévisualisation de la carte" }: MapPlaceholderProps) {
  return (
    <div className="relative w-full aspect-[16/9] bg-secondary rounded-lg shadow-inner overflow-hidden flex items-center justify-center">
      <Image 
        src="https://picsum.photos/seed/map/800/450" 
        alt="Emplacement de la carte" 
        layout="fill" 
        objectFit="cover"
        className="opacity-30"
        data-ai-hint="map background"
      />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <MapPin className="w-12 h-12 text-primary mb-2" />
        <p className="text-lg font-semibold text-foreground">{centerText}</p>
        <p className="text-sm text-muted-foreground">La fonctionnalité de carte sera bientôt disponible.</p>
      </div>
    </div>
  );
}
