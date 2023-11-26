import { createApp } from "vue";
import router from "./router/router";
import "uno.css";
import "./assets/css/style.less";
import "@varlet/ui/es/style";
import App from "./App.vue";
import MyDialog from "@/components/my-dialog/my-dialog";

const app = createApp(App);
app.use(router);
app.use(MyDialog)
app.mount("#app").$nextTick(() => {
  // const userStore = useUserStore()
  // userStore.getUserInfo()
});
