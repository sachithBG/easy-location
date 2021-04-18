import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user/user.service';
import { UsrImplService } from 'src/app/serviceImpl/usr-impl.service';
import { SelectLocComponent } from '../select-loc/select-loc.component';
declare var $:any
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formSubmitAttempt: boolean = false;
  private loginInfo = { email: '', location: '' };
  isLogin = false;
  errorMessage = '';
  crnt_loc: any = { lat: 0, lng: 0 };
  form: FormGroup = new FormGroup({
    email: new FormControl(),
    lat: new FormControl(),
    lng: new FormControl()
  });
  formAddr: FormGroup = new FormGroup({
    house_no: new FormControl(),
    street_address: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zipcode: new FormControl(),
    country: new FormControl(),
  });
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UsrImplService,
    // private authService: AuthService,
    // private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      lat: ['', Validators.required],
      lng: ['', Validators.required]
    });

    this.formAddr = this.fb.group({
      house_no: ['', Validators.required],
      street_address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      country: ['', Validators.required],
    });

    // navigator.geolocation.getCurrentPosition((p) => {
    //   this.crnt_loc = { lat: p.coords.latitude, lng: p.coords.longitude }
    // });

    navigator.geolocation.getCurrentPosition((p) => {
      this.crnt_loc = { lat: p.coords.latitude, lng: p.coords.longitude };
    },
      (failure) => {
        $.getJSON('https://ipinfo.io/geo', (response: any) => {
          var loc = response.loc.split(',');
          this.crnt_loc = { lat: loc[0], lng: loc[1] };
        });
      });
  }

  addLocation() {
    const dialogRefloc = this.dialog.open(SelectLocComponent, {
      minWidth: '300px',
      maxWidth: '600px',
      disableClose: true,
      data: this.crnt_loc
    });
    dialogRefloc.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.form.patchValue({ lat: result.lat });
        this.form.patchValue({ lng: result.lng });
        let d = result.addr.split(',');
        // console.log(d[2].split(' '));
        if (d.length == 4) {
          this.formAddr.patchValue({ house_no: d[0].split(' ')[0] });
          this.formAddr.patchValue({ street_address: d[0].replace(d[0].split(' ')[0], '') });
          this.formAddr.patchValue({ city: d[1] });
          this.formAddr.patchValue({ state: d[2].split(' ')[1] });
          this.formAddr.patchValue({ zipcode: d[2].split(' ').slice(2)[0] });
          this.formAddr.patchValue({ country: d[3] });
        }
      }
    });
  }

  onSubmit(v: number) {
    if (this.form.invalid) {
      return
    }
    this.formSubmitAttempt = true;
    this.isLogin = true;
    let usr: User = { email: this.form.value.email, origin: { lat: this.form.value.lat, lng: this.form.value.lng }, address: this.formAddr.value }
    this.userService.addLocByaddr(usr).subscribe((res: any) => {
      console.log(res);
      if (res) {
        setTimeout(() => {
          this.isLogin = false; this.errorMessage = '';
          location.reload()
        }, 2000);
      } else {
        this.isLogin = false; this.errorMessage = '_';
      }
    }, (error) => {
      setTimeout(() => { this.isLogin = false; this.errorMessage = ' ' }, 2000);
      // this.shrdService.isLogin_locs_.next({isLogin: false});
    });

  }

}
