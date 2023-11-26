import { createComponentDialog } from "../my-dialog/my-dialog.ts";
import MyPlayerDialogContent from "./my-palyer-dialog.vue";
import MyPlayer from "./my-player.vue";
export const showPlayerDialog = (url: string) => {
  return createComponentDialog(
    {
      component: MyPlayer,
      props: {
        url
      }
    },
    {
      title: "预览",
      cancelButton: false,
      width: "100vw",
      dialogStyle: {}
    }
  );
};
