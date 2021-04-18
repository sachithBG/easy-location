import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-loc',
  templateUrl: './select-loc.component.html',
  styleUrls: ['./select-loc.component.scss']
})
export class SelectLocComponent implements OnInit {
  zoom = 5;
  map: google.maps.Map | undefined;
  mapClickListener: any;
  addr = '';
  isLoader = false;

  constructor(public dialogRef: MatDialogRef<SelectLocComponent>, @Inject(MAT_DIALOG_DATA) public loc: { lat: any, lng: any }, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.isLoader = true;
    this.map = map;
    if(!this.loc.lat){
      navigator.geolocation.getCurrentPosition((p) => {
        this.loc = { lat: p.coords.latitude, lng: p.coords.longitude };
      },
        (failure) => {
          $.getJSON('https://ipinfo.io/geo', (response) => {
            var loc = response.loc.split(',');
            this.loc = { lat: loc[0], lng: loc[1] };
          });
        });
    }
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.loc.lat = e.latLng.lat();
      this.loc.lng = e.latLng.lng();
      console.log(e);
      // this.getAddress(e.latLng.lat(), e.latLng.lng());
      this.cd.detectChanges();
    });
    this.loadmap(this.map, this);
    setTimeout(() => {
      this.isLoader = false;
    }, 3000)
    this.cd.detectChanges();
  }

  getAddress(latitude: any, longitude: any) {
    let geoCoder = new google.maps.Geocoder;
    geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          let address = results[0].formatted_address;
          console.log(address);

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  markerDragEnd($event: google.maps.MouseEvent) {
    // console.log('dragEnd', $event);
    let l = $event.latLng;
    this.loc.lat = l.lat();
    this.loc.lng = l.lng();
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  add() {
    if (!this.loc) {
      return;
    }
    this.dialogRef.close({ lat: this.loc.lat, lng: this.loc.lng , addr: this.addr});
  }

  loadmap(map: google.maps.Map, $this: any) {

    // const card = document.getElementById("pac-card") as HTMLElement;
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const biasInputElement = document.getElementById(
      "use-location-bias"
    ) as HTMLInputElement;
    const strictBoundsInputElement = document.getElementById(
      "use-strict-bounds"
    ) as HTMLInputElement;
    const options = {
      // componentRestrictions: { country: "my" },
      fields: ["formatted_address", "geometry", "name"],
      origin: map.getCenter(),
      strictBounds: false,
      types: ["establishment"],
    } as google.maps.places.AutocompleteOptions;

    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

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
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      console.log(place.geometry.location.lat());
      console.log(place);
      $this.loc.lat = place.geometry.location.lat();
      $this.loc.lng = place.geometry.location.lng();
      $this.addr = place.formatted_address+'';

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      let pn: any = "place-name";
      let pad: any = "place-address";
      let pf: any = place.formatted_address;
      infowindowContent.children[pn].textContent = place.name;
      infowindowContent.children[pad].textContent = pf;
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id: any, types: any) {
      const radioButton = document.getElementById(id) as HTMLInputElement;
      radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
        input.value = "";
      });
    }

    setupClickListener("changetype-all", []);
    setupClickListener("changetype-address", ["address"]);
    setupClickListener("changetype-establishment", ["establishment"]);
    setupClickListener("changetype-geocode", ["geocode"]);

    biasInputElement.addEventListener("change", () => {
      if (biasInputElement.checked) {
        autocomplete.bindTo("bounds", map);
      } else {
        // User wants to turn off location bias, so three things need to happen:
        // 1. Unbind from map
        // 2. Reset the bounds to whole world
        // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
        autocomplete.unbind("bounds");
        autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
        strictBoundsInputElement.checked = biasInputElement.checked;
      }
      input.value = "";
    });

    strictBoundsInputElement.addEventListener("change", () => {
      autocomplete.setOptions({
        strictBounds: strictBoundsInputElement.checked,
      });

      if (strictBoundsInputElement.checked) {
        biasInputElement.checked = strictBoundsInputElement.checked;
        autocomplete.bindTo("bounds", map);
      }
      input.value = "";
    });
  }
}
