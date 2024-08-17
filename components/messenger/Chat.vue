<template>
  <div class="d-flex flex-column h-100">
    <!--   Chat Loading  -->
    <v-overlay class="d-flex justify-center align-center"
               v-model="chatLoading"
               :close-on-content-click="false"
               persistent
               contained>
      <v-progress-circular size="50" indeterminate></v-progress-circular>
    </v-overlay>

    <!-- Header -->
    <div class="border d-flex">
      <!--   Avatar    -->
      <v-avatar class="my-3 mr-5" color="blue" size="50">A</v-avatar>

      <!--   Title And Status    -->
      <div class="mr-2 mt-2">
        <!--    Title    -->
        <v-label class="d-block">علی‌اکبر نادریان</v-label>

        <!--   Status   -->
        <v-label class="d-inline-block text-caption">آنلاین</v-label>
      </div>

      <!--   Action Icons   -->
      <div class="float-end">

      </div>

    </div>

    <!--  Chat Content  -->
    <div class="flex-grow-1 chatContent">

    </div>

    <!--  Chat Form   -->
    <div class="d-flex">
      <v-form class="mx-5 w-100">
        <v-text-field class="messageInput"
                      variant="solo"
                      placeholder="پیام خود را بنویسید..."
                      autofocus>
          <template v-slot:append-inner>
            <div class="d-flex">
              <!--      Record Sound        -->
              <v-btn variant="text" size="small" icon>
                <v-icon size="22">mdi-microphone</v-icon>
              </v-btn>

              <!--      File        -->
              <v-btn variant="text" size="small" icon>
                <v-icon size="22">mdi-paperclip</v-icon>
              </v-btn>

              <!--       Send       -->
              <v-btn color="secondary" prepend-icon="mdi-send">
                ارسال
              </v-btn>
            </div>
          </template>
        </v-text-field>
      </v-form>
    </div>

  </div>
</template>

<script setup>
import {ref} from "vue";

const chatLoading = ref(false);

</script>

<style scoped>
.chatContent {

}

.messageInput {
  border-radius: 0px !important;
}
</style>
