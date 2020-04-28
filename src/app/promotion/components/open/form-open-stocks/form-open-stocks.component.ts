import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { PriceService } from 'src/app/shared/services/price.service';
import { Promotion, IdName } from 'src/app/promotion/model/promotion.model';
import { Street } from 'src/app/shared/model/price/street.model';
import { VirtualStore } from 'src/app/shared/model/price/virtual-store.model';
import { BranchGroup } from 'src/app/shared/model/price/branch-group.model';
import { GroupSalesTable } from 'src/app/shared/model/price/group-sales-table.model';
import { ModalSelectionComponent } from 'src/app/shared/components/modal/modal-selection/modal-selection.component';

@Component({
  selector: 'app-form-open-stocks',
  templateUrl: './form-open-stocks.component.html',
  styleUrls: ['./form-open-stocks.component.scss']
})
export class FormOpenStocksComponent implements OnInit {

  breadcrumbs = [];
  routeId: any;
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilValidation: UtilValidation,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.getStreetPrice();
    this.getVirtualStorePrice();
    this.getBranchGroup();
    this.getGroupSalesTable();
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
        label: 'Estoque'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {

      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;

    } else {
      this.isEditStep = true;

      this.promotionService.getPromotion(this.routeId).subscribe(
        (res) => {
          this.promotion = res.body;
          console.log('promotion', this.promotion);

          this.selectedsVS = (this.promotion.virtualStores !== undefined) ? this.promotion.virtualStores : [];
          this.selectedsBG = (this.promotion.branchGroups !== undefined) ? this.promotion.branchGroups : [];
          this.selectedsST = (this.promotion.streets !== undefined) ? this.promotion.streets : [];
          console.log('selectedsST', this.selectedsST);

          this.selectedsSTG = (this.promotion.salesTableGroups !== undefined) ? this.promotion.salesTableGroups : [];
        });
    }
  }

  openModal(option) {

    switch (option) {
      case 'VS':
        this.title = 'Loja Virtual';
        this.rows = this.virtualStores;
        this.selectedsVS.map(el => {
          el.isSelected = true;
          // this.selectedsVS.push(el);
        });
        this.selecteds = this.selectedsVS;
        console.log('this.selecteds', this.selecteds);
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
    this.submitted = true;

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }

    this.getSendArrays();
    this.promotion.updatedBy = 'edileno@fastshop.com.br'; // TODO: REMOVER

    this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/open']);
        } else {
          this.router.navigate(['/promotion/open/form/products/' + res.body.id]);
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
        res.body.forEach(el => {
          this.virtualStores.push({ id: el.id, name: el.name });
        });
        // this.virtualStores = res.body;
        console.log('this.virtualStores', this.virtualStores);

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
    this.router.navigate(['/promotion/open/form/restrictions/' + this.routeId]);
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
