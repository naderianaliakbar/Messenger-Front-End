import {io} from 'socket.io-client';

export default defineNuxtPlugin(nuxtApp => {
    let socketConnection;
    const config = useRuntimeConfig();
    const token = useCookie('token');

    const createSocketConnection = () => {

        let options = {
            secure: true,
            transports: ['websocket']
        };

        if (token.value) {
            options.query = `token=${token.value}`;
        }

        socketConnection = io(config.public.SOCKET_URL, options);
    };

    const getSocketConnection = () => {
        return socketConnection;
    };


    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            createSocketConnection,
            getSocketConnection
        }
    }
})
