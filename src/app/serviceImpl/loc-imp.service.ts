import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocService } from '../service/loc.service';

@Injectable({
  providedIn: 'root'
})
export class LocImpService {

  constructor(private locService: LocService) { }


  addLocByaddr(loc: any[]) {
    return new Observable<any>((obs) => {
      this.locService
        .addLocByaddr(
          Number(1),//this.toknStorageService.getUserid()
          loc
        )
        .subscribe(
          (data) => {
            obs.next(data);
            alert('Saved Successfully!');
          },
          (error) => {
            console.log(error);
            obs.next(0);
          }
        );
    });
  }

  deleteLoc(id: number) {
    return new Observable<any>((obs) => {
      this.locService.deleteLoc(id).subscribe(
        (data) => {
          obs.next(data);
          alert('Deleted Successfully!');
        },
        (error) => {
          console.log(error);
          obs.next(0);
        }
      );
    });
  }

  getAllLocsByaddr(mail: string) {
    return new Observable<any>((obs) => {
      this.locService
        .getAllLocsByaddr(mail)
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

  // 
  getDistanceMatrix(sendQuery: any) {
    return new Observable<any>((obs) => {
      this.locService
        .getDistanceMatrix(sendQuery)
        .subscribe(
          (response: Response) => {
            obs.next(response);
            // alert('Saved Successfully!');
          },
          (error) => {
            console.log(error);
            obs.next(0);
          }
        );
   })
}

}
