import { StatusEnum } from '../enum/status.enum';

export class Product {

    prd: string;
    sku: string;
    status: StatusEnum;
    fixedPrice: number;
    createdBy: Date;
    createdDate: Date;
    updatedBy: Date;
    updatedDate: Date;

    constructor() {
        this.prd = '';
        this.sku = '';
        this.status = StatusEnum.Active;
        this.fixedPrice = null;
        this.createdBy = null;
        this.createdDate = null;
        this.updatedBy = null;
        this.updatedDate = null;
    }
}
