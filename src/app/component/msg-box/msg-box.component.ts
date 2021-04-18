import { Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { locData_ } from '../loc-view/loc-view.component';

@Component({
  selector: 'app-msg-box',
  templateUrl: './msg-box.component.html',
  styleUrls: ['./msg-box.component.scss']
})
export class MsgBoxComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public info: any) { }

  ngOnInit(): void {
    console.log(this.info);
    
  }

}
