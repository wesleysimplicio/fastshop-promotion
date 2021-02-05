import { Detail } from './detail.model';
import { Product } from 'src/app/promotion/model/product.model';
import { Summary } from './summary.model';

export class ResponseProducts {

    errorsDetails: Array<Detail>;
    products: Array<Product>;
    successDetails: Array<Detail>;
    summary: Summary;

    constructor() {
        this.errorsDetails = new Array<Detail>();
        this.products = new Array<Product>();
        this.successDetails = new Array<Detail>();
        this.summary = new Summary();
    }
}