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
  data = typeof data == "object" ? JSON.stringify(data) : data;
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

try {
  JSON.stringify;
} catch (error) {}
