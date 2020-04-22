export class VirtualStore {
    id: string;
    name: string;
    description: string;
    idsIdentifier: string[];
    error: any;
    messageError: any;

    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.idsIdentifier = [];
        this.error = null;
        this.messageError = null;
    }
}
