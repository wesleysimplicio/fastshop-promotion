import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { ResponseProducts } from 'src/app/shared/model/promotion/responses/form-products/response-products.model';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-form-open-products',
  templateUrl: './form-open-products.component.html',
  styleUrls: ['./form-open-products.component.scss']
})
export class FormOpenProductsComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  routeId: any;
  breadcrumbs = new Array<IBreadcrumb>();
  showResponse = false;
  responseProducts: ResponseProducts;
  isDisabledSend = false;
  // responseProducts = { "products": [{ "createdBy": null, "createdDate": "2020-05-08T13:42:25.453", "updatedBy": null, "updatedDate": null, "prd": "ARLN72_PRD", "sku": "ARLN72_220", "fixedPrice": 123.45, "status": "ENABLE" }, { "createdBy": null, "createdDate": "2020-05-08T13:42:26.695", "updatedBy": null, "updatedDate": null, "prd": "AAA_PRD", "sku": "AAA_PRD", "fixedPrice": 333, "status": "ENABLE" }, { "createdBy": null, "createdDate": "2020-05-08T13:42:26.724", "updatedBy": null, "updatedDate": null, "prd": "BDFRYERBPTO_PRD", "sku": "BDFRYERBPTO1", "fixedPrice": 876.99, "status": "ENABLE" }, { "createdBy": null, "createdDate": "2020-05-08T13:42:26.71", "updatedBy": null, "updatedDate": null, "prd": "BDFRYERBPTO_PRD", "sku": "BDFRYERBPTO2", "fixedPrice": 345.12, "status": "ENABLE" }, { "createdBy": null, "createdDate": "2020-05-08T13:42:25.438", "updatedBy": null, "updatedDate": null, "prd": "ARLN72_PRD", "sku": "ARLN72_110", "fixedPrice": 4444, "status": "ENABLE" }], "successDetails": [{ "lineNumber": 2, "line": "ARLN72_PRD;34;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }, { "lineNumber": 3, "line": "ARLN72_110;4444;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }, { "lineNumber": 4, "line": "ARLN72_220;123.45;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }, { "lineNumber": 13, "line": "AAA_PRD;333;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }, { "lineNumber": 14, "line": "BDFRYERBPTO2;345.12;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }, { "lineNumber": 15, "line": "BDFRYERBPTO1;876.99;", "messageResponse": { "businessCode": 1, "description": "Produto incluido com sucesso" } }], "errorsDetails": [{ "lineNumber": 5, "line": "BDFRYERBPTO1;-1;", "messageResponse": { "businessCode": -115, "description": "No campo 'FIXED PRICE', informar valor em reais entre '0.01' a '999999999.99'" } }, { "lineNumber": 6, "line": "BDFRYERBPTO1;876a.99;", "messageResponse": { "businessCode": -5, "description": "O campo 'FIXED PRICE' deve ser numérico" } }, { "lineNumber": 7, "line": "BDFRYERBPTO2;;", "messageResponse": { "businessCode": -113, "description": "O campo 'FIXED PRICE' não foi informado" } }, { "lineNumber": 8, "line": "BDFRYERBPTO1;876.999;", "messageResponse": { "businessCode": -5, "description": "O campo 'FIXED PRICE' deve ter no máximo '2' dígitos fracionários e no máximo '9' dígitos inteiros" } }, { "lineNumber": 9, "line": "BDFRYERBPTO1;811111111111111111111176.999;", "messageResponse": { "businessCode": -5, "description": "O campo 'FIXED PRICE' deve ter no máximo '2' dígitos fracionários e no máximo '9' dígitos inteiros" } }, { "lineNumber": 10, "line": "", "messageResponse": { "businessCode": -110, "description": "O campo 'SKU' não foi informado" } }, { "lineNumber": 11, "line": "AgorNao;333;", "messageResponse": { "businessCode": -112, "description": "Erro SKU não existe no catalogo" } }, { "lineNumber": 12, "line": ";2332", "messageResponse": { "businessCode": -110, "description": "O campo 'SKU' não foi informado" } }], "summary": { "totalProductsIncluded": 5, "totalLinesSuccess": 6, "totalLinesErrors": 8 } };
  showPrice = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilValidation: UtilValidation,
    private toastrService: ToastrService,
    private promotionService: PromotionService
  ) {
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
        label: 'Propriedades'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;
    }

    this.buildForm();
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

    this.promotionService.addPromotionProduct(this.routeId, this.productForm.get('file').value).subscribe(
      (res) => {
        this.isDisabledSend = false;
        // Redireciona para produtos da promocao
        // this.router.navigate(['/promotion/open/products/' + this.routeId]);
        res.products.forEach(element => {
          if (element.fixedPrice) {
            this.showPrice = true;
            element.fixedPrice = element.fixedPrice.toFixed(2);
          }
        });
        this.responseProducts = res;
        this.showResponse = true;
        console.log(this.responseProducts);

        this.toastrService.success('Arquivo enviado com sucesso');
      },
      (err: any) => {
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
    this.router.navigate(['/promotion/open/form/stocks/' + this.routeId]);
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/open']);
  }

  onProducts() {
    this.router.navigate(['/promotion/open/products/' + this.routeId]);
  }


}
