var mockRun: any;
var mockAll: any;

jest.mock('better-sqlite3', () => {
  const mRun = jest.fn();
  const mAll = jest.fn();
  mockRun = mRun;
  mockAll = mAll;

  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn().mockReturnValue({
      run: mRun,
      all: mAll,
    }),
  }));
});

import Mesure from '../src/models/Mesure';

describe('Modèle Mesure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sauvegarde', () => {
    it('devrait sauvegarder une mesure correctement', () => {
      const mesure = new Mesure({ topic: 'pico/temp', valeur: '24.5', heure: '12:00:00' });
      
      // Contrairement à User, la méthode save() de Mesure n'est pas async
      mesure.save();

      expect(mockRun).toHaveBeenCalledWith('pico/temp', '24.5', '12:00:00');
    });
  });

  describe('findRecent', () => {
    it('devrait retourner un tableau de mesures avec la limite par défaut', () => {
      const faussesMesures = [
        { topic: 'pico/temp', valeur: '24.5', heure: '12:00:00' },
        { topic: 'pico/hum', valeur: '40', heure: '12:01:00' }
      ];
      mockAll.mockReturnValueOnce(faussesMesures);

      const result = Mesure.findRecent();

      expect(mockAll).toHaveBeenCalledWith(50); // Limite par défaut
      expect(result).toEqual(faussesMesures);
    });

    it('devrait respecter la limite demandée', () => {
      mockAll.mockReturnValueOnce([]);
      Mesure.findRecent(10);
      expect(mockAll).toHaveBeenCalledWith(10);
    });
  });
});