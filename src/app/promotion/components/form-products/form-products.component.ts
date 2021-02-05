import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { ResponseProducts } from 'src/app/shared/model/promotion/responses/form-products/response-products.model';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-form-products',
  templateUrl: './form-products.component.html',
  styleUrls: ['./form-products.component.scss']
})
export class FormProductsComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  routeId: any;
  search = '';
  breadcrumbs = new Array<IBreadcrumb>();
  showResponse = false;
  responseProducts: ResponseProducts;
  isDisabledSend = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  typePromo: string;
  viewErros = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilValidation: UtilValidation,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private utilities: UtilitiesService
  ) {
    this.routeId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      if (params['id'] !== this.routeId) {
        this.routeId = params['id'];
        window.location.reload();
      }
    });
    this.typePromo = this.route.snapshot.params.typePromo;

    this.search = window.localStorage.getItem('PROMO_SEARCH');

    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/' + this.typePromo,
        label: 'Vitrine'
      },
      {
        url: '/promotion/' + this.typePromo + '/step1/' + this.routeId,
        label: 'Cadastro'
      },
      {
        url: '',
        label: 'Propriedades'
      },
    );
  }

  ngOnInit() {
    if (this.routeId === 'undefined' || !this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;
    }

    this.buildForm();
    // this.responseProducts = {"result":[{"products":[{"createdBy":null,"createdDate":"2020-09-11T14:08:45.698","updatedBy":null,"updatedDate":null,"prd":"ARLN72_PRD","sku":"ARLN72_220","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:46.721","updatedBy":null,"updatedDate":null,"prd":"BDFRYERBPTO_PRD","sku":"BDFRYERBPTO2","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:46.743","updatedBy":null,"updatedDate":null,"prd":"BDFRYERBPTO_PRD","sku":"BDFRYERBPTO1","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:45.478","updatedBy":null,"updatedDate":null,"prd":"ARLN72_PRD","sku":"ARLN72_110","discountValue":null,"status":"ENABLE","statusDescription":null}],"successDetails":[{"lineNumber":2,"line":"ARLN72_PRD;34;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":3,"line":"ARLN72_110;4444;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":4,"line":"ARLN72_220;123.45;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":5,"line":"BDFRYERBPTO1;-1;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":6,"line":"BDFRYERBPTO1;876a.99;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":7,"line":"BDFRYERBPTO2;;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":8,"line":"BDFRYERBPTO1;876.999;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":9,"line":"BDFRYERBPTO1;811111111111111111111176.999;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":14,"line":"BDFRYERBPTO2;345.12;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":15,"line":"BDFRYERBPTO1;876.99;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}}],"errorsDetails":[{"lineNumber":10,"line":"","messageResponse":{"businessCode":-110,"description":"O campo 'SKU' nÃ£o foi informado"}},{"lineNumber":11,"line":"AgorNao;333;","messageResponse":{"businessCode":-112,"description":"Erro SKU nÃ£o existe no catalogo"}},{"lineNumber":12,"line":";2332","messageResponse":{"businessCode":-110,"description":"O campo 'SKU' nÃ£o foi informado"}},{"lineNumber":13,"line":"AAA_PRD;333;","messageResponse":{"businessCode":-112,"description":"Erro SKU nÃ£o existe no catalogo"}}],"summary":{"totalProductsIncluded":4,"totalLinesSuccess":10,"totalLinesErrors":4}}],"messages":[{"businessCode":0,"description":"Upload realizado com sucesso","attribute":"promoção-downloads-teste"}]};
    // this.responseProducts = {"products":[{"createdBy":null,"createdDate":"2020-09-11T14:08:45.698","updatedBy":null,"updatedDate":null,"prd":"ARLN72_PRD","sku":"ARLN72_220","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:46.721","updatedBy":null,"updatedDate":null,"prd":"BDFRYERBPTO_PRD","sku":"BDFRYERBPTO2","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:46.743","updatedBy":null,"updatedDate":null,"prd":"BDFRYERBPTO_PRD","sku":"BDFRYERBPTO1","discountValue":null,"status":"ENABLE","statusDescription":null},{"createdBy":null,"createdDate":"2020-09-11T14:08:45.478","updatedBy":null,"updatedDate":null,"prd":"ARLN72_PRD","sku":"ARLN72_110","discountValue":null,"status":"ENABLE","statusDescription":null}],"successDetails":[{"lineNumber":2,"line":"ARLN72_PRD;34;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":3,"line":"ARLN72_110;4444;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":4,"line":"ARLN72_220;123.45;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":5,"line":"BDFRYERBPTO1;-1;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":6,"line":"BDFRYERBPTO1;876a.99;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":7,"line":"BDFRYERBPTO2;;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":8,"line":"BDFRYERBPTO1;876.999;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":9,"line":"BDFRYERBPTO1;811111111111111111111176.999;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":14,"line":"BDFRYERBPTO2;345.12;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}},{"lineNumber":15,"line":"BDFRYERBPTO1;876.99;","messageResponse":{"businessCode":1,"description":"Produto incluido com sucesso"}}],"errorsDetails":[{"lineNumber":10,"line":"","messageResponse":{"businessCode":-110,"description":"O campo 'SKU' nÃ£o foi informado"}},{"lineNumber":11,"line":"AgorNao;333;","messageResponse":{"businessCode":-112,"description":"Erro SKU nÃ£o existe no catalogo"}},{"lineNumber":12,"line":";2332","messageResponse":{"businessCode":-110,"description":"O campo 'SKU' nÃ£o foi informado"}},{"lineNumber":13,"line":"AAA_PRD;333;","messageResponse":{"businessCode":-112,"description":"Erro SKU nÃ£o existe no catalogo"}}],"summary":{"totalProductsIncluded":4,"totalLinesSuccess":10,"totalLinesErrors":4}};
  }

  get pF() { return this.productForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isDisabledSend = true;
    if (
      !this.isFormsValid()
    ) {
      this.isDisabledSend = false;
      return;
    }
    this.utilities.showLoading(true);

    this.promotionService.addPromotionProduct(this.routeId, this.productForm.get('file').value).then(
      (res: any) => {
        this.isDisabledSend = false;
        res.result[0].products.forEach(element => {
          if (element.discountValue) {
            element.discountValue = element.discountValue.toFixed(2);
          }
        });
        this.responseProducts = res.result[0];
        this.showResponse = true;
        this.verifyAuthoritiesMessage(res);
        // this.toastrService.success('Arquivo enviado com sucesso');
        this.utilities.showLoading(false);

      },
      (err: any) => {
        this.utilities.showLoading(false);

        this.isDisabledSend = false;
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );

  }

  setFile(event: EventTarget): void {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = target.files;

    if (files[0].type === 'text/csv' || files[0].type === 'application/vnd.ms-excel') {
      this.productForm.get('file').setValue(files[0]);
    } else {
      this.toastrService.warning('Por favor selecionar arquivo no formato csv.');
      this.cleanData();
      window.scrollTo(0, 0);
    }
  }

  cleanData(): void {
    this.productForm.reset();
    this.productForm.updateValueAndValidity();
    this.productForm.markAsTouched();
  }

  isFormsValid() {
    if (
      !this.productForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.productForm);
      this.toastrService.warning('Formulário inválido');
      return false;
    }
    return true;
  }

  buildForm() {
    this.productForm = this.formBuilder.group({
      file: ['', Validators.required],
    });
  }

  onBack() {
    this.submitted = false;
    this.productForm.reset();
    this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/' + this.typePromo + '/']);
  }

  onProducts() {
    this.router.navigate(['/promotion/' + this.typePromo + '/products/' + this.routeId]);
  }

  private verifyAuthoritiesMessage(data): void {
    if (data && data.messages && data.messages[0].businessCode < 0) {
      this.toastrService.error(data.messages[0].description);
      return;
    }
    this.toastrService.success(data.messages[0].description);
  }

  returnMock(): any {
    return {
        result: [
            {
              id: '5f578c3c1f7e7e3400c71414',
              name: 'Teste Promo LP Nova 200',
              description: 'LPNova200',
              tag: 'LPN200',
              hierarchy: 99,
              status: 'DISABLE',
              startAt: '2020-09-03T14:34:00',
              discountType: 'PERCENTAGE',
              discountValue: 99,
              promotionType: 'OPEN',
              cumulative: false,
              createdBy: 'tlidiojpn',
              createdDate: '2020-09-08T10:50:52.303'
            }
        ],
        messages: [
            {
                businessCode: -1,
                description: 'Promoção criada com sucesso, porém sem permissão para atribuir status Ativa: ',
                attribute: 'Teste Promo LP Nova 200'
            }
        ]
    };

  }

  downloadFiles() {
    this.promotionService.downloadFiles(this.routeId).subscribe(res => {
      console.log(res);
      this.saveFile(res.body, 'Promocao');
    });
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    fileSaver.saveAs(blob, filename + '.xlsx');
  }




}
