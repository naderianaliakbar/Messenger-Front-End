<template>
  <div class="chatContainer bg-secondary h-100">
    <!--   Chat Loading  -->
    <v-overlay class="d-flex justify-center align-center"
               v-model="chatLoading"
               :close-on-content-click="false"
               persistent
               contained>
      <v-progress-circular size="50" indeterminate></v-progress-circular>
    </v-overlay>

    <!--   Chat   -->
    <v-slide-x-transition>
      <div v-if="conversation.type" class="d-flex flex-column h-100">

        <!-- Header -->
        <div class="border d-flex bg-white">

          <!--   Avatar    -->
          <v-avatar class="my-3 mr-5" color="blue" size="50">A</v-avatar>

          <!--   Title And Status    -->
          <div class="mr-2 mt-2">
            <!--    Title    -->
            <v-label class="d-block">
              <!--     Private Chat      -->
              <span v-if="conversation.type === 'private'">{{ getConversationName() }}</span>
            </v-label>

            <!--   Status   -->
            <v-label class="d-inline-block text-caption">
              <!--     Private Chat     -->
              <span v-if="conversation.type === 'private'">
                {{ getContactStatus() }}
               </span>
            </v-label>
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
          <v-form class="mx-5 w-100" @submit.prevent="sendTextMessage">
            <v-text-field class="messageInput"
                          v-model="form.text"
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
                  <v-btn color="secondary">
                    ارسال
                    <template v-slot:append>
                      <v-icon class="sendIcon">mdi-send-outline</v-icon>
                    </template>
                  </v-btn>
                </div>
              </template>
            </v-text-field>
          </v-form>
        </div>

      </div>
    </v-slide-x-transition>
  </div>
</template>

<script setup>
import {ref}               from "vue";
import {useMessengerStore} from "~/store/messenger";
import {useAPI}            from "~/composables/useAPI";
import {useCookie}         from "#app";

const user           = useCookie('user');
const chatLoading    = ref(false);
const messengerStore = useMessengerStore();
const form           = ref({
  _id            : '',
  action         : 'add',
  text           : '',
  _replyToMessage: undefined
});
const conversation   = ref({
  _id           : '',
  type          : '',
  members       : [],
  _pinnedMessage: undefined
});

// if conversation type is private
const contact = ref(null);

const getConversationName = () => {
  switch (conversation.value.type) {
    case 'private':
      if (contact.value) {
        return contact.value.firstName + ' ' + contact.value.lastName;
      }
      break;
  }
};

// create conversation when is not exist
const createConversation = async () => {
  let body = {};

  switch (conversation.value.type) {
    case 'private':
      body.type    = conversation.value.type;
      body.contact = contact.value._id;
      break;
  }

  await useAPI('conversations', {
    method: 'post',
    body  : body,
    onResponse({response}) {
      if (response.status === 200) {
        messengerStore.addConversation(response._data);
        setConversation(response._data._id);
      }
    }
  });
};

// send text message
const sendTextMessage = async () => {
  // add a new Text Message
  if (form.value.action === 'add') {
    // wait for create conversation
    if (!conversation.value._id) {
      await createConversation();
    }

    await useAPI('conversations/' + conversation.value._id + '/messages', {
      method: 'post',
      body  : {
        type           : 'text',
        content        : form.value.text,
        _replyToMessage: form.value._replyToMessage
      },
      onResponse({response}) {
        if (response.status === 200) {
          messengerStore.addMessage(response._data);
        }
      }
    });
  }
};

// get contact status in private chats
const getContactStatus = () => {
  if (contact.value.status.operation && contact.value.status._conversation === conversation.value._id) {
    switch (contact.value.status.operation) {
      case 'isTyping':
        return 'در حال نوشتن...';
        break;
    }
  } else {
    if (contact.value.online) {
      return 'آنلاین';
    } else {
      return contact.value.lastSeen ?? 'آخرین بازدید اخیرا';
    }
  }
};

// set contact (call from messenger for set receiver)
const setContact = (userId) => {
  conversation.value.type = 'private';
  contact.value           = messengerStore.contacts[userId];
};

// set conversation (call from messenger of createConversation)
const setConversation = (conversationId) => {
  if (messengerStore.conversations[conversationId]) {
    conversation.value = messengerStore.conversations[conversationId];

    // private chats need contact
    switch (conversation.value.type) {
      case 'private':
        let contactId = conversation.value.members.find(contact => contact._id !== user.value._id);
        if (contactId && messengerStore.contacts[contactId]) {
          contact.value = messengerStore.contacts[contactId];
        }
        break;
    }

  } else {
    console.log('conversation is not exist');
  }
};

defineExpose({
  setContact,
  setConversation
});

</script>

<style scoped>
.chatContainer {
  background-image: url('/img/chatbg.png');
  background-repeat: repeat-x;

}

.chatContent {

}

.messageInput {
  border-radius: 0px !important;
}

.sendIcon {
  transform: rotate(180deg);
}
</style>
