import { Client } from "./src/client";

const run = async () => {
    const client: Client = new Client();
    await client.connect();
    await client.initDb();
    await client.subscribe();
    await client.sendMessage();
    await client.disconnect();
};

run();