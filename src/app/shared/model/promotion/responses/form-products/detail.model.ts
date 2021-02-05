import { Message } from '../../../messages.model';

export class Detail {
    
    line: string;
    lineNumber: number;
    messageResponse: Message;

  constructor(){
        this.line = '';
        this.lineNumber = null;
        this.messageResponse = null;
    }
}