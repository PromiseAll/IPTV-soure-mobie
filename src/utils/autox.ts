declare global {
  interface Window {
    $autox: any;
  }
}

export const copy = text => {
  window.$autox.callHandler("copy", text);
};
