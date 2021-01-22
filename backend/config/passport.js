import pkg from 'passport-google-oauth20';
import {env} from 'dotenv'
const { Strategy: GoogleStrategy } = pkg;
import mongoose from 'mongoose';

import User from '../models/userModel.js';

export default function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: '189765069797-u5kjgomphcf0u4uobegp405ikmeilnnr.apps.googleusercontent.com',
                clientSecret: 'QY1noYns73kSKV4150B1HKRJ',
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });
                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}
