<template>
  <video
      ref="video"
      class="plyr"
      :controls="options.controls"
      :muted="options.muted"
      playsinline
      autoplay>
  </video>
</template>

<script setup>
import {onMounted, onBeforeMount, onBeforeUnmount, ref} from 'vue';
import Plyr                                                    from 'plyr';


const props = defineProps({
  options: {
    type    : Object,
    required: true,
    default : () => ({
      type    : 'video/mp4',
      controls: false,
      muted   : true
    }),
  },
  src    : {
    type    : String,
    required: true
  },
  events : {
    type   : Object,
    default: () => ({}),
  },
});

const srcURL = ref(null);

const video = ref(null);
let player  = null;

// Initialize the video.js player
onMounted(() => {
  player = new Plyr(video.value, props.options);
  video.value.src = srcURL.value;

  player.muted = props.options.muted;
});

onBeforeMount(() => {
  if (props.src instanceof Blob) {
    srcURL.value = URL.createObjectURL(props.src);
  } else {
    srcURL.value = props.src;
  }
})

// Clean up the player when the component is unmounted
onBeforeUnmount(() => {
  if (player) {
    player.destroy();
  }
});

</script>

<style scoped>

</style>
