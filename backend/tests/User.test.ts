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

import User from '../src/models/User';

describe('Modèle User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Création et sauvegarde', () => {
    it('devrait créer un utilisateur et le sauvegarder', async () => {
      const user = new User({ username: 'Alice', password: 'mdp' });
      await user.save();

      expect(mockRun).toHaveBeenCalledWith('Alice', 'mdp');
      expect(user.username).toBe('Alice');
    });

    it('devrait jeter une erreur si le username est déjà pris', async () => {
      const user = new User({ username: 'Bob', password: 'mdp' });
      
      // On simule l'erreur SQLite "UNIQUE constraint failed"
      mockRun.mockImplementationOnce(() => {
        throw new Error('UNIQUE constraint failed: User.username');
      });

      await expect(user.save()).rejects.toThrow('Username already taken');
    });

    it('devrait jeter une erreur standard si la DB plante pour une autre raison', async () => {
      const user = new User({ username: 'Bob', password: 'mdp' });
      mockRun.mockImplementationOnce(() => {
        throw new Error('Disk full');
      });

      await expect(user.save()).rejects.toThrow('Disk full');
    });
  });

  describe('findOne', () => {
    it('devrait retourner l\'utilisateur s\'il est trouvé', async () => {
      mockGet.mockReturnValueOnce({ username: 'Alice', password: 'mdp' });

      const user = await User.findOne({ username: 'Alice' });

      expect(mockGet).toHaveBeenCalledWith('Alice');
      expect(user).toBeInstanceOf(User);
      expect(user?.username).toBe('Alice');
    });

    it('devrait retourner null si l\'utilisateur n\'existe pas', async () => {
      mockGet.mockReturnValueOnce(undefined);

      const user = await User.findOne({ username: 'Inconnu' });
      expect(user).toBeNull();
    });

    it('devrait retourner null si aucun username n\'est fourni', async () => {
      const user = await User.findOne({});
      expect(user).toBeNull();
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('toObject', () => {
    it('devrait retourner un objet simple', () => {
      const user = new User({ username: 'Alice', password: 'mdp' });
      expect(user.toObject()).toEqual({ username: 'Alice', password: 'mdp' });
    });
  });
});