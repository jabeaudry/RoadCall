import { UserRepository } from '@app/repository/user.repository';
import { TYPES } from '@app/types';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService {

    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

    async createUser(lat: number, long: number): Promise<number> {
        return await this.userRepository.createUser(lat, long);
    }

    async deleteUser(userId: number): Promise<void> {
        await this.userRepository.deleteUser(userId);
    }

    async getDisconnectedUsers(lat: number, long: number): Promise<number[]> {
        return await this.userRepository.getDisconnectedUsers(lat, long);
    }
}
