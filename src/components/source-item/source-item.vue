<script lang="ts" setup>
import { showPlayerDialog } from '@/components/my-player/my-palyer-dialog';
import { ActionSheet, Snackbar } from '@varlet/ui';
defineProps<{
  source: {
    sourceName: string
    url: string
    ping?: number
  }
}>()


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
    ] as any
  }).then((res: any) => {
    res.callback && res.callback()
  })
}

</script>

<template>
  <var-cell @click="showSourceActions(source)">
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
</template>
