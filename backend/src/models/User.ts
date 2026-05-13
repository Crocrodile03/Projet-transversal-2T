import mongoose from 'mongoose';

// Définition de la structure de l'utilisateur dans la base de données
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Tu pourras rajouter d'autres champs ici plus tard si besoin (nom, rôle, etc.)
}, { 
  timestamps: true 
});

// Création et exportation du modèle
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;