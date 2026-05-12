import { Request, Response } from 'express';
import { historiqueCapteurs } from '../services/mqttservice';

// Fonction qui renvoie les données à l'application web
export const getPicoData = (req: Request, res: Response) => {
  res.json(historiqueCapteurs);
};