import './assets/js/autox.sdk.v1.js';
import VConsole from 'vconsole';
import { createApp } from 'vue';
import router from './router/router';
import 'uno.css';
import './assets/css/style.less';
import '@varlet/ui/es/style';
import { StyleProvider, Themes } from '@varlet/ui';
import App from './App.vue';
import MyDialog from '@/components/my-dialog/my-dialog';

if (import.meta.env.MODE === 'development') new VConsole({ theme: 'dark' });
const app = createApp(App);
app.use(router);
app.use(MyDialog);
app.mount('#app').$nextTick(() => {
  // const userStore = useUserStore()
  // userStore.getUserInfo()
  StyleProvider(Themes.md3Light);
});
