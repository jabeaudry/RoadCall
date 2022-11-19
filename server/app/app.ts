import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { UserController } from './controllers/user.controller';
import { TYPES } from './types';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;

    constructor(
        @inject(TYPES.UserController) private userController: UserController,
    ) {
        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());

        // SQL config
        AppDataSource.initialize().then(async () => {
            console.log("Inserting a new user into the database...")
            const user = new User()
            user.firstName = "Alexandre"
            user.lat = 0
            user.long = 0
            user.connected = false
            await AppDataSource.manager.save(user)
            console.log("Saved a new user with id: " + user.id)
        
            console.log("Loading users from the database...")
            const users = await AppDataSource.manager.find(User)
            console.log("Loaded users: ", users)
        }).catch(error => console.log(error))
    }

    bindRoutes(): void {
        // Routes to bind (endpoints)
        this.app.use('/', this.userController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
