
<template>
  <div class="w-100% h-100% flex flex-col items-stretch justify-between">
    <!-- app bar -->
    <var-app-bar title="源管理">
      <template #right>
        <var-menu-select v-model:show="menuVisible">
          <var-button color="transparent" text-color="#fff" round text>
            <var-icon name="menu" :size="24" />
          </var-button>
          <template #options>
            <var-menu-option @click="showImportActions" label="导入"></var-menu-option>
            <var-menu-option @click="showExportActions" label="导出"></var-menu-option>
            <var-menu-option @click="showOptimizeActions" label="优化"></var-menu-option>
            <var-menu-option @click="saveData" label="保存"></var-menu-option>
            <var-menu-option @click="checkPing" label="PING"></var-menu-option>
            <var-menu-option @click="clearAll" label="清空所有"></var-menu-option>
            <var-menu-option @click="showAbout" label="关于"></var-menu-option>
          </template>
        </var-menu-select>
      </template>
    </var-app-bar>
    <div :key="refreshKey" class="flex-1 basis-0 flex flex-col items-stretch justify-between">
      <var-tabs elevation v-model:active="active">
        <var-tab v-for="group  in listData" :key="group.groupName">{{ group.groupName }}</var-tab>
        <var-tab>
          <var-icon name="plus" @click.stop="addGroup" />
        </var-tab>
      </var-tabs>
      <var-cell ripple>
        <var-button block text outline type="primary" @click.stop="showGroupActions(listData[active])">编辑当前分组</var-button>
      </var-cell>
      <div class="flex-1 basis-0 overflow-y-auto">
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
  </div>
</template>
<script lang="tsx" setup>
import text1 from './2.txt?raw'
import text2 from './2.txt?raw'

import { ref } from 'vue';
import { ParseSource } from "@/utils/source";
import { getPingUrl } from "@/utils/seppd";
import { copy } from "@/autox/get";
import { getTextToSelectFile } from '@/autox/get';
import { ActionSheet, Dialog, Snackbar } from '@varlet/ui';
import { createComponentDialog } from "@/components/my-dialog/my-dialog.ts";
import { showPlayerDialog } from '@/components/my-player/my-palyer-dialog';
import axios from 'axios';
import localForage from "localforage";
const menuVisible = ref(false)
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

