
<template>
  <div class="w-100% h-100% flex flex-col items-stretch justify-between">
    <!-- app bar -->
    <var-app-bar title="源管理">
      <template #right>
        <var-menu>
          <var-button color="transparent" text-color="#fff" round text>
            <var-icon name="menu" :size="24" />
          </var-button>

          <template #menu>
            <var-cell ripple @click="showUrlImport">URL导入</var-cell>
            <var-cell ripple @click="showTextImport">文本导入</var-cell>
            <var-cell ripple @click="showExportText">导出(剪切板)</var-cell>
            <var-cell ripple @click="showExportFile">导出(下载)</var-cell>
            <var-cell ripple @click="checkPing">检测所有</var-cell>
            <var-cell ripple @click="clearAll">清空所有</var-cell>

          </template>
        </var-menu>
      </template>
    </var-app-bar>
    <div :key="refreshKey" class="flex-1 overflow-y-auto">
      <var-tabs elevation v-model:active="active">
        <var-tab v-for="group  in listData" :key="group.groupName">{{ group.groupName }}</var-tab>
        <var-tab>
          <var-icon name="plus" @click.stop="addGroup" />
        </var-tab>
      </var-tabs>
      <var-cell ripple>
        <var-button block text outline type="primary" size="small" @click.stop="showGroupActions(listData[active])"> <var-icon name="wrench" size="12" class="mr-1" />编辑当前分组</var-button>
      </var-cell>
      <var-collapse v-model="collapseValue" accordion :offset="false" v-if="listData && listData[active]">
        <var-collapse-item v-for="channel  in listData[active].channels" :key="channel.channelName" :title="channel.channelName">
          <template #icon>
            <var-icon @click.stop="showChannelActions(channel)" name="dots-vertical" />
          </template>
          <var-cell ripple v-for="source  in channel.sources" :key="source.url" @click="showSourceActions(source)">
            <div class="flex items-center justify-between">
              <p class="text-sm">{{ source.sourceName }}</p>
              <var-chip type="info" size="mini" class="w-14" v-if="0 < source.ping && source.ping <= 1000">{{ source.ping }}ms</var-chip>
              <var-chip type="success" size="mini" class="w-14" v-if="1000 < source.ping && source.ping <= 2500">{{ source.ping }}ms</var-chip>
              <var-chip type="warning" size="mini" class="w-14" v-if="2500 < source.ping && source.ping <= 10000">{{ source.ping }}ms</var-chip>
              <var-chip type="danger" size="mini" class="w-14" v-if="source.ping <= -1">超时</var-chip>
            </div>
            <div class="text-12px color-gray-400 ">
              <span class="line-clamp-1"> {{ source.url }}</span>
            </div>
          </var-cell>
        </var-collapse-item>
      </var-collapse>
    </div>

  </div>

  <!-- <my-player url="http://dbiptv.sn.chinamobile.com/PLTV/88888890/224/3221226221/index.m3u8"></my-player> -->
  <!-- <MyPalyerDialog url="http://dbiptv.sn.chinamobile.com/PLTV/88888890/224/3221226221/index.m3u8" :show="true" /> -->
</template>
<script lang="tsx" setup>
import text from './1.txt?raw'
import { ref } from 'vue';
import { ParseSource } from "@/utils/source";
import { getPingUrl } from "@/utils/seppd";
import { ActionSheet, Snackbar } from '@varlet/ui';
import { createComponentDialog } from "@/components/my-dialog/my-dialog.ts";
import MyPalyerDialog from '@/components/my-player/my-palyer-dialog.vue';
import { showPlayerDialog } from '@/components/my-player/my-palyer-dialog';
import axios from 'axios';
import { clear } from 'console';
let m3u8Parse = new ParseSource('')
const listData = ref(m3u8Parse.data)
const active = ref(0)
const collapseValue = ref()
const refreshKey = ref(Symbol())
watch(
  active,
  () => {
    collapseValue.value = ''
  }
);

const addGroup = () => {
  const name = ref()
  createComponentDialog({
    component: () => (<var-input placeholder="请输入文本" v-model={name.value} />),
  }, {
    title: '添加分组',
  }).then(() => {
    if (name.value) {
      m3u8Parse.addGroup(name.value)
      refreshKey.value = Symbol()
    }
  })
}

