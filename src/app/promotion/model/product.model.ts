import { StatusEnum } from '../enum/status.enum';

export class Product {

    prd: string;
    sku: string;
    status: StatusEnum;

    constructor() {
        this.prd = '';
        this.sku = '';
        this.status = StatusEnum.Active;
    }

}
