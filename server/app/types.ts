// Types for our server (for DI using Inversify)
export const TYPES = {
    Server: Symbol('Server'),
    Application: Symbol('Application'),
    IndexController: Symbol('IndexController'),
    IndexService: Symbol('IndexService'),
};
