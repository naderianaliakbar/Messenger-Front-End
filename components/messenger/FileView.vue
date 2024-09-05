<template>
  <div class="d-flex w-100 my-2 pa-2">
    <!-- file loading progress  -->
    <v-progress-circular v-if="loading && type === 'file'"
                         v-model="getLoadProgress"
                         color="secondary"
                         size="40"
                         class="">
      <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
    </v-progress-circular>

    <!--  File Avatar   -->
    <v-avatar v-if="!loading && type === 'file'" size="40" color="secondary" icon>
      <v-icon>mdi-file</v-icon>
    </v-avatar>

    <!--  File Name And Size   -->
    <div v-if="type === 'file'" class="d-flex flex-column mx-2">
      <!--  File Name    -->
      <v-label class="fileName text-subtitle-2">{{ props.file.name }}</v-label>

      <!--   File Size    -->
      <v-label class="text-secondary text-caption">{{ size }}</v-label>
    </div>

    <!--   Delete Button    -->
    <v-spacer v-if="type === 'file'"></v-spacer>
    <v-btn v-if="props.delete && type === 'file'"
           class="float-end"
           @click="deleteFile"
           variant=""
           size="small"
           icon>
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>

    <!-- Image File  -->
    <v-img v-if="type === 'image'|| type === 'video'"
           min-height="150"
           :src="src">

      <!--   Delete Button    -->
      <v-btn v-if="props.delete"
             class="float-end"
             @click="deleteFile"
             variant=""
             size="small"
             icon>
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>

      <!--   Play icon for videos    -->
      <div class="d-flex justify-center align-center middleControllers">
        <v-btn v-if="type === 'video' && !loading" disabled variant="flat" icon>
          <v-icon>mdi-play</v-icon>
        </v-btn>


        <!-- loading progress  -->
        <v-progress-circular v-if="loading"
                             v-model="getLoadProgress"
                             class=""
                             color="white"
                             size="40">
          <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
        </v-progress-circular>
      </div>
    </v-img>

    <!-- Video element used for thumbnail generation -->
    <video v-if="type === 'video'" ref="thumbnailVideo" class="d-none"></video>

  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeMount} from "vue";
import {useMessengerStore}             from "~/store/messenger";

// define props
const props          = defineProps({
  file         : {
    required: true
  },
  delete       : {
    type   : Boolean,
    default: false
  },
  uploading    : {
    type   : Boolean,
    default: false
  },
  _message     : {
    type: String
  },
  _conversation: {
    type: String
  },
});
const config         = useRuntimeConfig();
const emit           = defineEmits(['delete']);
const messengerStore = useMessengerStore();
const loading        = ref(false);
const progress       = ref(0);
const loadedBytes    = ref(0);
const type           = ref('file');
const size           = ref('');
const src            = ref(null);
const thumbnailVideo = ref(null);

// generate video thumbnail
const generateThumbnail = (file, callback) => {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')

  thumbnailVideo.value.src = file;


  thumbnailVideo.value.onloadedmetadata = async () => {
    canvas.width  = thumbnailVideo.value.videoWidth
    canvas.height = thumbnailVideo.value.videoHeight

    thumbnailVideo.value.currentTime = 1 // Move to 1 second to avoid black frame at the very start
  }

  thumbnailVideo.value.onseeked = () => {
    ctx.drawImage(thumbnailVideo.value, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        callback(blob)
      }
    }, 'image/jpeg')
  }
};

// get size text
const getSizeText = (size) => {
  if (size === 0) return '0 بایت';
  const k     = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i     = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// get load progress
const getLoadProgress = () => {
  if (props.uploading) {
    return messengerStore.uploads[props._message].uploadedProgress;
  } else {
    return progress.value;
  }
};

const deleteFile = () => {
  emit('delete');
};

const cancelLoading = () => {
  if (props.uploading) {
    // abort the upload
    messengerStore.uploads[props._message].controller.abort();

  }
};

onBeforeMount(() => {

  // check format
  if (props.file.type.startsWith('image/')) {
    type.value = 'image';
  } else if (props.file.type.startsWith('video/')) {
    type.value = 'video';
  } else if (props.file.type.startsWith('audio/')) {
    type.value = 'audio';
  } else {
    type.value = 'file';
  }

  // get the file size
  size.value = getSizeText(props.file.size);

  // set the loading
  if (props.uploading) {
    loading.value = true;
  }
});

onMounted(() => {
  // create src for images
  switch (type.value) {
    case 'image':
      if (props.file instanceof File) {
        src.value = URL.createObjectURL(props.file);
      }
      break;
    case 'video':
      let file = undefined;
      if (props.file instanceof File) {
        file = URL.createObjectURL(props.file);
      } else {
        file = config.public.API_BASE_URL +
            'conversations/' + props._conversation +
            '/files/' + props.file.file;
      }

      generateThumbnail(file, (thumbnailBlob) => {
        src.value = URL.createObjectURL(thumbnailBlob);
      });
      break;
  }
});

</script>

<style scoped>
.fileName {
  direction: ltr;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.middleControllers {
  height: 100%;
}
</style>