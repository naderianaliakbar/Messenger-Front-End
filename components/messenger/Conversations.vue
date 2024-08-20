<template>
  <div>
    <!--   Search And Menu    -->
    <v-row class="d-flex border pt-2 pb-2 mb-0 px-4 mx-0">

      <!--    Menu Button    -->
      <v-btn class="mt-1 mr-1 ml-2"
             @click=""
             variant="plain"
             icon>
        <v-icon>mdi-menu</v-icon>

        <v-menu class="rounded-lg elevation-0" width="325" activator="parent">
          <v-list>
            <!--        Saved Messages          -->
            <v-list-item prepend-icon="mdi-bookmark-outline" value="savedMessages">
              <v-list-item-title>پیام‌های ذخیره شده</v-list-item-title>
            </v-list-item>

            <!--        Contacts          -->
            <v-list-item prepend-icon="mdi-account-outline"
                         @click="goToContacts"
                         value="contacts">
              <v-list-item-title>مخاطبین</v-list-item-title>
            </v-list-item>

            <!--        Settings          -->
            <v-list-item prepend-icon="mdi-cog-outline" value="settings">
              <v-list-item-title>تنظیمات</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>

      </v-btn>

      <v-label v-if="loading && listAction === 'conversations'">در حال به روز رسانی...</v-label>

      <v-label v-if="listAction === 'conversations'" class="mt-2">
        پیام رسان
      </v-label>

      <!--      Search      -->
      <v-text-field v-if="listAction === 'search'"
                    class="mt-1 ml-2 mb-2 mb-0"
                    prepend-inner-icon="mdi-magnify"
                    append-inner-icon="mdi-close"
                    @click:append-inner="changeListAction('conversations')"
                    label="جستجو"
                    placeholder="وارد کنید"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details>

      </v-text-field>

      <v-spacer v-if="listAction === 'conversations'"></v-spacer>

      <!--   Search Toggle    -->
      <v-btn class="float-end mt-2 mb-2"
             v-if="listAction === 'conversations'"
             @click="changeListAction('search')"
             variant="text"
             size="small"
             icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

    </v-row>

    <!--  Chats List    -->
    <v-list class="listHeight mt-0 pb-5 mb-0 overflow-auto">

      <v-list-item v-for="(conversation, i) in Object.values(messengerStore.conversations)"
                   :key="i"
                   :value="conversation._id">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <v-avatar size="55" color="blue">A</v-avatar>
        </template>

        <v-list-item-title>
          {{ getConversationName(conversation) }}
        </v-list-item-title>

        <v-list-item-subtitle v-if="getConversationLastMessage(conversation)" class="w-100">
          <span v-if="getConversationLastMessage(conversation).type === 'text'">
            {{ getConversationLastMessage(conversation).content }}
          </span>
        </v-list-item-subtitle>

        <template v-slot:append>
          <v-row class="d-inline-block my-0 py-0">
            <v-col class="my-0 py-0" cols="12">
              <v-label class="text-caption">{{ conversation.updatedAt }}</v-label>
            </v-col>
            <v-col class="my-0 py-0 d-flex justify-center" cols="12">
              <label v-if="conversation.unreadCount" class="unreadCount bg-secondary">{{
                  conversation.unreadCount
                }}</label>
            </v-col>
          </v-row>
        </template>

      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>

import {useAPI}            from "~/composables/useAPI";
import {useMessengerStore} from "~/store/messenger";
import {useCookie}         from "#app";

const emit = defineEmits(['contacts']);

const loading    = ref(true);
const listAction = ref('conversations');
const user       = useCookie('user');

// get messenger store
const messengerStore = useMessengerStore();

const goToContacts = () => {
  emit('contacts');
};

const changeListAction = (action) => {
  listAction.value = action;
};

// get name of conversation
const getConversationName = (conversation) => {
  switch (conversation.type) {
    case 'private':
      let contactId = conversation.members.find(contact => contact._id !== user.value._id);
      if (contactId) {
        return messengerStore.contacts[contactId]['firstName'] + ' ' +
            messengerStore.contacts[contactId]['lastName'];
      }
      break;
  }
};

const getConversationLastMessage = (conversation) => {
  if (conversation.messages) {

  } else {
    return undefined;
  }
};

const getConversations = () => {
  loading.value = true;

  useAPI('conversations', {
    method: 'get',
    onResponse({response}) {
      if (response.status === 200) {
        // create temp variable
        let conversationTemp;
        response._data.list.forEach((conversation) => {

          conversationTemp             = {};
          conversationTemp._id         = conversation._id;
          conversationTemp.type        = conversation.type;
          conversationTemp.members     = conversation.members;
          conversationTemp.unreadCount = conversation.unreadCount;
          conversationTemp.updatedAt   = conversation.updatedAt;

          // switch for conversation type and set special fields

          // add to store
          messengerStore.addConversation(conversation._id, conversationTemp);
        });
      }
    }
  });

  loading.value = false;
};

// mounted
onMounted(async () => {
  await nextTick();
  getConversations();
});

</script>

<style scoped>
.listHeight {
  height: calc(100vh - 90px)
}
</style>
