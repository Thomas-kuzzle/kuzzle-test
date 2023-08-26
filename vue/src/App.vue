<template>
  <img alt="Vue logo" src="./assets/logo.png">

  <div v-if="!validate">
    <input autofocus v-on:keyup.enter="valid" type="text" v-model="username" placeholder="Enter your nickname" />
    <button @click="valid">Valid</button>
  </div>
  <div class="wrapper" v-else>
    <input autofocus type="text" v-model="message" v-on:keyup.enter="sendMessage" placeholder="Enter your message" />
    <button @click="sendMessage">Send</button>
  </div>
  <div v-for="message in messages" :key="message._id"
    :class="`messages ${message.username === username ? 'fromMe' : 'fromOthers'}`">
    <span class="username">{{ message.username }}</span>
    <span>({{ getDate(message.createdAt) }})</span>
    <p>{{ message.value }}</p>
  </div>
</template>

<script>

import kuzzle from "./services/kuzzle";

export default {
  name: 'App',
  data() {
    return {
      message: "",
      messages: [],
      roomID: "",
      username: "",
      validate: false
    }
  },
  methods: {
    async valid() {
      // Etablish the connection
      await kuzzle.connect();
      await this.subscribeMessages();
      await this.subscribeBadWord();
      this.validate = true;
    },
    getDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString().split("GMT")[0];
    },

    getMessage(document) {
      const message = {
        // The unique id of the document containing the message
        _id: document._id,
        // The text of the message
        value: document._source.message,
        // The creation date
        createdAt: document._source._kuzzle_info.createdAt,
        // The author name
        username: document._source.username
      };
      return message;
    },

    getMessageBadWord(document) {
      let mess = "";
      if (this.username === document._source.username) {
        mess = "stay polite !";
      } else {
        mess = document._source.username + " is not polite !";
      }
      const message = {
        _id: document._id,
        value: mess,
        createdAt: document._source._kuzzle_info.createdAt,
        username: document._source.username
      };
      return message;
    },

    async sendMessage() {
      if (this.message.length > 255) return;
      if (this.username === "") return;
      if (this.message === "") return;
      await kuzzle.query({
        controller: "realtime",
        action: "publish",
        index: "chat",
        collection: "vue-messages",
        body: {
          username: this.username,
          message: this.message,
        }
      });
      this.message = "";
    },
    async subscribeBadWord() {
      const { result } = await kuzzle.query({
        controller: "realtime",
        action: "subscribe",
        index: "chat",
        collection: "vue-messages",
        body: {
          regexp: {
            message: `\\b(?:zut)\\b`,
          }
        }
      });

      kuzzle.protocol.on(result.channel, (notification) => {
        console.log("zut !!")
        if (notification.type !== "document") return;
        if (notification.action !== "publish") return;
        this.messages = [
          this.getMessageBadWord(notification.result),
          ...this.messages
        ];
      });
    },
    async subscribeMessages() {
      const { result } = await kuzzle.query({
        controller: "realtime",
        action: "subscribe",
        index: "chat",
        collection: "vue-messages",
        body: {
        }
      });

      kuzzle.protocol.on(result.channel, (notification) => {        
        if (notification.type !== "document") return;
        if (notification.action !== "publish") return;
        this.messages = [
          this.getMessage(notification.result),
          ...this.messages
        ];
      });
    },
  },

}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
}

.messages {
  padding: 10px;
  margin: 1px;
  width: 45vw;
  border-radius: 10px;
}

.fromMe {
  text-align: right;
  float: right;
  margin-left: 49vw;
  background-color: #9ca4f0;
}

.fromOthers {
  text-align: left;
  margin-right: 49vw;
  float: left;
  background-color: rgb(206, 246, 147);
}
</style>
