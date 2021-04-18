import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getMaxListeners } from 'node:process';
import { Observable, of } from 'rxjs';
import { locData_ } from 'src/app/component/loc-view/loc-view.component';
import { Addrs, User, UserR } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;
  private userUrl = this.baseUrl + '/user';

  constructor(private http: HttpClient) { }

  loging(email: string): Observable<any> {
    //return of({ id: 2, email: 'a@getMaxListeners.com' });
    return this.http.get(`${this.userUrl}/find/${email}`, { responseType: 'json' });
  }

  addLocByaddr(info: User): Observable<any> {
    //return of(info);
    console.log(info);
    return this.http.post<any>(`${this.userUrl}`, info, httpOptions);
  }

  getOrgLoc(email: string): Observable<any> {
    //return of(homeloc);
    return this.http.get(`${this.userUrl}/find/${email}`, { responseType: 'json' });
  }
}

const homeloc: UserR = { 
  id: 3232, address: { house_no: '33', street_address: 'Greenwich', city: 'London1', 
  state: 'abc', zipcode: '21212', country: 'any' },
  email: 'a@gmail.com', origin: { lat: 6.901608599999999, lng: 80.0087746}
};//{id: 1 , addr: 'Greenwich, Greater London1, UK', lat: 80, lng:  6};



// const loc: locData_[] = [{
//   id: 1,
//   label: 1,
//   address: '',
//   loc: {
//     lat: 6.605672642606247,
//     lng: 81.4816292142578,
//   },
//   distance: 44,
//   traffic: 'no'
// }, {
//   id: 2,
//   label: 2,
//   address: '',
//   loc: {
//     lat: 6.501984591945294,
//     lng: 81.58874591347654
//   },
//   distance: 77,
//   traffic: 'no'
// },
// {
//   id: 3,
//   label: 3,
//   address: '',
//   loc: {
//     lat: 6.3778036838555785,
//     lng: 81.45073016640623
//   },
//   distance: 7777,
//   traffic: 'no'
// },
// ]
