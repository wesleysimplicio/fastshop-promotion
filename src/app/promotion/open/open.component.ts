import { Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PromotionService } from 'src/app/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StatusEnum } from '../enum/status.enum';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {

  rows = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPromotion();
  }

  getPromotion() {
    this.promotionService.getPromotion().subscribe(
      (res) => {
        this.rows = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }

  updateStatusPromotion(idPromotion, statusPromotion) {
    const status = (statusPromotion === StatusEnum.Active) ? StatusEnum.Desactive : StatusEnum.Active;
    this.promotionService.updatePromotionStatus(idPromotion, status).subscribe(
      (res) => {
        this.toastrService.success('Status alterado com sucesso');
        this.getPromotion();
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }

}
