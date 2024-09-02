<template>
  <v-row class="bg-white ma-0 mb-0 pa-0 rounded elevation-1 messengerContainer">

    <!--  List   -->
    <v-col v-show="!smAndDown || pageAction === 'list'"
           class="border px-0 overflow-hidden"
           cols="12"
           md="3">


      <!--   Chats List    -->
      <v-slide-x-transition>
        <Conversations v-show="listAction === 'chats'"
                       @select="onConversationSelected"
                       @contacts="changeListAction('contacts')">
        </Conversations>
      </v-slide-x-transition>


      <!--   Contacts List   -->
      <v-slide-x-reverse-transition>
        <Contacts @exit="changeListAction('chats')"
                  @select="onContactSelected"
                  v-show="listAction === 'contacts'"/>
      </v-slide-x-reverse-transition>

    </v-col>

    <!--  Chat   -->
    <v-col v-show="!smAndDown || pageAction === 'chat'"
           class="position-relative border py-0 px-0 overflow-hidden"
           cols="12"
           md="9">
      <Chat ref="chat" @exit="changePageAction('list')"/>
    </v-col>

  </v-row>
</template>

<script setup>
import {ref}                   from "vue";
import {useDisplay}            from "vuetify";
import Chat                    from "~/components/messenger/Chat.vue";
import Contacts                from "~/components/messenger/Contacts.vue";
import Conversations           from "~/components/messenger/Conversations.vue";
import {useCookie, useNuxtApp} from "#app";
import {useMessengerStore}     from "~/store/messenger";

definePageMeta({
  layout      : 'blank',
  middleware  : ['auth'],
  requiresAuth: true,
  // requiresRole: 'admin'
});

// get Nuxt App Functions
const {$notify, $getSocketConnection, $destroySocketConnection} = useNuxtApp();

// get user from Cookie
const user = useCookie('user');

// get messenger store
const messengerStore = useMessengerStore();

// create page action with screen size
const {smAndDown} = useDisplay();
// page action can be list or chat
const pageAction  = ref('');

// tablet actions is list (at first)
if (smAndDown) {
  if (!pageAction.value)
    pageAction.value = 'list';
}

// list action can be chats or contacts
const listAction = ref('chats');

// chat app ref
const chat = ref(null);

const changeListAction = (action) => {
  listAction.value = action;
};

const changePageAction = (action) => {
  pageAction.value = action;
};

// on contact selected from contacts list
const onContactSelected = (contact) => {
  chat.value.setContact(contact._id);
  changePageAction('chat');
};

// on contact selected from contacts list
const onConversationSelected = (conversation) => {
  chat.value.setConversation(conversation._id);
  changePageAction('chat');
};

// get socket connection
let socketConnection = $getSocketConnection();

// init socket events
// Messages Events
socketConnection.on('messages:insert', (message) => {
  // add message
  messengerStore.addMessage(message);

  // add unread Counts
  messengerStore.changeReadCount(message._conversation, 'add');
});

socketConnection.on('messages:read', (message) => {
  messengerStore.readMessage(message, message._user);
});

// Conversations Events
socketConnection.on('conversations:insert', (conversation) => {
  messengerStore.addConversation(conversation);
});


// watch screen size changed to tablet or smaller
watch(smAndDown, (newValue) => {
  if (newValue) {
    if (!pageAction.value)
      pageAction.value = 'list';
  }
});

</script>

<style scoped>
.messengerContainer {
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
