<<<<<<< HEAD
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { UserController } from './controllers/user.controller';
import { TYPES } from './types';
=======
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import { UserController } from "./controllers/user.controller";
import { TYPES } from "./types";
>>>>>>> bf2daa1949069032161118b4b3eaea13dc96b844
import { AppDataSource } from "./data-source";

@injectable()
export class Application {
  private readonly internalError: number = 500;
  app: express.Application;

  constructor(
    @inject(TYPES.UserController) private userController: UserController
  ) {
    this.app = express();

    this.config();

    this.bindRoutes();
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors());

        // SQL config
        AppDataSource.initialize().catch((error: Error) => console.log(error))
<<<<<<< HEAD
  }
  
=======
    }


  

>>>>>>> bf2daa1949069032161118b4b3eaea13dc96b844
  bindRoutes(): void {
    // Routes to bind (endpoints)
    this.app.use("/", this.userController.router);
    this.errorHandling();
  }

  private errorHandling(): void {
    // When previous handlers have not served a request: path wasn't found
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const err: Error = new Error("Not Found");
        next(err);
      }
    );

    // development error handler
    // will print stacktrace
    if (this.app.get("env") === "development") {
      this.app.use(
        (
          err: any,
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          res.status(err.status || this.internalError);
          res.send({
            message: err.message,
            error: err,
          });
        }
      );
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.status(err.status || this.internalError);
        res.send({
          message: err.message,
          error: {},
        });
      }
    );
  }
}