const showUrlImport = () => {
  const url = ref()
  createComponentDialog({
    component: () => (<var-input v-model={url.value} placeholder="请输入URL" />),
  }).then(() => {
    axios.get(url.value).then((res) => {
      m3u8Parse = new ParseSource(res.data)
      listData.value = m3u8Parse.data
      Snackbar({
        type: "success",
        content: "导入成功"
      })
    }).catch(err => {
      console.log(err);
      Snackbar({
        type: "error",
        content: err.message
      })
    })
    refreshKey.value = Symbol()
  })
}

const showTextImport = () => {
  const text = ref()
  createComponentDialog({
    component: () => (<var-input textarea v-model={text.value} placeholder="请输入文本" />),
  }).then(() => {
    m3u8Parse = new ParseSource(text.value)
    listData.value = m3u8Parse.data
    refreshKey.value = Symbol()
  })
}

const showExportText = () => {
  m3u8Parse.toCopy()
  Snackbar({
    type: "success",
    content: "已复制"
  })
}
const showExportFile = () => {
  m3u8Parse.toDownload()
}

const showGroupActions = (group) => {
  ActionSheet({
    actions: [
      {
        name: '重命名',
        icon: 'radio-blank',
        callback: () => {
          const name = ref()
          createComponentDialog({
            component: () => (<var-input placeholder="请输入文本" v-model={name.value} />),
          }).then(() => {
            if (name.value) {
              m3u8Parse.renameGroup(group.groupName, name.value)
              refreshKey.value = Symbol()
            }
          })
        }
      },
      {
        name: '添加频道',
        icon: 'plus',
        callback: () => {
          const url = ref()
          createComponentDialog({
            component: () => (<var-input placeholder="请输入文本" v-model={url.value} />),
          }).then(() => {
            if (url.value) {
              m3u8Parse.addChannel(group.groupName, url.value)
              refreshKey.value = Symbol()
            }
          })
        }

      },
      {
        name: '删除当前分组',
        icon: 'window-close',
        callback: () => {
          active.value = 0
          m3u8Parse.deleteGroup(group.groupName)
          refreshKey.value = Symbol()
        }
      }] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}
const showChannelActions = (channel) => {
  ActionSheet({
    actions: [
      {
        name: '添加信号源',
        icon: 'plus',
        callback: () => {
          console.log('addSource');
          const url = ref()
          createComponentDialog({
            component: () => (<var-input placeholder="请输入文本" v-model={url.value} />),
          }).then(() => {
            if (url.value) {
              m3u8Parse.addSource(channel.groupName, channel.channelName, url.value)
              refreshKey.value = Symbol()
            }
          })
        }
      },
      {
        name: '重命名',
        icon: 'radio-blank',
        callback: () => {
          const name = ref()
          createComponentDialog({
            component: () => (<var-input placeholder="请输入文本" v-model={name.value} />),
          }).then(() => {
            if (name.value) {
              m3u8Parse.renameChannel(channel.groupName, channel.channelName, name.value)
              refreshKey.value = Symbol()
            }
          })
        }
      },
      {
        name: '删除当前频道',
        icon: 'window-close',
        callback: () => {
          m3u8Parse.deleteChannel(channel.groupName, channel.channelName)
          refreshKey.value = Symbol()

        }
      }] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}
const showSourceActions = (soucre) => {
  console.log(soucre);
  ActionSheet({
    actions: [
      {
        name: '播放',
        icon: 'play-circle-outline',
        callback: () => {
          showPlayerDialog(soucre.url)
        }
      },
      {
        name: '复制',
        icon: 'chevron-right',
        callback: () => {
          Snackbar({
            type: "success",
            content: "复制成功！"
          })
          navigator.clipboard.writeText(soucre.url)
        }
      },
      {
        name: '删除',
        icon: 'window-close',
        callback: () => {
          m3u8Parse.deleteSource(soucre.groupName, soucre.channelName, soucre.sourceName)
          refreshKey.value = Symbol()
        }
      },
    ] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}


function clearAll() {
  m3u8Parse = new ParseSource('')
  listData.value = m3u8Parse.data
}

const checkPing = () => {
  const sources = m3u8Parse.getAllSources()
  getPingUrl(sources.map(source => source.url), (url, ping) => {
    // console.log(url, ping);
    const currentSource = sources.find(source => source.url == url)
    currentSource.ping = ping
  })
}


</script>
