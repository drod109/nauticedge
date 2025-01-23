interface LocationInfo {
  city: string;
  country: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}

export async function getLocationInfo(): Promise<LocationInfo> {
  try {
    const fallbackLocation = {
      city: 'Unknown City',
      country: 'Unknown Country',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: undefined,
      longitude: undefined
    };

    // Try to get more accurate location using browser geolocation
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
        
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.results && data.results[0]?.components) {
          const components = data.results[0].components;
          return {
            city: components.city || components.town || components.village || components.county || 'Unknown City',
            country: components.country || 'Unknown Country',
            timezone: data.results[0].annotations?.timezone?.name || fallbackLocation.timezone,
            latitude,
            longitude
          };
        }
      } catch (error) {
        console.warn('Error getting precise location:', error);
      }
    }

    return fallbackLocation;
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      city: 'Unknown City',
      country: 'Unknown Country',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: undefined,
      longitude: undefined
    };
  }
}