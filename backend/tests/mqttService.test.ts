import mqtt from 'mqtt';

// 1. ASTUCE DE PRO : On crée un "Faux" client MQTT pour capturer les événements
const mockMqttClient = {
  callbacks: {} as Record<string, Function>,
  // On capture les fonctions passées à .on('connect'), .on('message'), etc.
  on: jest.fn(function (event: string, cb: Function) {
    this.callbacks[event] = cb;
  }),
  subscribe: jest.fn(),
  publish: jest.fn(),
};

// On force la librairie 'mqtt' à renvoyer notre faux client
jest.mock('mqtt', () => ({
  connect: jest.fn(() => mockMqttClient),
}));

// 2. On importe le service SEULEMENT APRÈS avoir mocké mqtt
import { initMqtt, historiqueCapteurs } from '../src/services/mqttService';

describe('MQTT Service', () => {
  beforeEach(() => {
    // On vide le tableau et on reset les compteurs Jest avant chaque test
    historiqueCapteurs.length = 0;
    jest.clearAllMocks();
  });

  it('devrait souscrire aux bons topics lors de la connexion', () => {
    initMqtt();
    
    // On déclenche manuellement l'événement "connect"
    mockMqttClient.callbacks['connect']();

    expect(mockMqttClient.subscribe).toHaveBeenCalledWith('pico/distance');
    expect(mockMqttClient.subscribe).toHaveBeenCalledWith('pico/bouton');
  });

  it('devrait ajouter une donnée formatée lors de la réception d\'un message', () => {
    initMqtt();
    const messageHandler = mockMqttClient.callbacks['message'];

    // On simule la réception d'un message "15" sur le topic distance
    messageHandler('pico/distance', Buffer.from('15'));

    expect(historiqueCapteurs.length).toBe(1);
    expect(historiqueCapteurs[0].topic).toBe('pico/distance');
    expect(historiqueCapteurs[0].valeur).toBe('15');
    expect(historiqueCapteurs[0]).toHaveProperty('heure');
  });

  it('ne devrait jamais dépasser 20 éléments dans l\'historique', () => {
    initMqtt();
    const messageHandler = mockMqttClient.callbacks['message'];

    // On simule la réception de 25 messages d'affilée
    for (let i = 0; i < 25; i++) {
      messageHandler('pico/distance', Buffer.from(`valeur_${i}`));
    }

    // Le tableau doit être bloqué à 20
    expect(historiqueCapteurs.length).toBe(20);
    
    // Comme on fait un "unshift", le dernier ajouté (valeur_24) doit être en premier (index 0)
    expect(historiqueCapteurs[0].valeur).toBe('valeur_24');
  });

  it('devrait afficher une erreur dans la console si MQTT plante', () => {
    // On espionne la console d'erreur pour vérifier qu'elle est bien appelée
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    initMqtt();
    
    // On déclenche une erreur
    mockMqttClient.callbacks['error'](new Error('Erreur fatale test'));

    expect(consoleSpy).toHaveBeenCalledWith('❌ Erreur MQTT :', expect.any(Error));
    
    // On nettoie l'espion
    consoleSpy.mockRestore();
  });
});