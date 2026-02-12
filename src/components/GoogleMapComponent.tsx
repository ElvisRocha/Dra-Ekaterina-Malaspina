import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface GoogleMapComponentProps {
  className?: string;
  showDirectionsButton?: boolean;
  language?: 'es' | 'en';
}

const GoogleMapComponent = ({
  className,
  showDirectionsButton = true,
  language = 'es',
}: GoogleMapComponentProps) => {
  const position = {
    lat: 10.34064978060463,
    lng: -84.43508797805552,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;
    window.open(url, '_blank');
  };

  if (!apiKey) {
    return (
      <div className={className}>
        <div className="bg-muted rounded-xl h-full flex items-center justify-center">
          <div className="text-center p-4">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              {language === 'es'
                ? 'Mapa no disponible. Configura VITE_GOOGLE_MAPS_API_KEY en .env'
                : 'Map unavailable. Set VITE_GOOGLE_MAPS_API_KEY in .env'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={16}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          className={className}
          mapTypeId="roadmap"
        >
          <Marker
            position={position}
            title="Consultorio Dra. Ekaterina Malaspina"
          />
        </Map>
      </APIProvider>

      {showDirectionsButton && (
        <button
          onClick={openDirections}
          className="absolute bottom-4 right-4 btn-gradient flex items-center gap-2 px-4 py-2 rounded-full text-sm z-10"
          aria-label={
            language === 'es'
              ? 'Abrir direcciones en Google Maps'
              : 'Open directions in Google Maps'
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          {language === 'es' ? 'Cómo Llegar' : 'Get Directions'}
        </button>
      )}
    </div>
  );
};

export default GoogleMapComponent;
