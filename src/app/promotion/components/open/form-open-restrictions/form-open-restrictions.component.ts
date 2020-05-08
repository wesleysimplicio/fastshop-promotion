import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { PriceService } from 'src/app/shared/services/price.service';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { Promotion } from '../../../model/promotion.model';

@Component({
  selector: 'app-form-open-restrictions',
  templateUrl: './form-open-restrictions.component.html',
  styleUrls: ['./form-open-restrictions.component.scss']
})
export class FormOpenRestrictionsComponent implements OnInit {

  breadcrumbs = [];
  routeId: any;
  isEditStep = false;
  onlySave: boolean;
  showPayment = false;
  paymentTypes = new Array<PaymentType>();
  showModalPayment = false;
  selecteds = [];
  promotion: Promotion;
  submitted = false;
  title = 'Tipos de pagamento';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
  ) {
    this.promotion = new Promotion();
    this.routeId = this.route.snapshot.params.id;
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/open',
        label: 'Vitrine'
      },
      {
        url: '/promotion/open/edit/' + this.routeId,
        label: 'Cadastro'
      },
      {
        url: '',
        label: 'Restrições'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;

    }

    this.isEditStep = true;
    this.getPaymentTypePrice();

    this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
        if (this.promotion.paymentTypes && this.promotion.paymentTypes.length > 0) {
          this.showPayment = true;
          this.selecteds = this.promotion.paymentTypes;
        }
      });


  }

  getPaymentTypePrice() {
    this.priceService.getPaymentType().subscribe(
      (res) => {
        this.paymentTypes = res.body;
        console.log('PaymentType Carregado', this.paymentTypes);
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  togglePayment() {
    if (!this.showPayment) {
      this.showPayment = true;
    } else {
      this.showPayment = false;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }

    if (this.showPayment) {

      this.promotion.paymentTypes = this.selecteds;
      this.promotion.updatedBy = 'form@promotion'; // TODO: REMOVER

      console.log('Enviado', this.promotion);

      this.promotionService.addUpdatePromotion(this.promotion).subscribe(
        (res) => {
          if (this.onlySave) {
            this.router.navigate(['/promotion/open']);
          } else {
            this.router.navigate(['/promotion/open/form/stocks/' + res.body.id]);
          }
          this.toastrService.success('Salvo com sucesso');
        },
        (err: any) => {
          this.submitted = false;
          err.error.messages.forEach(element => {
            this.toastrService.error(element.description);
          });
        }
      );
    } else {
      this.router.navigate(['/promotion/open/form/stocks/' + this.routeId]);
    }

  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/open']);
  }

  onBack() {
    this.router.navigate(['/promotion/open/edit/' + this.routeId]);
  }

  selection(event) {
    console.log(event);

    this.selecteds = event;
    this.showModalPayment = false;
  }

  remove(index) {
    this.selecteds.splice(index, 1);
  }

}
