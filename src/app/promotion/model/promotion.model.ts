import { StatusEnum } from '../enum/status.enum';
import { DiscountTypeEnum } from '../enum/discount-type.enum';
import { Product } from './product.model';
import { VirtualStore } from 'src/app/shared/model/price/virtual-store.model';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { Street } from 'src/app/shared/model/price/street.model';
import { GroupSalesTable } from 'src/app/shared/model/price/group-sales-table.model';
import { BranchGroup } from 'src/app/shared/model/price/branch-group.model';

export interface IdName {
    id: string;
    name: string;
}

export interface Ids {
    id: string;
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
    campaignChannel: string;
    products: Array<Product>;
    promotionType: string;
    tag: string;
    startAt: Date | string;
    status: StatusEnum;
    updatedBy: string;
    updatedDate: Date;
    branchGroups: Array<BranchGroup>;
    salesTableGroups: Array<GroupSalesTable>;
    streets: Array<Street>;
    virtualStores: Array<VirtualStore>;
    paymentTypes: Array<PaymentType>;

    constructor() {
        this.campaign = null; // TODO: VERIFICAR
        this.campaignChannel = null; // TODO: VERIFICAR
        this.createdBy = 'form@promotion'; // TODO: REMOVER
        this.createdDate = null;
        this.description = '';
        this.hierarchy = null;
        this.discountType = DiscountTypeEnum.Percentage;
        this.discountValue = 0;
        this.endAt = '';
        this.hierarchy = null;
        this.id = '';
        this.name = '';
        this.partner = null; // TODO: VERIFICAR
        this.products = new Array<Product>();
        this.promotionType = 'OPEN';
        this.tag = '';
        this.startAt = '';
        this.status = StatusEnum.Desactive;
        this.updatedBy = 'form@promotion'; // TODO: REMOVER
        this.updatedDate = null;
        this.branchGroups = new Array<BranchGroup>();
        this.salesTableGroups = new Array<GroupSalesTable>();
        this.streets = new Array<Street>();
        this.virtualStores = new Array<VirtualStore>();
        this.paymentTypes = new Array<PaymentType>();
    }

}
