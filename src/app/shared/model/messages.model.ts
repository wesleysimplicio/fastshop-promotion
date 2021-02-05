export interface Message {
  businessCode: number;
  description: string;
}

export class Messages {

  messages: Array<Message>;

  constructor() {
    this.messages = new Array<Message>();
  }
}
