//@ts-nocheck
import { runAutox } from "@/utils/autox";

export function getMacAddress(data) {
  console.log(data);
  return runAutox(
    text => {
      // toastLog(text);
      // if (!floaty.checkPermission()) {
      //   // 没有悬浮窗权限，提示用户并跳转请求
      //   toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
      //   floaty.requestPermission();
      //   exit();
      // } else {
      //   toastLog("已有悬浮窗权限");
      // }
      // console.show(true);
      // if (state.w) {
      //   state.w.close();
      // } else {
      //   var w = floaty.rawWindow('<frame gravity="center"> <text id="text">悬浮文字</text></frame>');
      //   state.w = w;
      // }

      runWeb("getValue")
        .then(res => {
          toastLog(res);
        })
        .catch(err => {
          toastLog(err);
        });

      // const mod = require(new Function()());
      // alert(mod);
      //return currentActivity();
      let main = function (s) {
        var result = Promise.resolve("value:" + s);
        return result;
      };
      main("test").then(log);
      // console.log(state);

      return state.toString();
    },
    { data: data }
  );
}

/**
  getMacAddress("1212").then((res) => {
    Snackbar({
      type: "success",
      content: res
    })
  }).catch(err => {

    Snackbar({
      type: "error",
      content: err
    })
  })
 */
