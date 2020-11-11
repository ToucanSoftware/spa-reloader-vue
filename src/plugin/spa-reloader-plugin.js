const methods = {
  /**
   * Connect to websockets
   * @param {*} options
   */
  $webSocketsConnect(options) {
    if (!options) {
      return null;
    }
    console.log("Connecting to SPA Relaoad at: ", options.spaReloaderURL);
    let ws = new WebSocket(options.spaReloaderURL);
    ws.onopen = () => {
      console.log("Connected to SPA Relaoad at: ", options.spaReloaderURL);
      // Restart reconnect interval
      options.reconnectInterval = options.reconnectInterval || 1000;
    };

    ws.onmessage = function(event) {
      // New message from the backend - use JSON.parse(event.data)
      methods.handleNotification(event);
    };

    ws.onclose = function(event) {
      console.log(
        "Closing Connection to SPA Relaoad at: ",
        options.spaReloaderURL
      );
      if (event) {
        // Event.code 1000 is our normal close event
        if (event.code !== 1000) {
          let maxReconnectInterval = options.maxReconnectInterval || 3000;
          setTimeout(() => {
            if (options.reconnectInterval < maxReconnectInterval) {
              // Reconnect interval can't be > x seconds
              options.reconnectInterval += 1000;
            }
            methods.$webSocketsConnect();
          }, options.reconnectInterval);
        }
      }
    };

    ws.onerror = function(error) {
      console.log(error);
      ws.close();
    };
    return ws;
  },

  /*
   * Handle notifications
   */
  handleNotification(event) {
    console.log(event);
    //options.store.dispatch('notifications/setNotifications', params.data)
  },

  $webSocketsDisconnect() {
    // Our custom disconnect event
    //ws.close();
  },

  $hashChanged(oldHash, newHash) {
    if (oldHash !== newHash) {
      return true;
    } else {
      return false;
    }
  },
};

const DEFAULTS = {
  spaReloaderURL: "localhost:8081",
  initHash: "",
  reconnectInterval: 1000,
};

export default {
  /**
   * Called by Vue.use to install the plugin
   * @param {*} Vue instance of Vue
   * @param {*} options options of the plugin
   *   - spaReloaderURL: URL of the websocket server
   */
  install(Vue, options = {}) {
    console.log("Plugin Options: ", options);

    const { spaReloaderURL } = options;

    // Validate options
    if (!spaReloaderURL)
      throw new Error(
        "Invalid SPA Reloader URL, please supply the URL where SPA Reloader is running."
      );

    // create a mixin
    Vue.mixin({
      created() {
        // console.log('user options', options.initHash);
        console.log("default options", DEFAULTS.initHash);
        // console.log('selected options', currentHash);
      },

      mounted() {
        // call method to star listening to websocket
        console.log("mounted. aca me quedo escuchando el websocket");
        methods.$webSocketsConnect(options);
        // isHashNew = methods.$hashChanged(currentHash, response.sha256)
        // if (isHashNew) {
        //     currentHash = response.sha256;
        //     console.log('hash has changed!')
        // }
      },
    });
  },
};
