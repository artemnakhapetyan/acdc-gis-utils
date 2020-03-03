import { Component, OnInit, Input, TemplateRef, forwardRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as L from "leaflet";
import { AcdcGisUtilsService } from '../acdc-gis-utils.service';

@Component({
  selector: 'location-picker-input',
  templateUrl: './location-picker-input.component.html',
  styleUrls: ['./location-picker-input.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPickerInputComponent),
      multi: true
    }
  ]
})
export class LocationPickerInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  
  @ViewChild("leafletMapDivRef", {static: true})
  leafletMapDivRef: ElementRef;

  private map: any;

  private marker: any;

  @Input()
  initialZoom: number;

  @Input()
  initialLongitude: number;

  @Input()
  initialLatitude: number;

  @Input()
  closeOnChoose: boolean;
  
  _defaultShowMap: boolean;
  @Input()
  set defaultShowMap(value){
    this._defaultShowMap = value;
    this.configs.showMap = value;
  }
  get defaultShowMap(){
    return this._defaultShowMap;
  }

  @Input()
  mapHeight: string = '200px';

  @Input()
  mapWidth: string = '100%';

  @Input()
  _locationValue: string;
  get locationValue() {
    return  this._locationValue;
  }
  set locationValue(value) {
    this._locationValue = value;
    this.propagateChange(this._locationValue);
    if(value){
      let center = this.acdcGisUtilsService.fromWkt(this.locationValue);
      let latlng = L.latLng(center['coordinates'][1], center['coordinates'][0]);
      this.setMapView(latlng);
    }
  }

  configs = {
    showMap: true,
    map: null
  };

  @Input() 
  inputFIeldTpl: TemplateRef<any>;

  constructor(private acdcGisUtilsService: AcdcGisUtilsService) { }

  ngOnInit() {

    this.configs.showMap = this.defaultShowMap;

    this.initMap()

    if(this.map){
      setTimeout( () => {
        this.map.invalidateSize(false);
      },100);
      this.configs.map = this.map;
    }

  }

  /**
   * initialize map, set initial zoom, add osm layer, call map locate
   */
  initMap(){

    let initialLatLng;
    if(this.initialLongitude && this.initialLatitude){
      initialLatLng = L.latLng( this.initialLatitude, this.initialLongitude );
    }else{
      initialLatLng = L.latLng( 0, 0 );
    }

    let initialZoomLoc;
    if(this.initialZoom && this.initialZoom>0 && this.initialZoom<23){
      initialZoomLoc = this.initialZoom;
    }else{
      initialZoomLoc = 1;
    }

    this.map = L.map(this.leafletMapDivRef.nativeElement, {
      drawControl: false
    }).setView(
      initialLatLng, 
      initialZoomLoc
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.initMapLocate();

  }

  /**
   * start listening to click events for choosing location
   */
  private initMapLocate(){
    this.map.on('click', (event) => {
        let centerWkt = this.acdcGisUtilsService.toWkt(event.latlng);
        this._locationValue = centerWkt;
        this.propagateChange(this._locationValue);
        this.setMapView(event.latlng);
        if(this.closeOnChoose){
          setTimeout( () => {
            this.configs.showMap = false;
          }, 500);
        }
    });
  }

  /**
   * unregister listening click event
   */
  private offMapLocate(){
    this.map.off('click');
  }

  /**
   * input field trigger (show/hide map)
   */
  onChooseLocation(props) {
    props['configs'].showMap = !props['configs'].showMap;
    setTimeout( () => {
      props['configs'].map.invalidateSize(false);
    });
  }

  /**
   * form field required functions
   * @param obj 
   */
  writeValue(obj: any): void {
    this.locationValue = obj;
  }
  propagateChange = (_: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  /**
   * zoom map to passed location and pin location with marker
   * @param latlng 
   */
  private setMapView(latlng){

    this.map.flyTo(latlng, this.map.getZoom(), {
      pan: {
        animate: true,
        duration: 3
      },
      zoom: {
        animate: true,
        duration: 3
      }
    });
    this.locateMarker(latlng);
    
  }
  /**
   * locate marker at passed location
   * @param latlng 
   */
  private locateMarker(latlng){
    if(this.marker){
      this.marker.setLatLng(latlng);
    }else{
      const defaultMarker = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=';
      const defaultMarkerShadow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC';

      var defaultIcon = new L.Icon({
          iconUrl: defaultMarker,
          iconAnchor: [12, 41],
          shadowUrl: defaultMarkerShadow,
      });

      this.marker = L.marker(latlng, { icon: defaultIcon }).addTo(this.map);
    }
  }

  ngOnDestroy() {
    this.offMapLocate();
  }

}
