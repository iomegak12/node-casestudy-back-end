const webSocketHost = window.location.hostname;
const webSocketPort = window.location.port;
const webSocketProtocol = window.location.protocol;

const webSocketUrl = `${webSocketProtocol}//${webSocketHost}:${webSocketPort}`;
console.info(webSocketUrl);
const socketClient = io.connect(webSocketUrl);

socketClient.on('NewCustomerRecord',
    function (addedRecord) {
        console.info(`New Customer Record Event Emitted, Details : ${JSON.stringify(addedRecord)}`);
    });