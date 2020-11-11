
const methods = {

    $websocketConnection() {
        return {
            "created_at": "2020-11-10T11:08:47.073626-03:00",
            "namespace": "toucan",
            "name": "spa",
            "image": "nginx:1.14.1",
            "sha256": "32fdf92b4e986e109e4db0865758020cb0c3b70d6ba80d02fe87bad5cc3dc228"
        }
    },

    $hashChanged(oldHash, newHash) {
        if (oldHash !== newHash) {
            return true
        } else {
            return false
        }
    }
}

const DEFAULTS = {
    initHash : ''
};

export default {

    // called by Vue.use(SecondPlugin)
    install(Vue, options = {}) {

        const {
            SockJS,
            Stomp,
        } = options

        // throw errors
        if (!SockJS) throw new Error('Please, specify in the settings your sockjs-client package')
        if (!Stomp) throw new Error('Please, specify in the settings your webstomp-client package.')

        let currentHash = options.initHash || DEFAULTS.initHash
        let isHashNew = false;

        // create a mixin
        Vue.mixin({
            created() {
                console.log('user options', options.initHash);
                console.log('default options', DEFAULTS.initHash);
                console.log('selected options', currentHash);
            },

            mounted() {
                // call method to star listening to websocket
                console.log('mounted. aca me quedo escuchando el websocket');
                let response = methods.$websocketConnection()
                isHashNew = methods.$hashChanged(currentHash, response.sha256)
                if (isHashNew) {
                    currentHash = response.sha256;
                    console.log('hash has changed!')
                }
            }

        });

        // instance methods
        Vue.prototype.$helloMethod = function() {
            console.log('hello from prototype method');
        }
    }
}
