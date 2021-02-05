export class GroupSalesTable {
    id: string;
    name: string;
    description: string;
    paymentGroupSalesTable: string[];
    error: any;
    messageError: any;

    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.paymentGroupSalesTable = [];
        this.error = null;
        this.messageError = null;
    }
}
