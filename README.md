# SPA Reloader for Vue

Vue Plugin for [SPA Reloader](https://github.com/ToucanSoftware/spa-reloader).

## Setup

To add SPA Reloader Plugin to your Vue project, execute:

```console
# npm
npm i spa-reloader-vue
```

```console
# yarn
yarn add spa-reloader-vue
```
Import the package in main.js, and use it:

```javascript
// main.js
import SpaReloaderVue from 'spa-reloader-vue'

Vue.use(SpaReloaderVue, {spaReloaderURL: "ws://192.168.1.143:8081"});
```
Add a new callback function to be executed every time an image changed event is detected, by calling this method:

```javascript
// everywhere
this.$spaSubscribe(this.myCallbackFunction);
```
