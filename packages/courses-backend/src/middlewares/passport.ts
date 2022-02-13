import User from "@src/interfaces/user";
import {
  DatabaseUserInterface,
  UserInterface,
} from "@src/interfaces/UserInterface";
import bcrypt from "bcryptjs";
import { Express } from "express";
import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const LocalStrategy = passportLocal.Strategy;

export const configureWithPassport = (app: Express): void => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy((username: string, password: string, done) => {
      User.findOne(
        { username: username },
        (err: Error, user: DatabaseUserInterface) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      );
    })
  );

  passport.serializeUser((user: DatabaseUserInterface, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser((id: string, cb) => {
    User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
      const userInformation: UserInterface = {
        username: user.username,
        isAdmin: user.isAdmin,
        id: user._id,
      };
      cb(err, userInformation);
    });
  });

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "JWT_SECRET",
      },
      (jwtToken: Record<string, string>, done) => {
        User.findOne(
          { username: jwtToken.username },
          function (err: Error, user: UserInterface) {
            if (err) {
              return done(err, false);
            }
            if (user) {
              return done(undefined, user, jwtToken);
            } else {
              return done(undefined, false);
            }
          }
        );
      }
    )
  );

  /// end
  return;
};
