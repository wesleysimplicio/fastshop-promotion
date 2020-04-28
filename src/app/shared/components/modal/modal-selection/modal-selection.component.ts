import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  
  constructor(private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.contentModal.config = { backdrop: 'static', ignoreBackdropClick: true };
    this.contentModal.show();
    this.getOption.emit(this.option);
    this.changeDetector.detectChanges();
  }

  getSelectionAndClose(isClosed = false) {
    if (!isClosed) {
      this.getSelecteds.emit(this.selected);
    } else {
      this.getSelecteds.emit(false);
    }

    document.getElementById('inputSearch').nodeValue = '';
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.changeDetector.detectChanges();
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  remove() {
    this.selected = [];
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
    this.table.offset = 0;
  }

}
