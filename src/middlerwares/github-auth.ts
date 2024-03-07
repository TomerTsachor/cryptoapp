import config from "config";
import passport from "passport";
import { Strategy, Profile } from 'passport-github2';
import getModel from "../models/user/factory";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.use(new Strategy({...config.get('github')}, async function (accessToken, refreshToken, profile: Profile, done) {
    try {
        const githubId = profile.id;
        let user = await getModel().get(githubId);
        if (!user) user = await getModel().signup({ githubId });
        if (!user) return done(null, false);
        return done(null, user);
    } catch (err) {
        done(err);
    }
}))

export default passport;