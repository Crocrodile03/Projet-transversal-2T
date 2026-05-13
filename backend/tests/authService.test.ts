import { AuthService } from '../src/services/authService';
import User from '../src/models/User';
import * as argon2 from 'argon2';

process.env.JWT_ACCESS_SECRET = 'super-secret-de-test';
// On simule Mongoose et Argon2 pour ne pas toucher à la vraie DB
jest.mock('../src/models/User');
jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {

    process.env.JWT_ACCESS_SECRET = 'super-secret-de-test';
    process.env.JWT_REFRESH_SECRET = 'super-secret-refresh';
    authService = new AuthService();
    jest.clearAllMocks(); // On remet à zéro entre chaque test
  });

  describe('login', () => {
    it('devrait retourner l\'utilisateur sans le mot de passe si les identifiants sont bons', async () => {
      // Préparation de la simulation
      const mockUser = {
        username: 'testuser',
        password: 'hashedpassword123',
        toObject: jest.fn().mockReturnValue({ username: 'testuser', password: 'hashedpassword123', role: 'admin' })
      };
      
      // On dit à Mongoose de renvoyer notre faux utilisateur
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      // On dit à Argon2 que le mot de passe correspond
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      // Exécution
      const result = await authService.login('testuser', 'bonmotdepasse');

      // Vérification
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });

    it('devrait jeter une erreur si l\'utilisateur n\'existe pas', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('inconnu', 'mdp')).rejects.toThrow('User not found');
    });

    it('devrait jeter une erreur si le mot de passe est invalide', async () => {
      const mockUser = { username: 'testuser', password: 'hashedpassword123' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false); // Faux mot de passe

      await expect(authService.login('testuser', 'mauvaismdp')).rejects.toThrow('Invalid password');
    });
  });
});