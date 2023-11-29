declare global {
  interface Window {
    $autox: any;
  }
}
import { ActionSheet, Dialog, Snackbar } from "@varlet/ui";
export const copy = text => {
  window.$autox.callHandler("copy", text);
};

export const runAutox = (fn: Function, data: string | object) => {
  console.log(typeof data == "object");
  data = JSON.stringify(data);
  return new Promise<any>((resolve, reject) => {
    window.$autox.callHandler("runAutox", `(${fn.toString()})(${data})`, result => {
      const res = JSON.parse(result);
      if (res.success) {
        resolve(res.value);
      } else {
        reject(res.error);
      }
    });
  });
};

export const registerRunWebHandler = () => {
  window.$autox.registerHandler("runWeb", (params, callBack) => {
    const { name, data } = JSON.parse(params);
    console.log(name, data);
    let result = {
      success: false,
      value: "ok",
      error: document.createElement("div").ATTRIBUTE_NODE
    };
    return callBack(JSON.stringify(result));
  });
};

try {
  registerRunWebHandler();
} catch (error) {}
