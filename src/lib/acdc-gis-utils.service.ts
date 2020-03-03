import { Injectable } from '@angular/core';

import * as Terraformer from 'terraformer';
import * as Wkt from 'terraformer-wkt-parser';

@Injectable({
  providedIn: 'root'
})
export class AcdcGisUtilsService {

  constructor() { }

  /**
   * returns wkt string representation of passed geometry
   * @param geometry (GeoJSON geometry or leaflet LatLng)
   */
  toWkt(geometry): string{

    if(geometry && geometry.lat && geometry.lng){
      return `POINT(${geometry.lng} ${geometry.lat})`;
    }

    if(geometry.type && geometry.coordinates){
      return Wkt.convert(geometry);
    }

    return null;

  }

  /**
   * return GeoJSON geometry
   * @param wkt (wkt geometry string)
   */
  fromWkt(wkt: string): any{
    let geometry = Wkt.parse(wkt);
    return geometry;
  }

}
