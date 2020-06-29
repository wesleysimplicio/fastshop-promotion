import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-modal-selection',
  templateUrl: './modal-selection.component.html',
  styleUrls: ['./modal-selection.component.scss']
})
export class ModalSelectionComponent implements OnInit {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @ViewChild('frame', { static: true }) contentModal: ModalDirective = null;

  @Input() title: string = null;
  @Input() rows = [];
  @Input() temp = [];
  @Input() selected = [];
  @Input() option: string = null;
  @Output() getSelecteds = new EventEmitter();
  @Output() getOption = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.contentModal.config = { backdrop: 'static', ignoreBackdropClick: true };
    this.contentModal.show();
    this.getOption.emit(this.option);
  }

  getSelectionAndClose(isClosed = false) {
    if (this.option === 'ST') {
      this.selected.forEach(el => {
        if (el.street) {
          el.name = el.street;
        }
      });
    }
    if (!isClosed) {
      this.getSelecteds.emit(this.selected);
    } else {
      this.getSelecteds.emit(false);
    }
    document.getElementById('inputSearch').nodeValue = '';
  }

  selectAll(isChecked) {
    this.selected = [];
    if (isChecked) {
      this.rows.forEach(el => {
        this.selected.push(el);
      });
    }
  }

  isSelected(itemId) {
    const isSelectIndex = this.selected.findIndex(function (node) {
      return node.id === itemId;
    });
    if (isSelectIndex !== -1) {
      return true;
    }
    return false;
  }

  onSelect(selected, isChecked) {
    const isSelectIndex = this.selected.findIndex(function (node) {
      return node.id === selected.id;
    });

    if (isChecked) {
      if (this.selected.indexOf(selected.id) !== -1 || isSelectIndex === -1) {
        this.selected.push(selected);
      }
    } else {
      this.selected.splice(isSelectIndex, 1);
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

}
