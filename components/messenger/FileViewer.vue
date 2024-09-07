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
        <div>
          <v-btn class="control" variant="text" stacked>
            <v-icon color="white">mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!--    File View     -->
        <div class="flex-grow-1">
          <div class="fileViewContainer">
            <FileView v-if="message"
                      ref="fileViewRef"
                      class="h-100 w-100 pl-md-3"
                      :video-controls="true"
                      :video-muted="false"
                      :_id="message._id"
                      :downloading="message.downloading"
                      :_conversation="props._conversation"
                      :_message="message._id"
                      :file="message.attachment"/>
          </div>
        </div>

        <!--    Previous File     -->
        <div>
          <v-btn class="control" variant="text" stacked>
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
const emit = defineEmits(['exit']);

const messengerStore = useMessengerStore();
const fileViewRef    = ref(null);

const message = computed(() => {
  if (props._message && props._conversation) {
    return messengerStore.messages[props._conversation][props._message];
  } else {
    return undefined;
  }
});

const exit = () => {
  emit('exit');
};


watch(() => props._message, (value, oldValue) => {
  if (value)
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