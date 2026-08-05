import { useState, useEffect } from 'react';

export function useGeolocation(defaultLat = 37.7749, defaultLng = -122.4194) {
  const [location, setLocation] = useState({
    latitude: defaultLat,
    longitude: defaultLng,
    loaded: false,
    error: null,
    cityName: 'Current Location'
  });

  const refreshLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loaded: true,
            error: null,
            cityName: 'GPS Location Detected'
          });
        },
        (err) => {
          setLocation(prev => ({
            ...prev,
            loaded: true,
            error: err.message || 'Geolocation permission denied.'
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocation(prev => ({
        ...prev,
        loaded: true,
        error: 'Geolocation is not supported by your browser.'
      }));
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return { location, refreshLocation };
}
