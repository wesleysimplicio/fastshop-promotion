import { StatusEnum } from '../enum/status.enum';
import { DiscountTypeEnum } from '../enum/discount-type.enum';
import { Product } from './product.model';

export interface IdName {
    id: string;
    name: string;
}

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
    branchGroups: Array<IdName>;
    salesTableGroups: Array<IdName>;
    streets: Array<IdName>;
    virtualStores: Array<IdName>;
    paymentType: Array<IdName>;

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
        this.branchGroups = new Array<IdName>();
        this.salesTableGroups = new Array<IdName>();
        this.streets = new Array<IdName>();
        this.virtualStores = new Array<IdName>();
        this.paymentType = new Array<IdName>();
    }

}
