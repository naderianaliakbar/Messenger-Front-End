<template>
  <v-overlay class="pa-0" opacity="0.7" persistent>
    <div class="d-flex flex-column fileViewerContainer">
      <!--  Header   -->
      <div>
        <!--    Close     -->
        <v-btn class="control" @click="exit" variant="text" stacked>
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>

      <!--   File    -->
      <div class="d-flex justify-center align-center flex-grow-1 fileContainer pl-0 pl-md-9 pr-md-3">
        <!--    Next File     -->
        <div v-if="conversationFiles.length && conversationFiles[messageIndex + 1]">
          <v-btn class="control"
                 @click="nextFile"
                 variant="text"
                 stacked>
            <v-icon color="white">mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!--    File View     -->
        <div class="flex-grow-1">
          <div class="fileViewContainer">
            <FileView v-if="renderFile && message"
                      ref="fileViewRef"
                      class="h-100 w-100 pl-md-3"
                      :video-controls="true"
                      :video-muted="false"
                      :_id="message._id"
                      :downloading="message.downloading"
                      :downloaded="message.downloaded"
                      :_conversation="props._conversation"
                      :_message="message._id"
                      :file="message.attachment"/>
          </div>
        </div>

        <!--    Previous File     -->
        <div v-if="conversationFiles.length && conversationFiles[messageIndex - 1]">
          <v-btn class="control"
                 @click="previousFile"
                 variant="text"
                 stacked>
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
        </div>

      </div>


      <!--   Action Buttons   -->
      <div>
        <!--    Download     -->
        <v-btn class="control mb-10" variant="text" stacked>
          <v-icon color="white">mdi-download</v-icon>
        </v-btn>
      </div>

    </div>
  </v-overlay>
</template>

<script setup>
import FileView            from "~/components/messenger/FileView.vue";
import {useMessengerStore} from "~/store/messenger";
import {nextTick, watch}   from "vue";

// define props
const props = defineProps({
  _message     : {
    type    : String,
    required: true,
    default : undefined
  },
  _conversation: {
    type    : String,
    required: true,
    default : undefined
  }
});

// define emits
const emit = defineEmits(['exit', 'nextFile', 'previousFile']);

const messengerStore = useMessengerStore();
const fileViewRef    = ref(null);
const renderFile     = ref(true);

const conversationFiles = computed(() => {
  let list = Object.entries(messengerStore.messages[props._conversation])
      .sort(([, a], [, b]) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

  return Object.values(list).filter(
      message => ['image', 'video'].includes(message.type)
  );
});

const message = computed(() => {
  if (props._message && props._conversation) {
    return messengerStore.messages[props._conversation][props._message];
  } else {
    return undefined;
  }
});

const messageIndex = computed(() => {
  return conversationFiles.value.indexOf(message.value);
});

const exit = () => {
  emit('exit');
};

const nextFile = () => {
  renderFile.value = false;
  nextTick(() => {
    emit('nextFile');
    nextTick(() => {
      renderFile.value = true;
      nextTick(() => {
        fileViewRef.value.download();
      });
    });
  });
};

const previousFile = () => {
  renderFile.value = false;
  nextTick(() => {
    emit('previousFile');
    nextTick(() => {
      renderFile.value = true;
      nextTick(() => {
        fileViewRef.value.download();
      });
    });
  });
};


watch(() => props._message, (value, oldValue) => {
  if (value && renderFile.value)
    nextTick(() => {
      fileViewRef.value.download();
    });
});

</script>

<style lang="scss" scoped>
.fileViewerContainer {
  height: 100vh;

  .control {
    z-index: 1;
  }

  .fileContainer {
    width: 100vw;

    .fileViewContainer {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      max-height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
}
</style>