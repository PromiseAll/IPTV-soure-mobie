<script lang="ts" setup>
defineProps<{
  componentOptions: any,
  dialogOptions: any
}>()

const isConfirm = ref(false)
const dialogVisible = ref(true)
const instanceRef = ref({})
const confirmClose = () => {
  console.log('confirmClose');
  dialogVisible.value = false
  isConfirm.value = true
}
const cancelClose = () => {
  console.log('cancelClose');
  dialogVisible.value = false
  isConfirm.value = false
}
provide('confirmClose', confirmClose)
provide('cancelClose', cancelClose)
defineExpose({
  dialogVisible,
  isConfirm,
  instanceRef
})
</script>

<template>
  <var-dialog v-if="dialogVisible" v-model:show="dialogVisible" v-bind="dialogOptions" @Confirm="confirmClose" @Cancel="cancelClose">
    <component ref="instanceRef" :is="componentOptions.component" v-bind="componentOptions?.props ?? {}" v-on="componentOptions?.on ?? {}"></component>
  </var-dialog>
</template>
