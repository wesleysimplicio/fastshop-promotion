import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/model/user/user.model';
import { BranchGroup } from 'src/app/shared/model/price/branch-group.model';
import { Street } from 'src/app/shared/model/price/street.model';
import { IdName, Promotion } from '../../model/promotion.model';
import { GroupSalesTable } from 'src/app/shared/model/price/group-sales-table.model';
import { UserService } from 'src/app/shared/model/user/user.service';
import { PriceService } from 'src/app/shared/services/price.service';
import { PromotionService } from '../../services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { FormBuilder } from '@angular/forms';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-form-step3',
  templateUrl: './form-step3.component.html',
  styleUrls: ['./form-step3.component.scss']
})
export class FormStep3Component implements OnInit {


  breadcrumbs = [];
  routeId: any;
  search = '';
  isEditStep = false;
  onlySave: boolean;
  selectedsVS = []; selectedsST = []; selectedsBG = []; selectedsSTG = [];
  showModalVS = false; showModalST = false; showModalBG = false; showModalSTG = false;
  promotion: Promotion;
  submitted = false;
  virtualStores = new Array<IdName>();
  streets = new Array<Street>();
  branchGroups = new Array<BranchGroup>();
  groupSalesTables = new Array<GroupSalesTable>();

  // @ViewChild(ModalSelectionComponent, { static: false}) appModal: ModalSelectionComponent;

