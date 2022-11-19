import { AppDataSource } from '@app/data-source';
import { User } from '@app/entity/User';
import { injectable } from 'inversify';
import { Repository } from 'typeorm';

@injectable()
export class UserRepository {
    private userOrmRepository : Repository<User>;

    constructor() {
        this.userOrmRepository = AppDataSource.getRepository(User)
    }

    // Creates a new user and returns his id
    async createUser(lat: number, long: number): Promise<number> { 
        const user = new User();
        user.firstName = "Alexandre";
        user.lat = lat;
        user.long - long;
        user.connected = false;
        await this.userOrmRepository.save(user);
        return user.id;
    }

    // Deletes a user based on his id
    async deleteUser(userId: number): Promise<void> {
        const users : User[] = await this.userOrmRepository.find({
            where: {
                id: userId,
            },
        });
        if (users.length == 1){
            await this.userOrmRepository.remove(users[0]);
        } else {
            throw new Error("Unable to find the user " + userId + " to delete.")
        }
        
    }

    // Gets a list of disconnected users
    async getDisconnectedUsers(lat: number, long: number): Promise<User[]> {
        // Set the radius around our user with boundaries (~ 10km radius)
        const upperBoundLat: number = lat + 0.1;
        const lowerBoundLat: number = lat - 0.1;
        const upperBoundLong: number = long + 0.1;
        const lowerBoundLong: number = long - 0.1;

        // Query user table to find users within our bounds
        return await this.userOrmRepository.createQueryBuilder("user")
            .where("user.connected = :disconnected", { disconnected: false })
            .andWhere("user.lat >= :lowerBoundLat", { lowerBoundLat })
            .andWhere("user.lat <= :upperBoundLat", { upperBoundLat })
            .andWhere("user.long >= :lowerBoundLong", { lowerBoundLong })
            .andWhere("user.long <= :upperBoundLong", { upperBoundLong }).getMany();
    }
}
