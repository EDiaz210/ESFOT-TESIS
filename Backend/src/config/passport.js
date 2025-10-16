import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Estudiantes from "../models/Estudiante.js"
import dotenv from 'dotenv'
import bcrypt from "bcryptjs"
dotenv.config()


// SERIALIZE / DESERIALIZE
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Estudiantes.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// GOOGLE STRATEGY
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await Estudiantes.findOne({ avatarUsuarioID: profile.id });
    if (user) return done(null, user);
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash("google", salt);

    user = await Estudiantes.create({
      username: profile.displayName,
      email: profile.emails?.[0]?.value || 'sinemail@google.com',
      nombre: profile.name?.givenName || '',
      apellido: profile.name?.familyName || '',
      password: passwordEncriptada, 
      avatarUsuario: profile.photos && profile.photos[0].value,
      avatarUsuarioID: profile.id
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


