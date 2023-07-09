import AgoraRTC from 'agora-rtc-sdk-ng';



const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const TOKEN = process.env.REACT_APP_AGORA_TOKEN;
const CHANNEL = process.env.REACT_APP_AGORA_CHANNEL;



export function createAgoraClient({ onVideoTrack, onUserDisconnected }: any) {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    let tracks: any;


    
    function waitForConnectionState(connectionState: any) {
        return new Promise((resolve: any) => {
            const interval = setInterval(() => {
                if (client.connectionState === connectionState) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }



    async function connect() {
        await waitForConnectionState('DISCONNECTED');

        let uid;

        if (APP_ID && TOKEN && CHANNEL) {
            uid = await client.join(
                APP_ID,
                CHANNEL,
                TOKEN,
                null
            );
        }
        
        client.on('user-published', (user: any, mediaType: any) => {
            client.subscribe(user, mediaType).then(() => {
                if (mediaType === 'video') {
                    onVideoTrack(user);
                }
            });
        });

        client.on('user-left', (user: any) => {
            onUserDisconnected(user);
        });

        tracks = await AgoraRTC.createScreenVideoTrack({});

        await client.publish(tracks);

        return { tracks, uid }
    };



    async function disconnect() {
        await waitForConnectionState('CONNECTED');

        client.removeAllListeners();

        for (let track of tracks) {
            track.stop();
            track.close();
        }

        await client.unpublish(tracks);
        await client.leave();
    };



    return { disconnect, connect }
}