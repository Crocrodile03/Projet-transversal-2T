import { useEffect, useState } from 'react';
import { API_URL } from '../config';

// Le format des données qu'on attend du backend
interface Mesure {
  topic: string;
  valeur: string;
  heure: string;
}

export default function DashboardPico() {
  const [mesures, setMesures] = useState<Mesure[]>([]);

  const fetchDonnees = async () => {
    try {
      const reponse = await fetch(`${API_URL}/api/pico/data`);
      if (reponse.ok) {
        const data = await reponse.json();
        setMesures(data);
      }
    } catch (erreur) {
      console.error("Impossible de contacter le Backend :", erreur);
    }
  };

  useEffect(() => {
    fetchDonnees(); // Appel initial
    const interval = setInterval(fetchDonnees, 2000); // Rafraîchissement toutes les 2s
    return () => clearInterval(interval); // Nettoyage
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎛️ Dashboard IoT (Pico W)</h1>
      <p style={{ color: '#666' }}>Données en temps réel du capteur</p>
      
      <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '12px' }}>
        {mesures.length === 0 ? (
          <p>⏳ En attente des données...</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {mesures.map((mesure, index) => (
              <li key={index} style={{ 
                background: 'white',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid #e4e4e7'
              }}>
                <span style={{ color: '#a1a1aa' }}>{mesure.heure}</span>
                <strong style={{ color: '#3f3f46' }}>{mesure.topic}</strong>
                <span style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {mesure.valeur}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}