import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/service/shared.service';
import { LocImpService } from 'src/app/serviceImpl/loc-imp.service';
import { MsgBoxComponent } from '../msg-box/msg-box.component';

@Component({
  selector: 'app-loc-view',
  templateUrl: './loc-view.component.html',
  styleUrls: ['./loc-view.component.scss']
})
export class LocViewComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  @Input() public locations: locData_[] = [];
  @Output() newItemEvent = new EventEmitter<string>();

  displayedColumns: string[] = [
    'label',
    'loc',
    'distance',
    'traffic',
    'action',
    'star'
  ];

  dataSource: MatTableDataSource<locData_>;
  @ViewChild('TablePaginator', { static: true })
  paginator!: MatPaginator;
  @ViewChild('TableSort', { static: true }) sort: MatSort = new MatSort;
  value = '';
  enrollmentDt: locData = { L: [] };
  inst = new Map();

  genarate_locs: Subscription = new Subscription;

  constructor(
    private locService: LocImpService,
    private dialog: MatDialog,
    private shrdService: SharedService,
    private cd: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnDestroy(): void {
    if (this.genarate_locs) {
      this.genarate_locs.unsubscribe();
    }
  }
  ngDoCheck(): void {
    // console.log('changes');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {

    this.enrollmentDt = this.dataSourcemodl(this.locations);
    this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
    this.ngAfterViewInit();

    this.genarate_locs = this.shrdService.genarate_locs_$.subscribe(
      (data: any) => {
        this.locations = data.items;
        this.enrollmentDt = this.dataSourcemodl(this.locations);
        this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
        this.ngAfterViewInit();
      }
    );

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cd.detectChanges();
  }

  dataSourcemodl(data: any): locData {
    let modls: any = [];
    for (const c of data) {
      this.inst.set(c.id, c);
      modls.push({
        id: c.id,
        label: c.label,
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

  more(row: any) {
    // const dialogRefloc =  this.dialog.open(MsgBoxComponent, {
    //     disableClose: false,
    //     data: row
    // });
    // setTimeout(()=>{
    //   dialogRefloc.close();
    // }, 9000)
  }

  delet(row: any) {
    this.locService.deleteLoc(row.id).subscribe((data) => {
    //console.log(data);
      if (data) {
        this.enrollmentDt.L.splice(this.enrollmentDt.L.indexOf(row), 1);
        this.dataSource = new MatTableDataSource(this.enrollmentDt.L);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.newItemEvent.emit(row);
      }
      this.cd.detectChanges();
    });
  }
}


export interface locData {
  L: locData_[];
}
export interface locData_ {
  id: number;
  label: number;
  loc: { lat: number, lng: number };
  address: string;
  from: any;
  distance: number;
  traffic: number;
}

