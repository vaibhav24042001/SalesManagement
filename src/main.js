import { createApp } from "vue";
import App from "./App.vue";
import store from "./store"; // Import your Vuex store instance
import { registerPlugins } from "./plugins"; // Import any plugins if needed

const app = createApp(App);

app.use(store); // Use the Vuex store instance

registerPlugins(app); // Register any plugins

app.mount("#app");
