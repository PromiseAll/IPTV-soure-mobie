<template>
  <div :style="{ height: height, width: width }">
    <div ref="playerRef" class="h-100% w-100%"></div>
  </div>
</template>
<script lang="ts" setup>
import Artplayer from 'artplayer';
import Hls from 'hls.js';
const playerRef = ref<HTMLDivElement>()

const props = withDefaults(defineProps<{
  url: string;
  height: string;
  width: string;
}>(), {
  url: '',
  height: '60vw',
  width: '100%',
})

let playerInstance;
const playM3u8 = (video, url, art) => {
  if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy();
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}
onMounted(() => {
  if (playerRef.value) {
    playerInstance = new Artplayer({
      container: playerRef.value,
      url: props.url,
      autoplay: true,
      // fullscreen: true,
      // fullscreenWeb: true,
      type: 'm3u8',
      customType: {
        m3u8: playM3u8,
      },
    })
    playerInstance.on('ready', () => {
      // console.info(playerInstance.flip);
      // playerInstance.flip = '';
      // console.info(playerInstance.flip);
    });
  }
})

onUnmounted(() => {
  console.log('unmount');
  if (playerInstance) {
    playerInstance.destroy()
  }
});

</script>