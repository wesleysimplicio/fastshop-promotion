import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  // rows = [];
  // temp = [];
  selected = [];
  validatingForm: FormGroup;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  @Input() title: string = null;
  @Input() rows = [];
  @Input() temp = [];
  @Output() selecteds = new EventEmitter();

  constructor() {
    // this.fetch(data => {
    //   this.temp = [...data];
    //   this.rows = data;
    // });
  }

  ngOnInit() {
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  getSelection() {
    this.selecteds.emit(this.selected);
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
