export class Street {
    id: string;
    street: string;
    description: string;
    error: any;
    messageError: any;

  constructor() {
        this.id = '';
        this.street = '';
        this.description = '';
        this.error = null;
        this.messageError = null;
    }
}
