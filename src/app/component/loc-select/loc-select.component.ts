import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LocImpService } from 'src/app/serviceImpl/loc-imp.service';
import { locData_ } from '../loc-view/loc-view.component';

// import { AgmMap, AgmDataLayer } from
// 'angular-google-maps/core';
const myLatlng = { lat: -25.363, lng: 131.044 };
@Component({
  selector: 'app-loc-select',
  templateUrl: './loc-select.component.html',
  styleUrls: ['./loc-select.component.scss']
})
export class LocSelectComponent implements OnInit {
  title = 'My first AGM project';
  my_lat = 6.4224365415385645;
  my_lng = 81.33298873901367;


  // new -1
  latitude = 0;
  longitude = 0;
  zoom: number = 8;
  address: string = '';
  private geoCoder: any = '';
  locations: locData_[] = [];
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  constructor(private cd: ChangeDetectorRef, private http: HttpClient, private locService: LocImpService
    , private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit(): void {



    this.locService.getAllLocsByaddr('').subscribe(
      async (data: locData_[]) => {
        console.log(data);
        this.locations = data;
      });

    // google.maps.event.addListener('click', (e) => {

    // });

    // -----------------
    // this.mapsAPILoader.load().then(() => {
    //   this.geoCoder = new google.maps.Geocoder;
    //   this.setCurrentLocation();

    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });

    // --------------

    // const map = new google.maps.Map(
    //   document.getElementById("map") as HTMLElement,
    //   {
    //     zoom: 4,
    //     center: myLatlng,
    //   }
    // );
    // const marker = new google.maps.Marker({
    //   position: myLatlng,
    //   map,
    //   title: "Click to zoom",
    // });
    // map.addListener("center_changed", () => {
    //   // 3 seconds after the center of the map has changed, pan back to the
    //   // marker.
    //   window.setTimeout(() => {
    //     map.panTo(marker.getPosition() as google.maps.LatLng);
    //   }, 3000);
    // });
    // marker.addListener("click", () => {
    //   map.setZoom(8);
    //   map.setCenter(marker.getPosition() as google.maps.LatLng);
    // });
  }

  // ----------
  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      console.log(e);
      this.lat = e.latLng.lat();
      this.lng = e.latLng.lng();
      this.locations.push({id: 1, distance: 200, traffic: 'no', loc_no: 5, loc : {lat: e.latLng.lat(), lng: e.latLng.lng()}})
      this.markers.push({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        draggable: true
      });
      // this.zone.run(() => {
      // Here we can get correct event
      console.log(e.latLng.lat(), e.latLng.lng());
      // });
    });
    this.cd.detectChanges();
  }
  // ----------




  // google maps zoom level

  // initial center position for the map
  lat: number = 6.321590100435941;
  lng: number = 81.2981629371643;

  onChooseLocation(event: any) {
    console.log(event);
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  clicked(clickEvent: any) {
    console.log(clickEvent);
  }

  mapClicked($event: any) {
    console.log($event);

    // this.markers.push({
    //   lat: $event.latLng.lat,
    //   lng: $event.latLng.lng,
    //   draggable: true
    // });
  }

  crnlocation() {
    navigator.geolocation.getCurrentPosition((p) => {
      this.lat = p.coords.latitude;
      this.lng = p.coords.longitude;
      this.zoom = 10;
    })
  }

  markerDragEnd(m: marker, $event: google.maps.MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  map: google.maps.Map | undefined;
  mapClickListener: any;
  sendQuery = { srcOriginLat: '55.930385', srcOriginLng: '-3.118425', srcDestinationLat: '50.087692', srcDestinationLng: '14.421150' };

  getDistanceMatrix(sendQuery: any) {
    this.locService.getDistanceMatrix(sendQuery).subscribe((r) => {
      console.log(r);
      return r;
    });
  }


  public ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }
  markers: marker[] = [
    {
      lat: 6.605672642606247,
      lng: 81.4816292142578,
      label: 'A',
      draggable: true
    },
    {
      lat: 6.501984591945294,
      lng: 81.58874591347654,
      label: 'B',
      draggable: false
    },
    {
      lat: 6.3778036838555785,
      lng: 81.45073016640623,
      label: 'C',
      draggable: true
    }
  ]

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

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