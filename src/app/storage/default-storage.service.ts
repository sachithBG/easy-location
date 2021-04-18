import { Injectable } from '@angular/core';

const USERID_KEY = 'UserId';
const USERIDEMAIL_KEY = 'UserEmail';

@Injectable({
  providedIn: 'root'
})
export class DefaultStorageService {

  constructor() { }

  public saveUserId(id: string) {
    // window.sessionStorage.removeItem(USERID_KEY);
    // window.sessionStorage.setItem(USERID_KEY, id);
    window.localStorage.removeItem(USERID_KEY);
    window.localStorage.setItem(USERID_KEY, id);
  }

  public getUserId(): number {
    // return Number(window.sessionStorage.getItem(USERID_KEY));
    return Number(window.localStorage.getItem(USERID_KEY));
  }

  public saveUserEmail(email: string) {
    // window.sessionStorage.removeItem(USERIDEMAIL_KEY);
    // window.sessionStorage.setItem(USERIDEMAIL_KEY, email);
    window.localStorage.removeItem(USERIDEMAIL_KEY);
    window.localStorage.setItem(USERIDEMAIL_KEY, email);
  }

  public getUserEmail(): any {
    // return window.sessionStorage.getItem(USERIDEMAIL_KEY);
    return window.localStorage.getItem(USERIDEMAIL_KEY);
  }

}
