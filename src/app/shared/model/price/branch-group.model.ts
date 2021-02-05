export class BranchGroup {
    id: string;
    name: string;
    description: string;
    branches: string[];
    error: any;
    messageError: any;

  constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.branches = [];
        this.error = null;
        this.messageError = null;
    }
}
