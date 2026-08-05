import React, { createContext, useState, useEffect, useContext } from 'react';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  // Default user location (San Francisco default fallback if location denied/loading)
  const [userLocation, setUserLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    loaded: false,
    error: null,
    cityName: 'Current Location'
  });

  const [savedHospitals, setSavedHospitals] = useState(() => {
    try {
      const stored = localStorage.getItem('mediai_saved_hospitals');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedMedicines, setSavedMedicines] = useState(() => {
    try {
      const stored = localStorage.getItem('mediai_saved_medicines');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loaded: true,
            error: null,
            cityName: 'GPS Detected Location'
          });
        },
        (error) => {
          console.warn('[Geolocation Warning]', error.message);
          setUserLocation(prev => ({
            ...prev,
            loaded: true,
            error: 'Geolocation permission denied. Using default coordinates.'
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setUserLocation(prev => ({
        ...prev,
        loaded: true,
        error: 'Geolocation API is not supported by your browser.'
      }));
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const addSavedHospital = (hospital) => {
    setSavedHospitals(prev => {
      if (prev.some(h => h.name === hospital.name || h.hospitalId === hospital.hospitalId)) return prev;
      const updated = [hospital, ...prev];
      localStorage.setItem('mediai_saved_hospitals', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedHospital = (hospitalName) => {
    setSavedHospitals(prev => {
      const updated = prev.filter(h => h.name !== hospitalName);
      localStorage.setItem('mediai_saved_hospitals', JSON.stringify(updated));
      return updated;
    });
  };

  const addSavedMedicine = (medicine) => {
    setSavedMedicines(prev => {
      if (prev.some(m => m.name === medicine.name)) return prev;
      const updated = [medicine, ...prev];
      localStorage.setItem('mediai_saved_medicines', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedMedicine = (medName) => {
    setSavedMedicines(prev => {
      const updated = prev.filter(m => m.name !== medName);
      localStorage.setItem('mediai_saved_medicines', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <HealthContext.Provider value={{
      userLocation,
      requestLocation,
      savedHospitals,
      addSavedHospital,
      removeSavedHospital,
      savedMedicines,
      addSavedMedicine,
      removeSavedMedicine
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
