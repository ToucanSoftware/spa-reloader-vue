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
Import the package in main.js:

```javascript
// main.js
import SpaReloaderVue from 'spa-reloader-vue'
```

To use it, the plugin needs the 'spaReloaderURL' with the websocket server ip and port.

```javascript
Vue.use(SpaReloaderVue, {spaReloaderURL: "ws://192.168.1.143:8081"});
```

Add a new callback function to be executed every time an image update event is caught, by calling this method:

```javascript
// everywhere
this.$spaSubscribe(this.myCallbackFunction);
```

## Demo

Please, take a look at the Demo Project [here](https://github.com/ToucanSoftware/spa-reloader-demo).
