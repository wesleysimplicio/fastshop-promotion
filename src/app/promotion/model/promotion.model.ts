import { StatusEnum } from '../enum/status.enum';
import { DiscountTypeEnum } from '../enum/discount-type.enum';
import { Product } from './product.model';

export class Promotion {

    campaign: string;
    createdBy: string;
    createdDate: Date;
    description: string;
    discountType: DiscountTypeEnum;
    discountValue: number;
    endAt: Date | string;
    hierarchy: number;
    id: string;
    name: string;
    partner: string;
    products: Array<Product>;
    promotionType: string;
    tag: string;
    startAt: Date | string;
    status: StatusEnum;
    updatedBy: string;
    updatedDate: Date;
    branchGroups: Array<string>;
    salesTableGroups: Array<string>;
    streets: Array<string>;
    virtualStores: Array<string>;

    constructor() {
        this.campaign = '';
        this.createdBy = '';
        this.createdDate = null;
        this.description = '';
        this.hierarchy = null;
        this.discountType = DiscountTypeEnum.Percentage;
        this.discountValue = 0;
        this.endAt = '';
        this.hierarchy = null;
        this.id = '';
        this.name = '';
        this.partner = '';
        this.products = new Array<Product>();
        this.promotionType = 'OPEN';
        this.tag = '';
        this.startAt = '';
        this.status = StatusEnum.Desactive;
        this.updatedBy = '';
        this.updatedDate = null;
        this.branchGroups = new Array<string>();
        this.salesTableGroups = new Array<string>();
        this.streets = new Array<string>();
        this.virtualStores = new Array<string>();
    }

}
