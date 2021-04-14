import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { locData_ } from '../component/loc-view/loc-view.component';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LocService {
  private baseUrl = environment.baseUrl;
  private lecturerUrl = this.baseUrl + '/home/lecturer/info';
  constructor(private http: HttpClient) { }

  addLocByaddr(user_id: number, loc: any[]): Observable<number> {
    return of(1);
    // return this.http.post<string>(`${this.lecturerUrl}/${user_id}/${inst_id}`, httpOptions);
  }

  getAllLocsByaddr(mail: string): Observable<any> {
    return of(loc);
    return this.http.get(`home/lecturers/infos/${mail}`, { responseType: 'text' });
  }

  deleteLoc(info_id: number): Observable<any> {
    return of(true)
    return this.http.delete<any>(`${this.lecturerUrl}/${info_id}`, httpOptions);
  }

  // 
  getDistanceMatrix(sendQuery: any): Observable<any> {
    console.log(sendQuery);
    // return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=AIzaSyCOEBS99rNIrwCa5auEEQTJUT940jWRBHI')
    return this.http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=` + sendQuery.srcOriginLat  +'+'+ sendQuery.srcOriginLng + `&destinations=` + sendQuery.srcDestinationLat +'+' + sendQuery.srcDestinationLng + `&key=AIzaSyCOEBS99rNIrwCa5auEEQTJUT940jWRBHI`, { responseType: 'json' })
  }
}


const loc: locData_[] = [{
  id: 1,
  loc_no: 1,
  loc: { lat: 121, lng: 21212 },
  distance: 44,
  traffic: 'no'
}, {
  id: 2,
  loc_no: 2,
  loc: { lat: 4334, lng: 43424 },
  distance: 77,
  traffic: 'no'
},
{
  id: 3,
  loc_no: 3,
  loc: { lat: 766, lng: 567567 },
  distance: 7777,
  traffic: 'no'
},
]