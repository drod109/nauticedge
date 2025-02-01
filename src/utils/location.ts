interface LocationInfo {
  city: string;
  country: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}

export async function getLocationInfo(): Promise<LocationInfo> {
  try {
    // First try to get location from IP
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      if (ipData && !ipData.error) {
        return {
          city: ipData.city || 'Unknown City',
          country: ipData.country_name || 'Unknown Country',
          timezone: ipData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          latitude: ipData.latitude,
          longitude: ipData.longitude
        };
      }
    } catch (error) {
      console.warn('Error getting location from IP:', error);
    }

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
            timezone: data.results[0].annotations?.timezone?.name || Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude,
            longitude
          };
        }
      } catch (error) {
        console.warn('Error getting precise location:', error);
      }
    }

    // Return fallback location if all methods fail
    return {
      city: 'Unknown City',
      country: 'Unknown Country',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: undefined,
      longitude: undefined
    };
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