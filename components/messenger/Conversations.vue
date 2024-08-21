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

      <v-list-item v-for="(conversation, i) in listOfConversations"
                   @click="selectConversation(conversation)"
                   :key="i"
                   :value="conversation._id">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <UserAvatar v-if="conversation.type === 'private'"
                      :color="getConversationContact(conversation).color"
                      :online="getConversationContact(conversation).online"
                      :firstName="getConversationContact(conversation).firstName"
                      :lastName="getConversationContact(conversation).lastName"
                      :avatars="getConversationContact(conversation).avatars"/>
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
              <v-label class="text-caption">{{ getConversationDate(conversation) }}</v-label>
            </v-col>
            <v-col class="my-0 py-0 d-flex justify-center" cols="12">
              <label v-if="conversation.unreadCount" class="unreadCount bg-secondary">
                {{ conversation.unreadCount }}
              </label>
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
import PersianDate         from 'persian-date';
import UserAvatar          from "~/components/messenger/UserAvatar.vue";

const emit = defineEmits(['contacts', 'select']);

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

const selectConversation = (conversation) => {
  emit('select', conversation);
};

// get sorted list
const listOfConversations = computed(() => {
  return Object.entries(messengerStore.conversations)
      .sort(([, a], [, b]) => a.updatedAt - b.updatedAt)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
});

// get conversation contact (just in private conversations)
const getConversationContact = (conversation) => {
  switch (conversation.type) {
    case 'private':
      let contactId = conversation.members.find(contact => contact._id !== user.value._id);
      if (contactId && messengerStore.contacts[contactId]) {
        return messengerStore.contacts[contactId];
      } else {
        return {};
      }
      break;
  }
};

// get name of conversation
const getConversationName = (conversation) => {
  switch (conversation.type) {
    case 'private':
      let contact = getConversationContact(conversation);
      if (contact) {
        return contact['firstName'] + ' ' + contact['lastName'];
      }
      break;
  }
};

const getConversationLastMessage = (conversation) => {
  if (messengerStore.messages[conversation._id]) {
    return Object.values(messengerStore.messages[conversation._id]).reduce((latest, current) => {
      return current.updatedAt > latest.updatedAt ? current : latest;
    });
  } else {
    return undefined;
  }
};

const getConversationDate = (conversation) => {
  if (conversation.updatedAt) {
    const nowDate   = new PersianDate();
    const updatedAt = new PersianDate(conversation.updatedAt);

    // check year
    if (updatedAt.year() === nowDate.year()) {

      // check month
      if (updatedAt.month() === nowDate.month()) {

        // check day
        if (updatedAt.day() !== nowDate.day()) {
          return updatedAt.toLocale('fa').format('h:mm a');
        } else {
          return updatedAt.toLocale('fa').format('D MMMM');
        }

      } else {
        return updatedAt.toLocale('fa').format('D MMMM');
      }

    } else {
      return updatedAt.toLocale('fa').format('D MMMM YYYY');
    }


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
        response._data.list.forEach((conversation) => {

          // add conversation to store
          messengerStore.addConversation(conversation);

          // add lastMessage to store
          if (conversation.lastMessage)
            messengerStore.addMessage(conversation.lastMessage);

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
