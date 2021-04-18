import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectLocComponent } from '../select-loc/select-loc.component';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(1000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class EntryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
