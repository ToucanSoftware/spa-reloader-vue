import { IsFunction, IsURL, IsLocalStorageAvailable } from "./utils";

const SPA_LOCALSTORAGE_ITEM = "spa-last-event";

const spaplugin = {
  /**
   * Connect to websockets
   * @param {*} options
   */
  $webSocketsConnect(options) {
    if (!options) {
      return;
    }
    this.ws = new WebSocket(options.spaReloaderURL);
    this.ws.onopen = () => {
      console.log("Connected to SPA Reloader at: ", options.spaReloaderURL);
      // Restart reconnect interval
      options.reconnectInterval = options.reconnectInterval || 1000;
    };

    this.ws.onmessage = function(event) {
      // New message from the backend - use JSON.parse(event.data)
      spaplugin.handleNotification(event);
    };

    this.ws.onclose = function(event) {
      console.log(
        "Closing Connection to SPA Reloader at: ",
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
            spaplugin.$webSocketsConnect();
          }, options.reconnectInterval);
        }
      }
    };

    this.ws.onerror = function(error) {
      console.log(error);
      this.ws.close();
    };
  },

  addSpaSubscriber(callback) {
    if (this.cache === undefined || this.cache === null) {
      this.cache = [];
    }
    if (IsFunction(callback)) {
      this.cache.push(callback);
    }
  },

  emitEvent(receivedEvent, storedEvent) {
    if (
      this.cache === undefined ||
      this.cache === null ||
      this.cache.length === 0
    ) {
      return;
    }
    for (let i = 0; i < this.cache.length; i++) {
      let callback = this.cache[i];
      callback(receivedEvent, storedEvent);
    }
  },

  /*
   * Handle notifications
   */
  handleNotification(event) {
    const receivedEvent = JSON.parse(event.data);

    let storedEvent = this.retrieveObjectFromLocalstorage();
    /**
     * If there is not stored object, fire notification.
     */
    if (!storedEvent) {
      this.emitEvent(receivedEvent, null);
      this.saveObjectToLocalstorage(receivedEvent);
    } else {
      /**
       * Compare received event with stored event
       */
      if (this.evalChangeState(receivedEvent, storedEvent)) {
        this.emitEvent(receivedEvent, storedEvent);
        this.saveObjectToLocalstorage(receivedEvent);
      }
    }
  },

  /**
   * Compare the stored event and the recevied event and returns true if we need
   * to fire an update event.
   * @param {*} receivedEvent
   * @param {*} storedEvent
   */
  evalChangeState(receivedEvent, storedEvent) {
    if (storedEvent === undefined || storedEvent === null) {
      return true;
    }
    if (receivedEvent === undefined || receivedEvent == null) {
      return false;
    }
    /* Check for timestamps */
    if (
      storedEvent.created_at !== undefined &&
      storedEvent.created_at !== null &&
      receivedEvent.created_at !== undefined &&
      receivedEvent.created_at !== null
    ) {
      storedEvent.created_at = new Date(storedEvent.created_at);
      receivedEvent.created_at = new Date(receivedEvent.created_at);
      if (
        receivedEvent.created_at.getTime() < storedEvent.created_at.getTime()
      ) {
        return false;
      }
    }
    if (
      storedEvent.current_image.sha256 !== receivedEvent.current_image.sha256
    ) {
      return true;
    }
    return false;
  },

  /**
   * Marshalls an object and saves it to the local storage.
   * @param {*} obj
   */
  saveObjectToLocalstorage(obj) {
    let marshalledObject = JSON.stringify(obj);
    localStorage.setItem(SPA_LOCALSTORAGE_ITEM, marshalledObject);
  },

  /**
   * Retrieves an event object fron the localstorage.
   */
  retrieveObjectFromLocalstorage() {
    let unmarshalledObject = localStorage.getItem(SPA_LOCALSTORAGE_ITEM);
    if (!unmarshalledObject) return null;
    let marshalledObject = JSON.parse(unmarshalledObject);
    return marshalledObject;
  },

  /**
   * Disconect from websocket.
   */
  $webSocketsDisconnect() {
    // Our custom disconnect event
    if (this.ws) {
      this.ws.close();
    }
  },
};

export default {
  /**
   * Called by Vue.use to install the plugin
   * @param {*} Vue instance of Vue
   * @param {*} options options of the plugin
   *   - spaReloaderURL: URL of the websocket server
   */
  install(Vue, options = {}) {
    const { spaReloaderURL } = options;

    // Validate options

    if (!IsURL(spaReloaderURL)) {
      throw new Error(
        "Invalid SPA Reloader URL, please supply the URL where SPA Reloader is running."
      );
    }
    if (!IsLocalStorageAvailable()) {
      throw new Error("Localstorage is not available.");
    }
    /* Connect to websocket */
    spaplugin.$webSocketsConnect(options);

    // create a mixin
    Vue.mixin({
      created() {},
      beforeDestroy() {},
    });

    Vue.prototype.$spaSubscribe = function(callback) {
      spaplugin.addSpaSubscriber(callback);
    };
  },
};
