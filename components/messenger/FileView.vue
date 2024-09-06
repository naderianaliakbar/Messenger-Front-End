<template>
  <div class="d-flex w-100 my-2 pa-2">
    <!-- file loading progress  -->
    <v-progress-circular v-if="loading && type === 'file'"
                         v-model="getLoadProgress"
                         color="secondary"
                         size="40"
                         class="mt-n1">
      <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
    </v-progress-circular>

    <!--  File Avatar   -->
    <v-avatar v-if="!loading && type === 'file' && src" size="40" color="secondary" icon>
      <v-icon>mdi-file</v-icon>
    </v-avatar>

    <!--  Download Avatar   -->
    <v-avatar v-if="!loading && type === 'file' && !src"
              @click="download"
              size="40"
              color="secondary"
              icon>
      <v-icon>mdi-download</v-icon>
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
           class="mt-n2"
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

      <!--   middle icons    -->
      <div class="d-flex justify-center align-center middleControllers">
        <v-btn v-if="type === 'video' && !loading && src" disabled variant="flat" icon>
          <v-icon>mdi-play</v-icon>
        </v-btn>

        <!--  Download Avatar   -->
        <v-avatar v-if="!loading && !src"
                  @click="download"
                  size="40"
                  color="secondary"
                  icon>
          <v-icon>mdi-download</v-icon>
        </v-avatar>

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
import {ref, onMounted, onBeforeMount, watch} from "vue";
import {useMessengerStore}                    from "~/store/messenger";
import {useNuxtApp}                           from "#app";
import axios                                  from "axios";
import {da}                                   from "vuetify/locale";

// define props
const props                = defineProps({
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
  downloading  : {
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
const config               = useRuntimeConfig();
const emit                 = defineEmits(['delete']);
const {$axios, $indexedDB} = useNuxtApp();
const messengerStore       = useMessengerStore();
const loading              = ref(false);
const progress             = ref(0);
const loadedBytes          = ref(0);
const cancelTokenSource    = ref(null);
const type                 = ref('file');
const size                 = ref('');
const src                  = ref(null);
const thumbnailVideo       = ref(null);


// get load progress
const getLoadProgress = computed(() => {
  if (props.uploading) {
    return messengerStore.uploads[props._message].uploadedProgress;
  } else {
    return progress.value;
  }
});

const getBlobOfFile = (file, callback) => {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    callback(e.target.result);
  };
};

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
const getSizeText       = (size) => {
  if (size === 0) return '0 بایت';
  const k     = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i     = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const deleteFile = () => {
  emit('delete');
};

const cancelLoading = () => {
  if (props.uploading) {
    // abort the upload
    messengerStore.uploads[props._message].controller.abort();
  } else {
    if (cancelTokenSource.value) {
      cancelTokenSource.value.cancel();
      cancelTokenSource.value = null;
      loading.value           = false;
    }
  }
};

const download = async () => {
  loading.value = true;

  // check if file saved in localStorage
  let data;
  // check file database for file
  await $indexedDB.loadFile(props.file.file).then(
      (blob) => {
        // founded
        data = blob;
      },
      async (error) => {
        // file not founded so download it
        // create cancel token source
        cancelTokenSource.value = axios.CancelToken.source();

        // download the file
        await $axios.get(
            config.public.API_BASE_URL +
            'conversations/' + props._conversation
            + '/files/' + props.file.file,
            {
              cancelToken       : cancelTokenSource.value.token,
              responseType      : 'blob',
              onDownloadProgress: (progressEvent) => {
                progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              }
            }
        ).then((response) => {
          // set the data
          data = response.data;

          // save file in database
          $indexedDB.saveFile(props.file.file, response.data);

        });
      }
  );

  switch (type.value) {
    case 'image':
      src.value = URL.createObjectURL(data);
      break;
    case 'video':
      generateThumbnail(URL.createObjectURL(data), (thumbnailBlob) => {
        src.value = URL.createObjectURL(thumbnailBlob);
      });
    case 'file':
      src.value = data;
      break;
  }

  loading.value = false;
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
        getBlobOfFile(props.file, (blob) => {
          src.value = blob;
        });
      }
      break;
    case 'video':
      if (props.file instanceof File) {
        getBlobOfFile(props.file, (blob) => {
          generateThumbnail(blob, (thumbnailBlob) => {
            src.value = URL.createObjectURL(thumbnailBlob);
          });
        });
      }
      break;
  }
});

watch(() => props.downloading, (newValue, oldValue) => {
  if (!oldValue && newValue && !(props.file instanceof File)) {
    // start download
    download();

    // disable downloading (for next view)
    messengerStore.disableDownload({
      _id          : props._message,
      _conversation: props._conversation
    });
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