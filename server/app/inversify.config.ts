import "reflect-metadata";
import { UserController } from '@app/controllers/user.controller';
import { UserService } from '@app/services/user.service';
import { UserRepository } from '@app/repository/user.repository';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

// Inversify config, bind types to the types declared in Types.ts for DI
export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind(TYPES.UserController).to(UserController);
    container.bind(TYPES.UserService).to(UserService);
    container.bind(TYPES.UserRepository).to(UserRepository);

    return container;
};
