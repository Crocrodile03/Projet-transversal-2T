
var mockRun: any;
var mockGet: any;

jest.mock('better-sqlite3', () => {
  const mRun = jest.fn();
  const mGet = jest.fn();
  mockRun = mRun;
  mockGet = mGet;

  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn().mockReturnValue({
      run: mRun,
      get: mGet,
    }),
  }));
});

import Log from '../src/models/Log';

describe('Modèle Log', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sauvegarde', () => {
    it('devrait sauvegarder ou remplacer un log', async () => {
      const log = new Log({ nom: 'Pico1', heure: '14:30:00', etat: 'connecté' });
      await log.save();

      expect(mockRun).toHaveBeenCalledWith('Pico1', '14:30:00', 'connecté');
    });
  });

  describe('findOne', () => {
    it('devrait trouver un log par son nom', async () => {
      mockGet.mockReturnValueOnce({ nom: 'Pico1', heure: '14:30:00', etat: 'connecté' });

      const log = await Log.findOne({ nom: 'Pico1' });

      expect(mockGet).toHaveBeenCalledWith('Pico1');
      expect(log).toBeInstanceOf(Log);
      expect(log?.etat).toBe('connecté');
    });

    it('devrait retourner null si le log n\'existe pas', async () => {
      mockGet.mockReturnValueOnce(undefined);

      const log = await Log.findOne({ nom: 'Introuvable' });
      expect(log).toBeNull();
    });

    it('devrait retourner null si aucun paramètre de recherche n\'est passé', async () => {
      const log = await Log.findOne({});
      expect(log).toBeNull();
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('toObject', () => {
    it('devrait formater l\'objet correctement', () => {
      const log = new Log({ nom: 'Pico1', heure: '14:30:00', etat: 'connecté' });
      expect(log.toObject()).toEqual({ nom: 'Pico1', heure: '14:30:00', etat: 'connecté' });
    });
  });
});