import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  APIKEY = 'AIzaSyDQ8YXyqQMk09_7t0JtrZVCBoVogHQyNIg';
  // APIKEY = 'AIzaSyAFUGH1bTsfi9l8mt6jlo8FY6qsC6xijf8';
  
  isLogin_ = new Subject<any>();
  isLogin_$ = this.isLogin_.asObservable();

  genarate_locs_ = new Subject<any>();
  genarate_locs_$ = this.genarate_locs_.asObservable();

  remove_locs_ = new Subject<any>();
  remove_locs_$ = this.remove_locs_.asObservable();
  
  isLogin_locs_ = new Subject<any>();
  isLogin_locs_$ = this.isLogin_locs_.asObservable();

  
}
