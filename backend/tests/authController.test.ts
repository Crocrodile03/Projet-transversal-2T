import { Request, Response } from "express";
import { login, register } from "../src/controllers/authController";
import { AuthService } from "../src/services/authService";

// On demande à Jest de remplacer le vrai AuthService par un faux (Mock)
jest.mock("../src/services/authService");

describe("Auth Controller", () => {
  // On prépare nos faux objets Express
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      // mockReturnThis permet de faire chainage comme res.status(200).json()
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    // On remet les compteurs à zéro entre chaque test
    jest.clearAllMocks();
  });

  // --- TESTS POUR LA FONCTION LOGIN ---
  describe("Fonction login", () => {
    it("devrait retourner une erreur 400 s'il manque des informations", async () => {
      mockReq.body = { username: "Crocrodile" }; // Il manque le password
      
      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username and password are required" });
    });

    it("devrait retourner 200 et l'utilisateur en cas de succès", async () => {
      mockReq.body = { username: "Crocrodile", password: "mdp" };
      
      // On s'attend à ce que le service crée un token
      const fauxUser = { accessToken: "un-faux-token-jwt" }; 
      (AuthService.prototype.login as jest.Mock).mockResolvedValue(fauxUser);

      await login(mockReq as Request, mockRes as Response);

      // On vérifie que le contrôleur a bien renvoyé ce token !
      expect(mockRes.json).toHaveBeenCalledWith({ accessToken: "un-faux-token-jwt" });
    });
    
    it("devrait retourner 401 si les identifiants sont mauvais", async () => {
      mockReq.body = { username: "Crocrodile", password: "mauvaismdp" };

      // On force le service à jeter une erreur
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error("User not found"));

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  // --- TESTS POUR LA FONCTION REGISTER ---
  describe("Fonction register", () => {
    it("devrait retourner une erreur 400 s'il manque des informations", async () => {
      mockReq.body = { password: "mdp" }; // Il manque le username
      
      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username and password are required" });
    });

    it("devrait retourner 201 et créer l'utilisateur en cas de succès", async () => {
      mockReq.body = { username: "Nouveau", password: "mdp" };
      const nouvelUser = { username: "Nouveau" };

      // On force la fausse fonction register du service à réussir
      (AuthService.prototype.register as jest.Mock).mockResolvedValue(nouvelUser);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(nouvelUser);
    });

    it("devrait retourner 400 si l'inscription échoue (ex: user déjà existant)", async () => {
      mockReq.body = { username: "Existant", password: "mdp" };

      // On force le service à jeter une erreur
      (AuthService.prototype.register as jest.Mock).mockRejectedValue(new Error("Username already taken"));

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username already taken" });
    });
  });
});