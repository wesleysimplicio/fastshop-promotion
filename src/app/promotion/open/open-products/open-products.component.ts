import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/services/promotion.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-open-products',
  templateUrl: './open-products.component.html',
  styleUrls: ['./open-products.component.scss']
})
export class OpenProductsComponent implements OnInit {

  nameCoupon: string;
  routeId: any;
  rows = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService
  ) { }

  ngOnInit() {
    this.routeId = this.route.snapshot.params.id;
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['promotion/open']);
      return;
    }

    this.getPromotion();
  }

  getPromotion() {
    this.promotionService.getPromotionProducts(this.routeId).subscribe(
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

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  displayCheck(row) {
    return row.name !== 'Ethel Price';
  }

}
