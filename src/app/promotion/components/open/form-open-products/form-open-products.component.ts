import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

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
        label: 'Produtos'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['promotion/']);
      return;
    }

    this.buildForm();
  }

  get pF() { return this.productForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (
      !this.isFormsValid()
    ) {
      return;
    }

    this.promotionService.addPromotionProduct(this.routeId, this.productForm.get('file').value).subscribe(
      (res) => {
        // Redireciona para produtos da promocao
        this.router.navigate(['promotion/open/products/' + this.routeId]);
        this.toastrService.success('Arquivo enviado com sucesso');
      },
      (err: any) => {
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
    this.router.navigate(['promotion/open/edit/' + this.routeId]);
  }

}
