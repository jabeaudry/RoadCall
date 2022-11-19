// import { TYPES } from '@app/types';
import { /*inject,*/injectable } from 'inversify';

@injectable()
export class UserService {
    // clientMessages: Message[];
    constructor() {
        // this.clientMessages = [];
    }

    about(): String {
        return "Hello world!"
    }

    // async helloWorld(): Promise<Message> {
    //     return this.dateService
    //         .currentTime()
    //         .then((timeMessage: Message) => {
    //             return {
    //                 title: 'Hello world',
    //                 body: 'Time is ' + timeMessage.body,
    //             };
    //         })
    //         .catch((error: unknown) => {
    //             console.error('There was an error!!!', error);

    //             return {
    //                 title: 'Error',
    //                 body: error as string,
    //             };
    //         });
    // }
}
