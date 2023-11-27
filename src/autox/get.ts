//@ts-nocheck
import { runAutox } from "@/utils/autox";

export function getMacAddress() {
  return runAutox(() => {
    console.log("runAutox");
    console.log(ui);
    return app.versionCode;
  });
}
