import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Destn, DestnR } from '../model/user';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const httpOptionst = {
  headers: new HttpHeaders({ 'Content-Type': 'application/text' })
};
@Injectable({
  providedIn: 'root'
})
export class LocService {
  private baseUrl = environment.baseUrl;
  private locUrl = this.baseUrl + '/denst';
  constructor(private http: HttpClient) { }

  addLocById(orgn_id: number, loc: Destn): Observable<any> {
    //return of(sbloc);
    //console.log(loc);
    return this.http.post<string>(`${this.locUrl}/${orgn_id}`,loc , httpOptions);
  }
  updatesubLoc(loc_id: number, loc: Destn): Observable<any> {
    //return of(loc)
    return this.http.put(`${this.locUrl}/update/${loc_id}`, loc,{ responseType: 'json' });
  }
  getAllSubLocsById(id: number): Observable<any> {
    //return of(loc);
    return this.http.get(`${this.locUrl}/find/${id}`, { responseType: 'json' });
  }
  
  deleteLoc(info_id: number): Observable<any> {
    //return of(true)
    return this.http.delete<any>(`${this.locUrl}/delete/${info_id}`, httpOptions);
  }

  // 
  getDistanceMatrix(sendQuery: any): Observable<any> {
    // console.log(sendQuery);
    // return of(distncmtrx);
    // return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=AIzaSyDQ8YXyqQMk09_7t0JtrZVCBoVogHQyNIg')
    return this.http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=` + sendQuery.srcOriginLat  +'+'+ sendQuery.srcOriginLng + `&destinations=` + sendQuery.srcDestinationLat +'+' + sendQuery.srcDestinationLng +
     `&key=`+ sendQuery.key);
  }
}

const sbloc: DestnR[] = [{
  id: Math.round(Math.random()*100),
  address: 'Greenwich, Greater London, UK',
  lat: 81.00,
  lng: 6.000,
}]

var distncmtrx = {
  "originAddresses": [ "Greenwich, Greater London, UK" ],// "13 Great Carleton Square, Edinburgh, City of Edinburgh EH16 4, UK" ],
  "destinationAddresses": [ "Stockholm County, Sweden"],// "Dlouhá 609/2, 110 00 Praha-Staré Město, Česká republika" ],
  "rows": [ {
    "elements": [ {
      "status": "OK",
      "duration": {
        "value": 70778,
        "text": "19 hours 40 mins"
      },
      "distance": {
        "value": 30000,
        "text": "1173 mi"
      }
    }
    //  {
    //   "status": "OK",
    //   "duration": {
    //     "value": 44476,
    //     "text": "12 hours 21 mins"
    //   },
    //   "distance": {
    //     "value": 1262780,
    //     "text": "785 mi"
    //   }
    // }
   ]
  }
  // {
    // "elements": [ {
    //   "status": "OK",
    //   "duration": {
    //     "value": 96000,
    //     "text": "1 day 3 hours"
    //   },
    //   "distance": {
    //     "value": 2566737,
    //     "text": "1595 mi"
    //   }
    // }, {
    //   "status": "OK",
    //   "duration": {
    //     "value": 69698,
    //     "text": "19 hours 22 mins"
    //   },
    //   "distance": {
    //     "value": 1942009,
    //     "text": "1207 mi"
    //   }
    // } ]
  // } 
]
}

// const loc: locData_[] = [{
//   id: 1,
//   label: 1,
//   address: '',
//   loc: { lat: 6.605672642606247,
//     lng: 81.4816292142578, },
//   distance: 44,
//   traffic: '3600'
// }, {
//   id: 2,
//   label: 2,
//   address: '',
//   loc: { lat: 6.501984591945294,
//     lng: 81.58874591347654 },
//   distance: 77,
//   traffic: '45000'
// },
// {
//   id: 3,
//   label: 3,
//   address: '',
//   loc: { lat: 6.3778036838555785,
//     lng: 81.45073016640623 },
//   distance: 7777,
//   traffic: '3600'
// },
// ]
