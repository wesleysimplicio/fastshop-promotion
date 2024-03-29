import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

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
import { AuthoritiesPromotion } from './../../../shared/model/authorities/authorities-promotion.model';
import { ComponentNotification } from './../../../shared/component-notification/component-notification.service';

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


  selectsSTGLengthOri = JSON.stringify([]);
  selectsVSLengthOri = JSON.stringify([]);
  selectsBGLengthOri = JSON.stringify([]);
  selectsSTLengthOri = JSON.stringify([]);


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
    private utilities: UtilitiesService,
    private activatePromotion: ComponentNotification
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
    this.getAuthoritiesEmmiter();
    this.utilities.showLoading(true);

    this.user = this.userService.getUserLogged();

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
            this.selectsVSLengthOri = JSON.stringify(this.promotion.virtualStores);
          }
          if (this.promotion.branchGroups !== undefined) {
            this.selectedsBG = this.promotion.branchGroups;
            this.selectsBGLengthOri = JSON.stringify(this.promotion.branchGroups);
          }
          if (this.promotion.streets !== undefined) {
            this.selectedsST = this.promotion.streets;
            this.selectsSTLengthOri = JSON.stringify(this.promotion.streets);
          }
          if (this.promotion.salesTableGroups !== undefined) {
            this.selectedsSTG = this.promotion.salesTableGroups;
            this.selectsSTGLengthOri = JSON.stringify(this.promotion.salesTableGroups);
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
        this.verifyAuthoritiesMessage(res.body);
        // this.toastrService.success('Salvo com sucesso');
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
    return this.selectsSTGLengthOri !== JSON.stringify(this.selectedsSTG) ||
      this.selectsVSLengthOri !== JSON.stringify(this.selectedsVS) ||
      this.selectsBGLengthOri !== JSON.stringify(this.selectedsBG) ||
      this.selectsSTLengthOri !== JSON.stringify(this.selectedsST);
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
    const condition = this.typePromo === PromotionTypeEnum.Coupon || this.typePromo === PromotionTypeEnum.Prime;
    if (condition ) {
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

  private verifyAuthoritiesMessage(data): void {
    if (data && data.messages && data.messages[0].businessCode < 0) {
      this.toastrService.info(data.messages[0].description);
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

  getAuthoritiesEmmiter(): void {
    this.activatePromotion.getActivatePromotion().pipe(first()).subscribe((res: AuthoritiesPromotion) => {
      this.activatePromotion.setActivatePromotion(res);
    });
  }

}
