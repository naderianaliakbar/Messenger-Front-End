<template>
  <v-row class="bg-white mt-3 mr-3 ml-3 mb-0 pa-2 rounded elevation-24 messengerContainer">

    <!--  List   -->
    <v-col v-show="!smAndDown || pageAction === 'list'"
           class="border h-100 px-0 overflow-hidden"
           cols="12"
           md="3">

      <!--   Search And Menu    -->
      <v-row class="d-flex border pt-2 pb-2 mb-0 px-4 mx-0">
        <!--    Navigation Menu Button    -->
        <v-btn class="mt-1 mr-1 ml-2"
               variant="plain"
               icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-text-field class="mt-1 ml-2 mb-2 mb-0"
                      prepend-inner-icon="mdi-magnify"
                      label="جستجو"
                      placeholder="وارد کنید"
                      variant="outlined"
                      density="compact"
                      single-line
                      hide-details>

        </v-text-field>
      </v-row>

      <!--  Chats List    -->
      <v-list class="h-100 mt-0 pb-16 overflow-auto">

        <v-list-item v-for="(item, i) in 100"
                     :key="i"
                     :value="item">
          <!--    Avatar      -->
          <template v-slot:prepend>
            <v-avatar size="55" color="blue">A</v-avatar>
          </template>

          <v-list-item-title>
            علی‌اکبر نادریان
          </v-list-item-title>

          <v-list-item-subtitle class="w-100">
            پیام متنی زیر فرستاده شده توسط علی‌اکبر نادریان است
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-row class="d-inline-block my-0 py-0">
              <v-col class="my-0 py-0" cols="12">
                <v-label class="text-caption">1381/03/02</v-label>
              </v-col>
              <v-col class="my-0 py-0 d-flex justify-center" cols="12">
                <label class="unreadCount bg-secondary">122</label>
              </v-col>
            </v-row>
          </template>

        </v-list-item>
      </v-list>

    </v-col>

    <!--  Chat   -->
    <v-col v-show="!smAndDown || pageAction === 'chat'"
           class="position-relative border py-0 px-0"
           cols="12"
           md="9">
      <Chat/>
    </v-col>

  </v-row>
</template>

<script setup>
import {ref}              from "vue";
import {useDisplay}       from "vuetify";
import Chat               from "~/components/messenger/Chat.vue";

definePageMeta({
  layout      : 'blank',
  middleware  : ['auth'],
  requiresAuth: true,
  // requiresRole: 'admin'
});

// create page action with screen size
const {smAndDown} = useDisplay();
const pageAction  = ref('chat');

// tablet actions is list (at first)
if (smAndDown) {
  if (!pageAction.value)
    pageAction.value = 'list';
}

// watch screen size changed to tablet or smaller
watch(smAndDown, (newValue) => {
  if (newValue) {
    if (!pageAction.value)
      pageAction.value = 'list';
  }
});

const listLoading = ref(false);

</script>

<style scoped>
.messengerContainer {
  height: 95vh;
  box-sizing: border-box;
}

.unreadCount {
  width: 25px;
  height: 25px;
  text-align: center;
  border-radius: 100%;
  font-size: 0.6rem;
  padding-top: 4px;
}
</style>
