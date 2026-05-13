import { Request, Response } from 'express';
import Mesure from '../models/Mesure';

// Fonction qui renvoie les données à l'application web
export const getPicoData = (_req: Request, res: Response) => {
  res.json(Mesure.findRecent(50));
};