  title = '';
  rows = [];
  option = '';
  selecteds = [];
  showModal = false;
  user = new User();
  typePromo: string;
  selectsBGLengthOri = 0;
  selectsVSLengthOri = 0;
  selectsSTGLengthOri = 0;
  selectsSTLengthOri = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilValidation: UtilValidation,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private changeDetector: ChangeDetectorRef,
    private userService: UserService,
    private utilities: UtilitiesService
  ) {
    this.typePromo = this.route.snapshot.params.typePromo;

    this.getStreetPrice();
    this.getVirtualStorePrice();
    this.getBranchGroup();
    this.getGroupSalesTable();
    this.routeId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      if (params['id'] !== this.routeId) {
        this.routeId = params['id'];
        window.location.reload();
      }
    });
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
        label: 'Estoque'
      },
    );
  }

  ngOnInit() {
    this.utilities.showLoading(true);

    this.userService.getUserLoggedSubject().subscribe(res => {
      this.user = res;
    });

    if (this.routeId === 'undefined' || !this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;

    } else {
      this.isEditStep = true;

      this.promotionService.getPromotion(this.routeId).subscribe(
        (res) => {
          this.promotion = res.body;
          if (this.promotion.promotionType !== this.typePromo.toLocaleUpperCase()) {
            this.toastrService.warning('Ação inválida');
            this.router.navigate(['/promotion/' + this.typePromo]);
            return;
          }
          if (this.promotion.virtualStores !== undefined) {
            this.selectedsVS = this.promotion.virtualStores;
            this.selectsVSLengthOri = this.promotion.virtualStores.length;
          }
          if (this.promotion.branchGroups !== undefined) {
            this.selectedsBG = this.promotion.branchGroups;
            this.selectsBGLengthOri = this.promotion.branchGroups.length;
          }
          if (this.promotion.streets !== undefined) {
            this.selectedsST = this.promotion.streets;
            this.selectsSTLengthOri = this.promotion.streets.length;
          }
          if (this.promotion.salesTableGroups !== undefined) {
            this.selectedsSTG = this.promotion.salesTableGroups;
            this.selectsSTGLengthOri = this.promotion.salesTableGroups.length;
          }

          this.utilities.showLoading(false);
        });
    }
  }

  openModal(option) {

    switch (option) {
      case 'VS':
        this.title = 'Loja Virtual';
        this.rows = this.virtualStores;
        this.selecteds = this.selectedsVS;
        break;

      case 'STG':
        this.title = 'Grupo de tabelas de vendas';
        this.rows = this.groupSalesTables;
        this.selecteds = this.selectedsSTG;
        break;
      case 'ST':
        this.title = 'Ruas Logísticas';
        this.rows = this.streets;
        this.selecteds = this.selectedsST;
        break;
      case 'BG':
        this.title = 'Grupo de Filiais';
        this.rows = this.branchGroups;
        this.selecteds = this.selectedsBG;
        break;
      default:
        break;
    }

    this.option = option;
    this.showModal = true;
    // this.changeDetector.detectChanges();
  }

  getSelecteds(event) {
    if (event) {
      switch (this.option) {
        case 'VS':
          this.selectedsVS = event;
          break;
        case 'STG':
          this.selectedsSTG = event;
          break;
        case 'ST':
          this.selectedsST = [];
          this.changeDetector.detectChanges();
          event.forEach(element => {
            if (element.street !== undefined) {
              this.selectedsST.push({ id: element.id, name: `${element.street} - ${element.description}` });
            }
          });
          break;
        case 'BG':
          this.selectedsBG = event;
          break;
      }
    }
    this.showModal = false;

  }

  getOption(event) {
    this.option = event;
  }

  onSubmit() {
    //Mexeu em nada, redireciona direto
    if (this.isEditStep && !this.isChanges()) {
      this.router.navigate(['/promotion/' + this.typePromo + '/form/products/' + this.routeId]);
      return;
    }

    this.submitted = true;

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }

    this.getSendArrays();
    this.promotion.updatedBy = this.user.sub;
    this.utilities.showLoading(true);

    this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/' + + this.typePromo]);
        } else {
          this.router.navigate(['/promotion/' + this.typePromo + '/form/products/' + this.routeId]);
        }
        this.toastrService.success('Salvo com sucesso');
        this.utilities.showLoading(false);

      },
      (err: any) => {
        this.utilities.showLoading(false);

        this.submitted = false;
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );

  }

  isChanges() {
    return (
      this.selectsBGLengthOri !== this.selectedsBG.length ||
      this.selectsVSLengthOri !== this.selectedsVS.length ||
      this.selectsSTGLengthOri !== this.selectedsSTG.length ||
      this.selectsSTLengthOri !== this.selectedsST.length
    ) ? true : false;
  }

  getSendArrays() {
    if (this.selectedsBG.length > 0) {
      this.promotion.branchGroups = this.selectedsBG;
    }
    if (this.selectedsVS.length > 0) {
      this.promotion.virtualStores = this.selectedsVS;
    }
    if (this.selectedsSTG.length > 0) {
      this.promotion.salesTableGroups = this.selectedsSTG;
    }
    if (this.selectedsST.length > 0) {
      this.promotion.streets = this.selectedsST;
    }
  }

  getVirtualStorePrice() {
    this.priceService.getVirtualStore().subscribe(
      (res) => {
        // res.body.forEach(el => {
        //   this.virtualStores.push({ id: el.id, name: el.name });
        // });
        this.virtualStores = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  getStreetPrice() {
    this.priceService.getStreet().subscribe(
      (res) => {
        this.streets = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  getBranchGroup() {
    this.priceService.getBranchGroup().subscribe(
      (res) => {
        this.branchGroups = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  getGroupSalesTable() {
    this.priceService.getGroupSalesTable().subscribe(
      (res) => {
        this.groupSalesTables = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  onBack() {
    //REDIRECIONA PARA EDIT, PULA step 2 //TODO: REMOVER DEPOIS
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step1/' + this.routeId]);
    } else {
      this.router.navigate(['/promotion/' + this.typePromo + '/step2/' + this.routeId]);
    }
  }

  removeSelection(index, option) {
    switch (option) {
      case 'VS':
        this.selectedsVS.splice(index, 1);
        break;
      case 'STG':
        this.selectedsSTG.splice(index, 1);
        break;
      case 'ST':
        this.selectedsST.splice(index, 1);
        break;
      case 'BG':
        this.selectedsBG.splice(index, 1);
        break;
    }
  }

}
