import User from "@models/User";
import {
  DatabaseUserInterface,
  UserInterface,
} from "@src/interfaces/UserInterface";
import bcrypt from "bcryptjs";
import { Express } from "express";
import session from "express-session";
import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import * as Process from "process";
import { Logger } from "tslog";
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const LocalStrategy = passportLocal.Strategy;
const logger: Logger = new Logger({ name: `configureWithPassport-logger` });

export const configureWithPassport = (app: Express): void => {
  app.use(
    session({
      secret: Process.env.SECRET_SESSION_KEY!,
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy((username: string, password: string, done) => {
      User.findOne(
        { username: username },
        (err: Error, user: DatabaseUserInterface) => {
          if (err) throw err;
          logger.error(err);
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err;
            logger.error(err);
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
    cb(null, user.id);
  });

  passport.deserializeUser((id: string, cb) => {
    User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
      const userInformation: UserInterface = {
        username: user.username,
        isAdmin: user.isAdmin,
        id: user.id,
      };
      cb(err, userInformation);
    });
  });

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: Process.env.JWT_SECRET,
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
