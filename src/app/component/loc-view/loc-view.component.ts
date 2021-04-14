import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocImpService } from 'src/app/serviceImpl/loc-imp.service';

@Component({
  selector: 'app-loc-view',
  templateUrl: './loc-view.component.html',
  styleUrls: ['./loc-view.component.scss']
})
export class LocViewComponent implements OnInit, OnChanges, DoCheck {
  @Input() public locations: locData_[] = [];
  displayedColumns: string[] = [
    'loc_no',
    'loc',
    'distance',
    'traffic',
    'star',
    'action'
  ];

  dataSource: MatTableDataSource<locData_>;
  @ViewChild('TablePaginator', { static: true })
  paginator!: MatPaginator;
  @ViewChild('TableSort', { static: true }) sort: MatSort = new MatSort;
  value = '';
  enrollmentDt: locData = {L: []};
  inst = new Map();
  constructor(
    private locService: LocImpService,
    // private subcatImpService: SubcategoryImplService,
    // private defShaerdService: DefaultSharedService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }
  ngDoCheck(): void {
    console.log('changes');
    this.enrollmentDt = this.dataSourcemodl(this.locations);
    this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
  }

  ngOnInit(): void {
    // this.locService.getAllLocsByaddr('').subscribe(
    //   async (data: locData[]) => {
    //     console.log(data);
        this.enrollmentDt = this.dataSourcemodl(this.locations);
        this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
        // this.ngAfterViewInit();
      // });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  dataSourcemodl(data: any): locData {
    let modls: any = [];
    for (const c of data) {
      this.inst.set(c.id, c);
      modls.push({
        id: c.id,
        loc_no: c.loc_no,
        loc: c.loc,
        distance: c.distance,
        traffic: c.traffic,
      });
    }
    return { L: modls };
  }

  applyFilter(event: Event) {
    const filterValuem = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValuem.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // getTotalCost() {
  //   let fee: locData_[] = [];
  //   for (const i of this.inst.values()) {
  //     fee.push(i);
  //   }
  //   if (this.inst.size > 0) {
  //     return fee
  //       .map((t) => t.loc_no)
  //       .reduce((acc, value) => acc + value, 0);
  //   }
  //   else{return 0;}
  // }
  more(row: any) {
    console.log(this.inst.get(row.id));
    // this.defShaerdService.alert(this.inst.get(row.id), 'pminst');
  }

  // enr(row: any, isConfirm: boolean, reson: string) {
  //   // this.locService.isConfirm(row.id, isConfirm, reson).subscribe((data) => {
  //   //   console.log(data);
  //   //   data ? row.isConfirm = data.isConfirm : '';
  //   //   // this.enrollmentDt.S.splice(this.enrollmentDt.S.indexOf(row), 1);
  //   //   this.dataSource = new MatTableDataSource(this.enrollmentDt.S);
  //   //   this.dataSource.paginator = this.paginator;
  //   //   this.dataSource.sort = this.sort;
  //   // });
  // }

  // confirm(row: any) {
  //   this.enr(row, false, '');
  // }

  // reject(row: any) {
  //   // this.defShaerdService
  //   // .isBlock('Will be prevented for this subject !', 'block')
  //   // .afterClosed()
  //   // .subscribe((result) => {
  //   //   if (result.res) {
  //   //     this.enr(row, true, result.reson);
  //   //   }
  //   // });
  // }

  delet(row: any) {
          this.locService.deleteLoc(row.id).subscribe((data: locData[]) => {
            console.log(data);
            if (data) {
              this.enrollmentDt.L.splice(this.enrollmentDt.L.indexOf(row), 1);
              this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
  }
}
export interface locData {
  L: locData_[];
}
export interface locData_{
  id: number;
  loc_no: number;
  loc: {lat: number, lng: number};
  distance: number;
  traffic: string;
}

