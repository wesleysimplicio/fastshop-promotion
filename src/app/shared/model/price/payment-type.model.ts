export interface Installments {
    installment: number;
    legacyId: string;
}

export class PaymentType {
    id: string;
    name: string;
    description: string;
    allowInstallment: boolean;
    allowFlag: boolean;
    allowbilledPayment: boolean;
    error: boolean;
    installments: Installments[];
    allowBin: boolean;
    legacyId: string;
    allowMarketplace: boolean;
    allowM1: boolean;
    allowClickCollect: boolean;
    allowDeliveryType: boolean;
    allowCombineSameType: boolean;
    deliveriesTypes: string[];

  constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.allowInstallment = false;
        this.allowFlag = false;
        this.allowbilledPayment = false;
        this.error = false;
        this.installments = [];
        this.allowBin = false;
        this.legacyId = '';
        this.allowMarketplace = false;
        this.allowM1 = false;
        this.allowClickCollect = false;
        this.allowDeliveryType = false;
        this.allowCombineSameType = false;
        this.deliveriesTypes = [];
    }
}