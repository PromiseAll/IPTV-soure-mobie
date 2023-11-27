declare global {
  interface Window {
    $autox: any;
  }
}

export const copy = text => {
  window.$autox.callHandler("copy", text);
};

export const runAutox = fn => {
  window.$autox.callHandler("runAutox", fn.toString());
};
