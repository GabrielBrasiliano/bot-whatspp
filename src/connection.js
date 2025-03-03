const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('baileys');

const path = require("path");
const pino = require("pino");
const { question, onlyNumbers } = require("./utils");

exports.connect = async function name(params) {
    const { state, saveCreds } = await useMultiFileAuthState(
        path.resolve(__dirname, '..', 'assets', 'auth', 'baileys')
    );

    const { version } = await fetchLatestBaileysVersion();
    const socket = makeWASocket({
        printQRInTerminal: false,
        version,
        logger: pino({ level: "error" }),
        auth: state,
        browser: ["Chrome", "", ""],
        markOnlineOnConnect: true
    });

    if (!socket.authState.creds.registered) {
        const phoneNumber = await question("Informe o seu numero de telefone: ");

        if (!phoneNumber) {
            throw new Error("Número de telefone inválido");
        }

        const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
        console.log(`Código de pareamento: ${code}`);
    }

    socket.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection == "close") {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode != DisconnectReason.loggedOut;

            if (shouldReconnect) {
                exports.connect();
            }
        }
    });

    socket.ev.on("creds.update", saveCreds);
    return socket;
};