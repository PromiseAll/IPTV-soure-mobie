import { h, render, watch } from "vue";
import dialogConstructor from "./my-dialog.vue";
let _appContext = null;
export default {
  install(app) {
    _appContext = app._context;
  }
};

type myPromise = Promise<any> & { [key: string]: any | Function };

/**
 *
 * @param dialogOptions Dialog 的所有参数 新增 appendToEl 指定弹窗插入的 el
 * @returns
 */

export function createComponentDialog(componentOptions: { component?: object; props?: object; on?: object }, dialogOptions: any = {}, dialogName: string = "") {
  let appendEl = null;
  // 强制弹窗参数
  const defaultDialogOptions: { [key: string]: any } = {
    appendToBody: false,
    destroyOnClose: true
  };
  if (dialogOptions.appendToEl) {
    appendEl = dialogOptions.appendToEl;
  } else {
    appendEl = document.body;
  }
  // 创建vnodes
  const vnode = h(dialogConstructor, { componentOptions, dialogOptions: { ...dialogOptions, ...defaultDialogOptions } });
  // 绑定上下文
  vnode.appContext = _appContext;
  // 创建渲染容器 插入元素
  const container = document.createElement("div");
  render(vnode, container);
  appendEl.appendChild(container);

  const vm = vnode.component;
  const { dialogVisible, isConfirm, instanceRef } = vm.exposed;

  const promise = new Promise<any>((resolve, reject) => {
    watch(dialogVisible, (value, oldValue) => {
      if (!value) {
        if (isConfirm.value) {
          resolve(instanceRef);
        } else {
          reject(instanceRef.value);
        }
        container.remove();
      }
    });
  }) as myPromise;
  promise.dialogName = dialogName;
  promise.close = () => (dialogVisible.value = false);
  return promise;
}
