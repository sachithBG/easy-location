import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Destn, DestnR } from 'src/app/model/user';
import { SharedService } from 'src/app/service/shared.service';
import { LocImpService } from 'src/app/serviceImpl/loc-imp.service';
import { locData_ } from '../loc-view/loc-view.component';

@Component({
  selector: 'app-loc-select',
  templateUrl: './loc-select.component.html',
  styleUrls: ['./loc-select.component.scss']
})
export class LocSelectComponent implements OnInit {

  @Input() id: number = 0;
  @Input() my_lat: number = 0;
  @Input() my_lng: number = 0;
  @Input() my_adr: string = '';

  err = false;
  err_outofrng = false;
  // new -1
  latitude = 0;
  longitude = 0;
  zoom: number = 8;
  private geoCoder: any = '';
  locations: locData_[] = [];

  map: any;
  mapClickListener: any;
  trafficLayer: any = '';
  outerCircle: any;
  innerCircle: any;
  service_mtrx: any;
  isLoader = false;

  constructor(private cd: ChangeDetectorRef, private http: HttpClient, private locService: LocImpService
    , private mapsAPILoader: MapsAPILoader, private shrdService: SharedService,
    private ngZone: NgZone) { }

  public ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

  ngOnInit(): void {
    this.isLoader = true;
    let qry: sendQry = { org: [{ lat: this.my_lat, lng: this.my_lng }], des: [], id: [] };
    this.locService.getAllSubLocsById(this.id).subscribe(
      async (data: any[]) => {
        if (data.length > 0) {
          for (const l of data) {
            qry.des.push({ lat: l.lat, lng: l.lng });
            qry.id.push(l.id);
          }
          await qry;
          setTimeout(() => {
            this.getDistanceMatrix(qry).subscribe((rs: locData_[]) => {
              if (rs.length > 0) {
                this.locations = rs;
                this.shrdService.genarate_locs_.next({ items: this.locations });
              }
            });
          }, 5000);
        }
      });
    // -----------------
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.service_mtrx = new google.maps.DistanceMatrixService();
      this.trafficLayer = new google.maps.TrafficLayer();
    });

    // ------------------------------------------

    // ------------------------------------------
    this.isLoader = false;

  }

  drawCircle(map: any, rd: number, fcolr: string, zi: number, clbl: boolean): google.maps.Circle {
    return new google.maps.Circle({
      strokeColor: fcolr,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fcolr,
      fillOpacity: 0.35,
      draggable: false,
      clickable: clbl,
      zIndex: zi,
      map,
      center: { lat: this.my_lat, lng: this.my_lng },
      radius: rd,
    });

  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.trafficLayer.setMap(map);
    if (typeof this.innerCircle == 'undefined') {
      this.innerCircle = this.drawCircle(this.map, 10000, "#FF0000", 1, true);
      this.outerCircle = this.drawCircle(this.map, 40000, "blue", 0, true);
    }
    this.mapClickListener = this.outerCircle.addListener('click', (e: google.maps.MouseEvent) => {
      // this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        this.isLoader = true;
        let sendQuery: sendQry = { org: [{ lat: this.my_lat, lng: this.my_lng }], des: [{ lat: e.latLng.lat(), lng: e.latLng.lng() }], id: [-1] };
        this.getDistanceMatrix(sendQuery).subscribe((rs: locData_[]) => {
          if (rs[0].id && rs[0]) {
            this.addLocn(this.id, rs[0]);
          }
        });
      });
      // google.maps.event.addListener(this.outerCircle, 'click', function() {
      //   alert('hi')
      // });
    });

    this.loadmap(this.map, this);
    setTimeout(() => {
      this.isLoader = false;
    }, 3000)
    this.cd.detectChanges();

  }

  getDistanceMatrix(sendQuery: sendQry) {
    return new Observable<locData_[]>((obs) => {
      // const origin2 = "Greenwich, England";
      // const destinationB = { lat: sendQuery.srcOriginLat, lng: sendQuery.srcOriginLng};

      const service = new google.maps.DistanceMatrixService();
      let tr: any = 'optimistic';
      service.getDistanceMatrix(
        {
          origins: sendQuery.org,
          destinations: sendQuery.des,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          drivingOptions: {
            departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
            trafficModel: tr
          },
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {

          if (status !== "OK") {
            obs.next([
              {
                id: 0, address: '', distance: 0, from: { lat: sendQuery.org[0].lat, lng: sendQuery.org[0].lng },
                traffic: 0, label: this.locations.length + 1, loc: { lat: sendQuery.org[0].lat, lng: sendQuery.org[0].lng }
              }
            ]);
            alert("Error was: " + status);
          } else {
            const originList = response.originAddresses;
            const destinationList = response.destinationAddresses;
            let locn: locData_[] = [];
            for (let i = 0; i < originList.length; i++) {
              const results = response.rows[i].elements;

              for (let j = 0; j < results.length; j++) {
                if (results[j].distance) {
                  // console.log(destinationList[j]);
                  // console.log(results[j].distance.text);
                  // console.log(results[j].distance.value);
                  // console.log(results[j].duration.text);
                  // console.log(results[j].duration.value);
                  // console.log(results[j]);
                  this.err_outofrng = false;
                  this.err = false;
                  if (this.isValid(results[j].distance.value / 1000)) {
                    locn.push({
                      id: sendQuery.id[j], address: destinationList[j], distance: results[j].distance.value, from: { lat: sendQuery.org[0].lat, lng: sendQuery.org[0].lng },
                      traffic: results[j].duration_in_traffic ? results[j].duration_in_traffic.value : results[j].distance.value,
                      label: sendQuery.id[j] == -1 ? this.locations.length + 1 : j + 1, loc: { lat: sendQuery.des[j].lat, lng: sendQuery.des[j].lng }
                    });
                  }
                }
              }
            }
            if (locn.length == 0) {
              locn.push({
                id: 0, address: '', distance: 0, from: { lat: sendQuery.org[0].lat, lng: sendQuery.org[0].lng },
                traffic: 0, label: this.locations.length + 1, loc: { lat: sendQuery.org[0].lat, lng: sendQuery.org[0].lng }
              })
            }
            obs.next(locn);
          }
        }
      );
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markerDragEnd(m: locData_, $event: google.maps.MouseEvent) {
    let l = $event.latLng;
    m.loc.lat = l.lat();
    m.loc.lng = l.lng();
    this.isLoader = true;
    let sendQuery: sendQry = { org: [{ lat: this.my_lat, lng: this.my_lng }], des: [{ lat: l.lat(), lng: l.lng() }], id: [m.id] };
    this.getDistanceMatrix(sendQuery).subscribe((rs: locData_[]) => {
      if (rs[0].id) {
        m.address = rs[0].address;
        m.traffic = rs[0].traffic;
        m.distance = rs[0].distance;
        this.updateLocn(m);
      }
    });
  }

  isValid(d: number): boolean {
    if (!(10 <= d && d < 40)) {
      this.err_outofrng = true;
      // this.locateLisner();
      this.isLoader = false;
      this.cd.detectChanges();
      return false;
    }
    if (this.locations.length > 6) {
      this.err = true;
      this.isLoader = false;
      this.cd.detectChanges();
      // this.locateLisner();
      return false;
    } else {
      // this.locateLisner();
      return true;
    }
  }

  rmvItem(item: any) {
    this.locations.splice(item, 1);
    this.err_outofrng = false;
    this.err = false;
    this.cd.detectChanges();
  }

  refresh() {
    this.locateLisner();
    this.err_outofrng = false;
    this.err = false;
  }

  locateLisner() {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
    this.mapReadyHandler(this.map);
  }

  // CRUD 
  addLocn(org_id: number, m: locData_) {
    this.locService.addLocByaddr(org_id, { address: m.address, lat: m.loc.lat, lng: m.loc.lng }).subscribe((r) => {
      if (r) {
        m.id = r.id;
        this.locations.push(m);
        this.shrdService.genarate_locs_.next({ items: this.locations });
        this.cd.detectChanges();
      }
      this.err_outofrng = false;
      this.err = false;
      this.isLoader = false;
      this.cd.detectChanges();
    });
  }

  updateLocn(m: locData_) {
    this.locService.updatesubLoc(m.id, { address: m.address, lat: m.loc.lat, lng: m.loc.lng }).subscribe((r: DestnR) => {
      if (r) {
        this.shrdService.genarate_locs_.next({ items: this.locations });
        this.cd.detectChanges();
      }
      this.err_outofrng = false;
      this.err = false;
      this.isLoader = false;
      this.cd.detectChanges();
    });
  }

  loadmap(map: google.maps.Map, $this: any) {
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const options = {
      // componentRestrictions: { country: "lk" },
      fields: ["formatted_address", "geometry", "name"],
      origin: map.getCenter(),
      strictBounds: false,
      types: ["establishment"],
    } as google.maps.places.AutocompleteOptions;

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    // autocomplete.setComponentRestrictions({
    //   country: ["us", "lk", "vi", "gu", "mp", "my"],
    // });

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;
    infowindow.setContent(infowindowContent);

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      // marker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      $this.isLoader = true;
      let sendQuery: sendQry = {
        org: [{ lat: $this.my_lat, lng: $this.my_lng }],
        des: [{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }], id: [-1]
      };

      $this.getDistanceMatrix(sendQuery).subscribe((rs: locData_[]) => {
        if (rs[0].id) {
          $this.addLocn($this.id, rs[0]);
        }
      });
    });
  }

}



// just an interface for type safety.
interface marker {
  lat: any;
  lng: any;
  label?: string;
  draggable: boolean;
}
interface sendQry {
  org: dtmtrx[];
  des: dtmtrx[];
  id: number[];
}
interface dtmtrx { lat: any, lng: any };
