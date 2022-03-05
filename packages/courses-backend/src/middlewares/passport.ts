import { UserModel } from "@models/UserModel";
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
      secret: Process.env.SECRET_SESSION_KEY || "ASSIGN_ME",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy((username: string, password: string, done) => {
      logger.debug("auth user", username);

      UserModel.findOne(
        { username: username },
        (err: Error, user: DatabaseUserInterface) => {
          if (err) {
            logger.error(err);
            throw err;
          }

          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) {
              logger.error(err);
              throw err;
            }

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
    UserModel.findOne(
      { _id: id },
      (err: Error, user: DatabaseUserInterface) => {
        const userInformation: UserInterface = {
          username: user.username,
          isAdmin: user.isAdmin,
          id: user.id,
        };
        cb(err, userInformation);
      }
    );
  });

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: Process.env.JWT_ACCESS_SECRET,
      },
      (jwtToken: Record<string, string>, done) => {
        UserModel.findOne(
          { username: jwtToken.username },
          function (err: Error, user: UserInterface) {
            if (err) {
              logger.error(err);
              return done(err, false);
            }
            if (user) {
              return done(undefined, user, jwtToken);
            } else {
              logger.error(`user  ${jwtToken.username} not found `);
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
