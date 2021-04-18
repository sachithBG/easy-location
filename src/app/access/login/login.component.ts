import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/service/shared.service';
import { UserService } from 'src/app/service/user/user.service';
import { UsrImplService } from 'src/app/serviceImpl/usr-impl.service';
import { DefaultStorageService } from 'src/app/storage/default-storage.service';
import { SelectLocComponent } from '../select-loc/select-loc.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit, OnDestroy {

  formSubmitAttempt: boolean = false;
  private loginInfo = { email: '', location: '' };
  isLogin = false;
  errorMessage = '';
  login: Subscription = new Subscription;

  form: FormGroup = new FormGroup({
    email: new FormControl(),
  });

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UsrImplService,
    private shrdService: SharedService,
    private strg: DefaultStorageService
    // private authService: AuthService,
    // private tokenStorage: TokenStorageService
  ) { }

  ngOnDestroy(): void {
    if (this.login) {
      this.login.unsubscribe();
    }
  }

  ngAfterContentInit(): void {
    if (this.strg.getUserEmail() && this.strg.getUserId()) {
      this.shrdService.isLogin_.next(true);
      this.shrdService.isLogin_locs_.next({ isLogin: true, email: this.strg.getUserEmail() });
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addLocation() {
    navigator.geolocation.getCurrentPosition((p) => {
      const dialogRefloc = this.dialog.open(SelectLocComponent, {
        minWidth: '300px',
        disableClose: true,
        data: { lat: p.coords.latitude, lng: p.coords.longitude }
      });
      dialogRefloc.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.form.patchValue({ lat: result.lat });
          this.form.patchValue({ lng: result.lng });
        }
      });
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      return
    }
    this.formSubmitAttempt = true;
    this.isLogin = true;
    this.login = this.userService.loging(this.form.value.email).subscribe((res: any) => {
      console.log(res.data);
      if (res.res) {
        setTimeout(() => {
          this.isLogin = false; this.errorMessage = ''
        }, 2000);
        this.strg.saveUserId(res.data.id);
        this.strg.saveUserEmail(res.data.email);
        this.shrdService.isLogin_.next(true);
        this.shrdService.isLogin_locs_.next({ isLogin: true, email: res.data.email });
      } else {
        setTimeout(() => { this.isLogin = false; this.errorMessage = res.data }, 2000);
      }
    });
    // (error) => {
    // this.shrdService.isLogin_locs_.next({isLogin: false});
    // });
    // this.loginInfo = new AuthLoginInfo(this.form.value.userName, this.form.value.password);

    // this.authService.attemptAuth(this.loginInfo).subscribe(
    //   (data: any) => {
    //     console.log(data)
    //     // this.tokenStorage.saveToken(data.accessToken);
    //     // this.tokenStorage.saveFName(data.name.split(' ')[1] ? data.name.split(' ')[1] : '');
    //     // this.tokenStorage.saveLName(data.name.split(' ')[0]);
    //     // this.tokenStorage.saveUsername(data.username);
    //     // this.tokenStorage.saveAuthorities(data.authorities);
    //     // this.tokenStorage.saveUserid(data.userId);
    //     // this.tokenStorage.saveProfImg(data.profImg);
    //     this.errorMessage = '';
    //     setTimeout(() => { }, 2000)
    //   },
    //   (error: any) => {
    //     typeof error.error.message != 'undefined' ? error = error.error.message : error = error.message;
    //     console.log(error);
    //     setTimeout(() => { this.isLogin = false; this.errorMessage = error + '' }, 2000)
    //   }
    // );
  }
}
