//@ts-nocheck
import { runAutox } from "@/utils/autox";

export function getMacAddress(data) {
  console.log(data);
  return writeFile("55/sdcard/1.txt", "/54545/434");
  return getTextToSelectFile();
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

      return "state.toString()";
    },
    { data: data }
  );
}
export const copy = text => {
  return runAutox(text => {
    setClip(text);
  }, text);
};

// 选择文件路径
export const selectFilePath = (basePath = "/sdcard") => {
  return runAutox(() => {
    return new Promise((resolve, reject) => {
      importPackage(org.autojs.autojs.ui.explorer);
      importPackage(org.autojs.autojs.model.explorer);
      const explorerView = new ExplorerView(new android.view.ContextThemeWrapper(context, org.autojs.autoxjs.R.style.AppTheme));
      explorerView.setExplorer(Explorers.workspace(), ExplorerDirPage.createRoot("/sdcard"));
      explorerView.setDirectorySpanSize(2);
      const dialog = new org.autojs.autojs.theme.dialog.ThemeColorMaterialDialogBuilder(context)
        .title("选择文件")
        .customView(explorerView, false)
        .positiveText("确定")
        // .negativeText("取消")
        .onNegative(() => {
          reject("取消选择");
        })
        // .onPositive(() => {
        //   reject("确定选择");
        // })
        .build();
      explorerView.setOnItemOperatedListener(function (file) {
        dialog.dismiss();
      });
      explorerView.setOnItemClickListener(function (view, item) {
        resolve(item.path);
      });
      com.stardust.app.DialogUtils.showDialog(dialog);
    });
  }, basePath);
};

// 获取文本内容
export const getTextToSelectFile = () => {
  return selectFilePath().then(selectPath => {
    return runAutox(path => {
      return files.read(path);
    }, selectPath);
  });
};

// 写入文件
export const writeFile = (path, data) => {
  return runAutox(
    params => {
      const { path, data } = params;
      files.ensureDir(path);
      files.write(path, data);
      return "写入成功";
    },
    { data, path }
  );
};
