# Gis Utils (Location picker input, gis utils service containing utility functions like converting GeoJSON and WKT formats)

Requires following dependencies:
"leaflet": "^1.6.0",
"terraformer": "^1.0.10",
"terraformer-wkt-parser": "^1.2.1"

Angular versions support - 6,7+


## Latest updates

*29 February 2020* alpha version

## Install

### 1. Install dependencies with npm
```npm

npm install leaflet
npm install terraformer
npm install terraformer-wkt-parser

```

### 2. Install package with npm
```npm

npm install acdc-gis-utils

```

### 2. Import gis module in your project's root module app.module.ts:
```ts

import { AcdcGisUtils } from 'acdc-gis-utils';

imports: [
    AcdcGisUtils
]

```


## Usage

### 1. LocationPickerInputComponent:
```html

<form #form="ngForm">
    <location-picker-input 
        initialLatitude="41.73033005046653" 
        initialLongitude="44.81666564941407" 
        initialZoom="10" 
        [defaultShowMap]="false"
        mapHeight="200px"
        mapWidth="100%"
        [closeOnChoose]="true"
        name="location" [(ngModel)]="location"></location-picker-input>
</form>

<!-- your custom input template (if not provided default will be used) -->
<ng-template #inputFIeldTpl let-props="props" let-onChooseLocation="onChooseLocation" let-propagateChange="propagateChange">
<div class="input-group">
    <input type="text" class="form-control" name="locationValue" [(ngModel)]="props.locationValue" placeholder="Click on map to choose location..." aria-label="Location" readonly>
    <div class="input-group-append">
    <span class="input-group-text" style="cursor: pointer;" (click)="onChooseLocation()">
        <svg aria-hidden="true" class="acdc-svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505.04 442.66l-99.71-99.69c-4.5-4.5-10.6-7-17-7h-16.3c27.6-35.3 44-79.69 44-127.99C416.03 93.09 322.92 0 208.02 0S0 93.09 0 207.98s93.11 207.98 208.02 207.98c48.3 0 92.71-16.4 128.01-44v16.3c0 6.4 2.5 12.5 7 17l99.71 99.69c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.59.1-33.99zm-297.02-90.7c-79.54 0-144-64.34-144-143.98 0-79.53 64.35-143.98 144-143.98 79.54 0 144 64.34 144 143.98 0 79.53-64.35 143.98-144 143.98zm.02-239.96c-40.78 0-73.84 33.05-73.84 73.83 0 32.96 48.26 93.05 66.75 114.86a9.24 9.24 0 0 0 14.18 0c18.49-21.81 66.75-81.89 66.75-114.86 0-40.78-33.06-73.83-73.84-73.83zm0 96c-13.26 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path></svg>
    </span>
    </div>
</div>
</ng-template>

```
Available attributes: <br />
**initialLatitude** - initial latitude for map initial state<br />
**initialLongitude** - initial longitude for map initial state<br />
**initialZoom** - initial zoom for map initial state<br />
**defaultShowMap** - show map by default (if false user can toggle map using input field trigger button) <br />
**mapHeight** - map height <br />
**mapWidth** - map width <br />
**closeOnChoose** - close map after location was choosed <br />

### 2. Import and use gis utils service:
```ts

import { AcdcGisUtilsService } from 'acdc-gis-utils';

constructor( private acdcGisUtilsService: AcdcGisUtilsService ) {}

anyMethod(){

    // converting GeoJSON and WKT formats

	let wkt = 'POINT(44.78576660156251 41.72161808379742)';
    let geom = this.acdcGisUtilsService.fromWkt(wkt);
    console.log(geom);
    let convertedWkt = this.acdcGisUtilsService.toWkt(geom);
    console.log(convertedWkt);

    let polygonWkt = "POLYGON((44.758768 41.710671,44.761058 41.711622,44.764684 41.709894,44.763599 41.708147,44.758571 41.707254,44.757073 41.708111,44.757602 41.709593,44.758768 41.710671))";
    let polygonGeom = this.acdcGisUtilsService.fromWkt(polygonWkt);
    console.log(polygonGeom);
    let convertedPolygonWkt = this.acdcGisUtilsService.toWkt(polygonGeom);
    console.log(convertedPolygonWkt);
	
}

```