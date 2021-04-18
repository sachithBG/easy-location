import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { DefaultStorageService } from '../storage/default-storage.service';
// import * as $ from 'node_modules/jquery';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private strg: DefaultStorageService, private cd: ChangeDetectorRef,
     private shrdService: SharedService) { }
     isLogin_ : Subscription = new Subscription;
     islog = false;
  ngOnInit(): void {
    if (this.strg.getUserId() && this.strg.getUserEmail()) {
      this.islog = true;
    }
    this.isLogin_ = this.shrdService.isLogin_$.subscribe(
      (data: any) => {
        this.islog = data;
        this.cd.detectChanges();
      }
    );
  }

  get evnt() {
    return this.islog;
  }

  closeEvnt() {
    window.sessionStorage.clear();
    localStorage.clear();
    this.islog = false;
    location.reload();
  }
}
