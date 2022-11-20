import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { UserService } from '../services/user.service';

// Interface to manage request body of user location
interface Location {
    lat: number,
    long: number,
}

@injectable()
export class UserController {
    router: Router;

    constructor(@inject(TYPES.UserService) private userService: UserService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/createUser', async (req: Request, res: Response, next: NextFunction) => {
            if (Object.keys(req.body).length == 0) {
                res.status(400).send("Missing the user's location!");
                return;
            }

            if (!Object.keys(req.body).includes("lat") || !Object.keys(req.body).includes("long")) {
                res.status(400).send("Missing lat or long values.");
                return;
            }
            
            // Get user location
            const location: Location = req.body;

            // Create a new user
            try {
                const userId: number = await this.userService.createUser(location.lat, location.long);
                res.status(201).json({userId});
            } catch(error) {
                if(error instanceof Error) {
                    res.status(500).send(error.name + " : " + error.message);
                }  
                else {
                    res.status(500).send(String(error));
                }
            }
        });

        this.router.delete("/deleteUser", async (req: Request, res: Response, next: NextFunction) => {
            // Validate query and its parameters
            if(Object.keys(req.query).length == 0) {
                res.status(400).send("Missing query parameters!");
                return;
            }
               
            if(typeof req.query.userId != 'string') {
                res.status(400).send("UserId query parameter doesn't have the correct format!");
                return;
            }
                
            // Extract userId
            const userId: number = +(req.query.userId as String);

            // Delete a user
            try {
                await this.userService.deleteUser(userId);
                res.status(200).send("Deleted user " + userId);
            } catch(error) {
                if(error instanceof Error) {
                    res.status(500).send(error.name + " : " + error.message);
                }  
                else {
                    res.status(500).send(String(error));
                }
            }
        });

        this.router.get("/disconnectedUsers", async (req: Request, res: Response, next: NextFunction) => {
            // Validate query and its parameters
            if(Object.keys(req.query).length == 0) {
                res.status(400).send("Missing longitude and latitude query parameters!");
                return;
            }
                
            if(typeof req.query.lat != 'string' || typeof req.query.lat != 'string') {
                res.status(400).send("Longitude and latitude query parameters don't have the correct format!");
                return;
            }
            
            // Extract lat and long
            const lat: number = +(req.query.lat as String);
            const long: number = +(req.query.long as String);

            // Get list of users in a radius around our user
            try {
                const userIds: number[] = await this.userService.getDisconnectedUsers(lat, long);
                res.status(200).json({userIds : userIds});
            } catch(error) {
                if(error instanceof Error) {
                    res.status(500).send(error.name + " : " + error.message);
                }  
                else {
                    res.status(500).send(String(error));
                }
            }
        });
    }
}
