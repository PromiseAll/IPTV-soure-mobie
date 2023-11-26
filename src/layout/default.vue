<template>
  <div class="h-100vh w-100vw flex flex-col  items-stretch">
    <div class="flex-1 overflow-y-auto">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['home', 'search']">
          <component :is="Component" :key="$route.name" />
        </keep-alive>
      </router-view>
    </div>
    <div>
      <var-bottom-navigation v-model:active="active">
        <var-bottom-navigation-item label="源管理" icon="file-document-outline" @click="$router.push('/home')" />
        <var-bottom-navigation-item label="搜索源" icon="magnify" @click="$router.push('/search')" />
      </var-bottom-navigation>
    </div>
  </div>
</template>
<script setup lang="ts">
const active = ref(0)
</script>
