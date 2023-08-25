import {
    Kuzzle,
    WebSocket
} from "kuzzle-sdk";

export class Client {
    private kuzzle;

    constructor() {
        this.kuzzle = new Kuzzle(
            new WebSocket('localhost')
        );
        this.kuzzle.on('networkError', error => {
            console.error('Network Error: ', error);
        });
    }

    public async connect() {
        await this.kuzzle.connect();
    }

    public async disconnect() {
        this.kuzzle.disconnect();
    }

    public async initDb() {
        try {
            await this.kuzzle.index.create('chat');
            await this.kuzzle.collection.create('chat', 'chat-messages', {
                mappings: {
                    properties: {
                        author: { type: "keyword" },
                        text: { type: "text" },
                    }
                }
            });
            console.log('chat-messages ready!');
        } catch (error) {
            console.error(error.message);
        }
    }

    public async subscribe() {
        try {
            const callback = (notification) => {
                if (notification.type === 'document' && notification.action === 'create') {
                    const {
                        _source: message,
                        _id: id
                    } = notification.result;
                    console.log(`New message by ${message.author} with id ${id}.`);
                }
            };
            await this.kuzzle.realtime.subscribe('chat', 'chat-messages', {}, callback);
        } catch (error) {
            console.error(error.message);
        }
    }

    public async sendMessage() {
        const inquirer = require("@inquirer/prompts")
        try {
            const author = await inquirer.input({ message: 'Enter your name' });
            const text = await inquirer.input({ message: 'Send your message' });

            if (text.length > 255) {
                throw new Error("Message too long !")
            }
            await this.kuzzle.connect();
            const chatMessage = {
                author: author,
                message: text,
            };
            await this.kuzzle.document.create('chat', 'chat-messages', chatMessage);
            console.log('New document successfully created!');

        } catch (error) {
            console.error(error.message);
        }
    }

}


