import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserR } from '../model/user';
import { UserService } from '../service/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UsrImplService {

  constructor(private usrService: UserService) { }

  loging(email: string) {
    return new Observable<any>((obs) => {
      this.usrService
        .loging(email)
        .subscribe(
          (data) => {
            obs.next({ res: 1, data: data });
            // alert('Saved Successfully!');
          },
          (error) => {
            console.log(error);
            obs.next({ res: 0, data: error.error?error.error.message: ' ' });
            // obs.next(0);
          }
        );
    });
  }

  addLocByaddr(usr: User) {
    return new Observable<any>((obs) => {
      this.usrService
        .addLocByaddr(
          usr
        )
        .subscribe(
          (data) => {
            obs.next(data);
            alert('Successfully Saved!');
          },
          (error) => {
            console.log(error);
            obs.next(0);
          }
        );
    });
  }

  getOrgLoc(mail: string) {
    return new Observable<any>((obs) => {
      this.usrService
        .getOrgLoc(mail)
        .subscribe(
          (data) => {
            obs.next(data);
            // alert('Saved Successfully!');
          },
          (error) => {
            console.log(error);
            obs.next(0);
          }
        );
    });
  }
}
