export interface User {
    "address": Addrs;
    "email": string;
    "origin": Orgn;
  }
  export interface UserR {
    "id": number;
    "address": Addrs;
    "email": string;
    "origin": Orgn;
  }
  export interface Addrs{
    "house_no": string;
    "street_address": string;
    "city": string;
    "state": string;
    "zipcode": string;
    "country": string;
  }

  export interface Orgn{
    "lat": number;
    "lng": number;
  }

  export interface Destn{
    address : string;
    lat: number;
    lng: number;
  }

  export interface DestnR{
    id: number,
    address : string;
    lat: number;
    lng: number;
  }
