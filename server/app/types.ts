// Types for our server (for DI using Inversify)
export const TYPES = {
    Server: Symbol('Server'),
    Application: Symbol('Application'),
    UserController: Symbol('UserController'),
    UserService: Symbol('UserService'),
    UserRepository: Symbol('UserRepository'),
};