// 导入
const showImportActions = () => {
  const showImportInfo = () => {
    Dialog({
      message: '共导入' + m3u8Parse.getAllSources().length + '个源',
      cancelButton: false,
    })
  }
  const showUrlImport = () => {
    const url = ref()
    createComponentDialog({
      component: () => (<var-input v-model={url.value} placeholder="请输入URL" />),
    }).then(() => {
      Snackbar.loading('正在导入')
      axios.get(url.value).then((res) => {
        m3u8Parse = new ParseSource(res.data)
        listData.value = m3u8Parse.data
        Snackbar.success('导入完成')
        showImportInfo()
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
      showImportInfo()
      refreshKey.value = Symbol()
    })
  }

  const showfileImport = () => {
    getTextToSelectFile().then((text) => {
      m3u8Parse = new ParseSource(text)
      listData.value = m3u8Parse.data
      refreshKey.value = Symbol()
    }).then(() => {
      Snackbar.success('导入完成')
      showImportInfo()
    }).catch(err => {
      Snackbar.error(err || '导入失败')
    })
  }

  const localDataImport = () => {
    restoreData()
    showImportInfo()
  }

  ActionSheet({
    actions: [
      {
        name: 'URL导入',
        icon: 'chevron-right',
        callback: () => {
          showUrlImport()
        }
      },
      {
        name: '文件导入',
        icon: 'chevron-right',
        callback: () => {
          showfileImport()
        }
      },
      {
        name: '剪切板导入',
        icon: 'chevron-right',
        callback: () => {
          showTextImport()
        }
      },
      {
        name: '恢复数据',
        icon: 'chevron-right',
        callback: () => {
          localDataImport()
        }
      }
    ] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}

// 导出
const showExportActions = () => {
  const showExportText = () => {
    m3u8Parse.toCopy()
    Snackbar({
      type: "success",
      content: "已复制"
    })
  }
  const showExportFile = () => {
    const path = ref(`/sdcard/m3u8Checker/source_${Date.now()}.txt`)
    createComponentDialog({
      component: () => (<var-input v-model={path.value} placeholder="请输入保存路径" />),
    }).then(() => {
      return m3u8Parse.toDownload(path.value)
    }).then(() => {
      Snackbar.success(`保存成功`)
    }).catch(err => {
      Snackbar.error(err || '保存失败')
    })
  }
  ActionSheet({
    actions: [
      {
        name: '导出剪切板',
        icon: 'chevron-right',
        callback: () => {
          showExportText()
        }
      },
      {
        name: '导出文件',
        icon: 'chevron-right',
        callback: () => {
          showExportFile()
        }
      }
    ] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}

// 优化
const showOptimizeActions = () => {
  ActionSheet({
    actions: [
      {
        name: '删除重复源',
        icon: 'chevron-right',
        callback: () => {
          m3u8Parse.deleteRepeatSources()
          Snackbar.success('成功')
        }
      },
      {
        name: '删除超时源',
        icon: 'chevron-right',
        callback: () => {
          m3u8Parse.deleteTimeoutSources()
          Snackbar.success('成功')
        }
      },
      {
        name: 'PING排序',
        icon: 'chevron-right',
        callback: () => {
          m3u8Parse.sortSources()
          Snackbar.success('成功')
        }
      },
      {
        name: '一键优化',
        icon: 'chevron-right',
        callback: () => {
          m3u8Parse.deleteRepeatSources()
          m3u8Parse.deleteTimeoutSources()
          m3u8Parse.sortSources()
          refreshKey.value = Symbol()
          Snackbar.success('优化完成')
        }
      },
    ] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}


const showGroupActions = (group) => {

  if (!group) return Snackbar.warning('请先添加分组')
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
            component: () => (<var-input placeholder="请输入m3u8地址" v-model={url.value} />),
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

          copy(soucre.url)
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
  Snackbar({
    type: "success",
    content: "已清空所有"
  })
}


// 检测ping并排序
const checkPing = () => {
  Dialog({
    message: '是否开始检测？如果源数量比较多的话耗时可能较长',
    onConfirm: () => {
      Snackbar({
        type: "info",
        content: "检测中...需要几分钟"
      })
      const sources = m3u8Parse.getAllSources()
      getPingUrl(sources.map(source => source.url), (url, ping) => {
        // console.log(url, ping);
        const currentSource = sources.filter(source => source.url == url)
        currentSource.forEach(source => source.ping = ping);
      }).then(() => {
        Snackbar({
          type: "success",
          content: "检测完成"
        })
        Dialog({
          message: '共检测' + sources.length + '个源 \n 有效源数:' + sources.filter(source => source.ping > -1).length + '个 \n 无效源数:' + sources.filter(source => source.ping == -1).length + '个',
          cancelButton: false,
        })
      })
    }
  })



}
// 恢复数据
const restoreData = () => {
  localForage.getItem('m3u8Parse').then((text: string) => {
    if (text) {
      m3u8Parse = new ParseSource(text)
      listData.value = m3u8Parse.data
      Snackbar.success("已从本地恢复")
    }
  })
}
// 保存数据
const saveData = () => {
  localForage.setItem('m3u8Parse', m3u8Parse.toString()).then(() => {
    Snackbar.success("已保存")
  })
}
const showAbout = () => {
  Dialog({
    title: '关于',
    message: '酷安@明天是星期天欸',
    cancelButton: false,
  })
}
onMounted(() => {
  restoreData()
});
</script>
