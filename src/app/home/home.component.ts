import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserR } from '../model/user';
import { SharedService } from '../service/shared.service';
import { UserService } from '../service/user/user.service';
import { LocImpService } from '../serviceImpl/loc-imp.service';
import { DefaultStorageService } from '../storage/default-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLogin = false;
  isLoadadrrs = false;
  usr: UserR | any;
  id = 0;

  adr = '';

  constructor(private shardService: SharedService,
    private cd: ChangeDetectorRef, private locService: LocImpService,
    private usrService: UserService, private strg: DefaultStorageService) { }
  ngOnDestroy(): void {
    if(this.isLogin_locs){
      this.isLogin_locs.unsubscribe();
    }
  }

  isLogin_locs: Subscription = new Subscription;

  ngOnInit(): void {
    this.isLogin_locs = this.shardService.isLogin_locs_$.subscribe(
      (data: any) => {
        this.isLogin = data.isLogin;
        this.loadAdr(data.email);
        this.cd.detectChanges();
      }
    );
  }

  loadAdr(email: string) {
    this.usrService.getOrgLoc(email).subscribe((r: any) => {
      this.usr = r;
      this.adr = this.usr.address.house_no + ',' + this.usr.address.street_address + ',' + this.usr.address.city + ',' + this.usr.address.state + ' ' + this.usr.address.zipcode + ',' + this.usr.address.country;
    });
  }

  start(id: number) {
    this.id = id;
    this.isLoadadrrs = true;
    this.cd.detectChanges();
  }

}
