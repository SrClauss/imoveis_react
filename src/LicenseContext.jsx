import React, { createContext, useState, useEffect } from 'react';

const LicenseContext = createContext();

export default function LicenseProvider ({ children }) {
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await response.json();
        const currentTime = new Date(data.datetime);
        const licenseExpiryDate = new Date('2024-10-20T00:00:00Z'); // Substitua pela data de expiração da sua licença

        if (currentTime < licenseExpiryDate) {
          setIsLicenseValid(true);
        } else {
          setIsLicenseValid(false);
        }
      } catch (error) {
        console.error('Erro ao verificar a licença:', error);
        setIsLicenseValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkLicense();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isLicenseValid) {
    return <h1>Licença expirada</h1>;
  }

  return (
    <LicenseContext.Provider value={{ isLicenseValid }}>
      {children}
    </LicenseContext.Provider>
  );
};



