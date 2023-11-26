<template>
  <div class="w-100% h-100% flex flex-col items-stretch justify-between">
    <!-- app bar -->
    <var-app-bar title="搜索源">

    </var-app-bar>
    <div class="flex items-center justify-between p-2">
      <var-input class="flex-1 mr-2" variant="outlined" placeholder="请输入关键字" v-model="serchValue" size="small" />
      <var-button @click="searchFn" type="primary" class="h-[10.5vw]">搜索</var-button>
    </div>
    <div class="flex-1 overflow-y-auto" :key="refreshKey">
      <var-loading description="LOADING" :loading="loading" class="h-100% w-100%">
        <template v-if="sourcesList && sourcesList.length > 0">
          <source-item v-for="item in sourcesList" :source="item" :key="`${item.url}-${item.ping}`"></source-item>

        </template>
        <template v-else>
          <var-result class="result" type="empty" image-size="30" description="结果为空哦~">
          </var-result>
        </template>
      </var-loading>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { getSourcesByHtml } from '@/utils/search';
import { getPingUrl } from '@/utils/seppd';
import axios from "axios";
const serchValue = ref('')
const sourcesList = ref([])
const loading = ref(false)
const refreshKey = ref(Symbol())
const searchFn = () => {
  loading.value = true
  return axios.post(`http://tonkiang.us/?page=1&s=${serchValue.value}`).then(res => {
    const list = getSourcesByHtml(res.data)
    getPingUrl(list.map(item => item.url), (url, ping) => {
      const currentSource = list.find(source => source.url == url)
      currentSource.ping = ping
      refreshKey.value = Symbol()
    })
    sourcesList.value = list
  }).finally(() => {
    loading.value = false
  })
}

</script>
