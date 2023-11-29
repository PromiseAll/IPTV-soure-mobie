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
export const selectFilePath = () => {
  return runAutox(() => {
    var current_dir_array,
      dir = ["/", "sdcard", "/"]; //存储当前目录
    function pathToArray(dir) {
      current_dir_array = [];
      files.listDir(dir.join("")).forEach(i => {
        if (files.isDir(dir.join("") + i)) {
          current_dir_array.push(i + "/");
        } else if (files.isFile(dir.join("") + i)) {
          current_dir_array.push(i);
        }
      });

      // 文件夹排序 文件夹排在前面，文件排在后面
      current_dir_array.sort((a, b) => {
        if (files.isDir(dir.join("") + a) && !files.isDir(dir.join("") + b)) {
          return -1;
        } else if (!files.isDir(dir.join("") + a) && files.isDir(dir.join("") + b)) {
          return 1;
        } else {
          return 0;
        }
      });
      current_dir_array.unshift("返回上级目录");
      return current_dir_array;
    }

    function file_select(select_index) {
      switch (select_index) {
        case undefined:
          break;
        case -1:
          return;
        case 0:
          if (dir.length > 3) {
            dir.pop();
          }
          break;
        default:
          if (files.isFile(files.join(dir.join(""), current_dir_array[select_index]))) {
            let file_name = files.join(dir.join(""), current_dir_array[select_index]);
            // toast(file_name);
            return file_name;
          } else if (files.isDir(files.join(dir.join(""), current_dir_array[select_index]))) {
            dir.push(current_dir_array[select_index]);
          }
      }
      current_dir_array = pathToArray(dir);
      return dialogs.select("文件选择", current_dir_array).then(n => {
        if (n == -1) return Promise.reject("取消选择");
        return file_select(n);
      });
    }
    return file_select();
  });
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
