import { Message } from './message.model';

export class Messages {

    messages: Array<Message>;

    constructor() {
        this.messages = new Array<Message>();
    }
}