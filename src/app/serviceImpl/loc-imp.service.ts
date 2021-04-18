import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destn } from '../model/user';
import { LocService } from '../service/loc.service';

@Injectable({
  providedIn: 'root'
})
export class LocImpService {

  constructor(private locService: LocService) { }


  addLocByaddr(org_id: number, loc: Destn) {
    return new Observable<any>((obs) => {
      this.locService
        .addLocById(
          org_id,
          loc
        )
        .subscribe(
          (data) => {
            obs.next(data);
            // alert('Successfully Saved!');
          },
          (error) => {
            console.log(error);
            obs.next(0);
          }
        );
    });
  }

  updatesubLoc(loc_id: number, loc: Destn) {
    return new Observable<any>((obs) => {
      this.locService
        .updatesubLoc(
          loc_id,
          loc
        )
        .subscribe(
          (data) => {
            obs.next(data);
            // alert('Successfully Saved!');
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
          obs.next(1);
          //alert('Successfully deleted!!');
        },
        (error) => {
          console.log(error);
          obs.next(0);
        }
      );
    });
  }

  getAllSubLocsById(id: number) {
    return new Observable<any>((obs) => {
      this.locService
        .getAllSubLocsById(id)
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
