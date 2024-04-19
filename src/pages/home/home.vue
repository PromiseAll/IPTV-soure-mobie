<template>
  <div class="w-100vw h-100% flex flex-col items-stretch justify-between">
    <var-app-bar title="源管理">
      <template #right>
        <var-menu-select v-model:show="menuVisible">
          <var-button color="transparent" text-color="#fff" round text>
            <var-icon name="menu" :size="24" />
          </var-button>
          <template #options>
            <var-menu-option label="导入"></var-menu-option>
            <var-menu-option label="导出"></var-menu-option>
            <var-menu-option label="优化"></var-menu-option>
            <var-menu-option label="保存"></var-menu-option>
            <var-menu-option label="PING"></var-menu-option>
            <var-menu-option label="清空所有"></var-menu-option>
            <var-menu-option label="关于"></var-menu-option>
          </template>
        </var-menu-select>
      </template>
    </var-app-bar>
    <var-cell ripple>
      <var-button block text outline type="primary">添加分组</var-button>
    </var-cell>
    <div class="h-0 flex-1 basis-0 flex flex-col items-stretch justify-between p-10px">
      <Vtree ref="treeRef" :data="m3u8Parse.treeData" :render="treeRender" selectable></Vtree>
    </div>
    <div class="p-10px flex flex-row items-center justify-center">
      <var-space :size="[10, 10]">
        <var-button type="primary" @click="treeRef.setExpandAll(true)"> 展开 </var-button>
        <var-button type="primary" @click="treeRef.setExpandAll(false)"> 收缩 </var-button>
      </var-space>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import '@wsfe/vue-tree/style.css';
import Vtree, { VTreeNode, VTreeSearch, VTreeDrop } from '@wsfe/vue-tree';
import text1 from './1.txt?raw';
import text2 from './2.txt?raw';

const menuVisible = ref(false);
const treeRef = ref();
import { ParseSource } from '@/utils/source.1';
let m3u8Parse = new ParseSource(text1);
console.log(m3u8Parse.treeData);
const treeRender = node => {
  return (
    <div class="flex justify-between items-center">
      <div class="max-w-70vw truncate">{node.title}</div>
      <div class="flex items-center">
        <var-icon name="dots-vertical" />
      </div>
    </div>
  );
};
</script>
