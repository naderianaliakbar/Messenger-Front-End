<template>
  <div class="chatContainer">
    <!--   Chat Loading  -->
    <v-overlay class="d-flex justify-center align-center"
               v-model="chatLoading"
               :close-on-content-click="false"
               persistent
               contained>
      <v-progress-circular size="50" indeterminate></v-progress-circular>
    </v-overlay>

    <!--  Chat background   -->
    <div class="position-absolute bg-secondary h-100 w-100">
      <v-img class="chatBg"></v-img>
    </div>

    <!--   Chat   -->
    <v-slide-x-transition>
      <div class="d-flex flex-column h-100">

        <!-- Header -->
        <div v-if="conversation.type" class="border d-flex bg-white chatHeader pb-1">

          <v-btn v-if="smAndDown"
                 @click="closeChat"
                 class="mt-2 mr-2"
                 variant="text"
                 icon>
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>

          <!--   Avatar    -->
          <UserAvatar v-if="conversation.type === 'private'"
                      class="mr-3"
                      :color="contact.color"
                      :online="contact.online"
                      :firstName="contact.firstName"
                      :lastName="contact.lastName"
                      :avatars="contact.avatars"/>

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
        <div class="flex-grow-1 d-flex flex-column pr-md-6 pb-2 pl-md-4 pt-5 chatContent"
             ref="chatContent">

          <!--          -->

          <!--     Messages Loading      -->
          <div v-if="messagesLoading" class="d-flex align-center justify-center">
            <v-progress-circular color="white" indeterminate></v-progress-circular>
          </div>

          <!--     Messages    -->
          <div v-if="conversation._id"
               v-for="(message, index) in listOfMessages"
               v-intersect="onMessageViewed"
               :data-id="message._id"
               class="d-flex mb-1 observerTrigger">

            <v-spacer v-if="message._sender !== user._id"></v-spacer>

            <!--    User Avatar  (self)     -->
            <UserAvatar
                v-if="message._sender === user._id && (index === listOfMessages.length - 1 || (listOfMessages[index + 1] && listOfMessages[index + 1]._sender !== user._id))"
                class="mr-1 ml-1"
                size="40"
                :color="user.color"
                :online="user.online"
                :firstName="user.firstName"
                :lastName="user.lastName"
                :avatars="user.avatars">
            </UserAvatar>

            <!--      Message       -->
            <v-card class="py-1 px-4 messageContainer"
                    :class="[
                message._sender === user._id ? 'rounded-bs-lg bg-lime-accent-1' : 'rounded-bs-lg',
                message._sender === user._id && (index === listOfMessages.length - 1 || (listOfMessages[index + 1] && listOfMessages[index + 1]._sender !== user._id)) ? '' : 'mr-12',
                conversation.type === 'private' && message._sender === contact._id && (index === listOfMessages.length - 1 || (listOfMessages[index + 1] && listOfMessages[index + 1]._sender !== contact._id)) ? '' : 'ml-12'
            ]" flat>

              <!--       Content        -->
              <div v-if="message.type === 'text'" class="text-subtitle-2 mb-1">{{ message.content }}</div>

              <!--      Date - Edited - Read        -->
              <div class="float-end mb-n2 ml-n2 messageInfo">
                <!--        Read Status        -->
                <span v-if="message._sender === user._id" class="read mt-1">
                  <v-icon v-if="message._readBy.length > 1" size="20">mdi-check-all</v-icon>
                  <v-icon v-else size="20">mdi-check</v-icon>
                </span>

                <!--        Date        -->
                <v-label class="text-caption time">
                  {{ new PersianDate(new Date(message.createdAt)).toLocale('fa').format('h:mm a') }}
                </v-label>
              </div>
            </v-card>

            <!--    User Avatar    -->
            <UserAvatar
                v-if="message._sender !== user._id && (index === listOfMessages.length - 1 || (listOfMessages[index + 1] && listOfMessages[index + 1]._sender !== message._sender))"
                class="mr-1 ml-1"
                size="40"
                :color="messengerStore.users[message._sender].color"
                :online="messengerStore.users[message._sender].online"
                :firstName="messengerStore.users[message._sender].firstName"
                :lastName="messengerStore.users[message._sender].lastName"
                :avatars="messengerStore.users[message._sender].avatars">
            </UserAvatar>

          </div>
        </div>

        <!--  Chat Form   -->
        <div v-if="conversation.type" class="d-flex">
          <v-form class="mx-5 w-100" @submit.prevent="sendTextMessage">
            <v-text-field class="rounded-0"
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
                  <v-btn color="secondary" @click="sendTextMessage" type="submit">
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
import {ref, watch, onMounted, onBeforeUnmount, nextTick} from "vue";
import {useMessengerStore}                                from "~/store/messenger";
import {useAPI}                                           from "~/composables/useAPI";
import {useCookie}                                        from "#app";
import UserAvatar                                         from "~/components/messenger/UserAvatar.vue";
import {useDisplay}                                       from "vuetify";
import PersianDate                                        from "persian-date";

const emit            = defineEmits(['exit']);
const {smAndDown}     = useDisplay();
const user            = useCookie('user');
const chatLoading     = ref(false);
const messengerStore  = useMessengerStore();
const form            = ref({
  _id            : '',
  action         : 'add',
  text           : '',
  _replyToMessage: undefined
});
const conversation    = ref({
  _id           : '',
  type          : '',
  members       : [],
  _pinnedMessage: undefined
});
const messagesLoading = ref(false);
// if conversation type is private
const contact         = ref(null);

const listOfMessages = computed(() => {
  const sortedList = Object.entries(messengerStore.messages[conversation.value._id])
      .sort(([, a], [, b]) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

  return Object.values(sortedList);
});


// close chat in smAndDown
const closeChat = () => {
  emit('exit');
};

// get conversation name in different type of conversations
const getConversationName = () => {
  switch (conversation.value.type) {
    case 'private':
      if (contact.value) {
        return contact.value.firstName + ' ' + contact.value.lastName;
      }
      break;
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

// get conversation messages
const getMessages = async () => {
  messagesLoading.value = true;

  await useAPI('conversations/' + conversation.value._id + '/messages', {
    method: 'get',
    onResponse({response}) {
      if (response.status === 200) {
        response._data.list.forEach((message) => {
          messengerStore.addMessage(message);
        });
      }
    }
  });

  messagesLoading.value = false;
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
          form.value.text            = '';
          form.value._replyToMessage = undefined;
          messengerStore.addMessage(response._data);
        }
      }
    });
  }
};

// set contact (call from messenger for set receiver)
const setContact = (userId) => {
  conversation.value      = {};
  conversation.value.type = 'private';
  contact.value           = messengerStore.users[userId];

  // find for conversation
  const conversationFound = Object.values(messengerStore.conversations).find(
      cn => cn.type === 'private' && cn.members.includes(userId)
  );

  if (conversationFound)
    setConversation(conversationFound._id);

};

// set conversation (call from messenger of createConversation)
const setConversation = (conversationId) => {
  if (messengerStore.conversations[conversationId]) {
    conversation.value = messengerStore.conversations[conversationId];

    // private chats need contact
    switch (conversation.value.type) {
      case 'private':
        let contactId = conversation.value.members.find(userId => userId !== user.value._id);
        if (contactId) {
          contact.value = messengerStore.users[contactId];
        }
        break;
    }

  } else {
    console.log('conversation is not exist');
  }
};

const readMessage = async (messageId) => {
  await useAPI('conversations/' + conversation.value._id + '/messages/' + messageId + '/read', {
    method: 'put',
    onResponse({response}) {
      if (response.status === 200) {
        // read message in the store
        messengerStore.readMessage({
          _id          : messageId,
          _conversation: conversation.value._id
        }, user.value._id);
      }
    }
  });
};

// set intersect for messages (read)
const onMessageViewed = (target) => {
  const messageId = target.getAttribute('data-id');
  // check message is not for user and never viewed before
  if (
      messengerStore.messages[conversation.value._id][messageId]._sender !== user.value._id &&
      !messengerStore.messages[conversation.value._id][messageId]._readBy.includes(user.value._id)
  ) {
    readMessage(messageId);
  }
};

const chatContent      = ref(null);
const scrollPosition   = ref(0);
const scrollToBottom   = ref(false);
// handle chat scroll
const handleChatScroll = () => {
  const scrollTop    = chatContent.value.scrollTop;
  const scrollHeight = chatContent.value.scrollHeight;
  const clientHeight = chatContent.value.clientHeight;

  // scroll percent
  scrollPosition.value = (scrollTop / (scrollHeight - clientHeight)) * 100;

  // change scrollToBottom flag
  scrollToBottom.value = (scrollPosition.value < 90);

};

// scroll to bottom
const scrollChatToBottom = () => {
  chatContent.value.scrollTop = chatContent.value.scrollHeight;
};

onMounted(() => {
  nextTick(() => {
    if (chatContent.value) {
      chatContent.value.addEventListener('scroll', handleChatScroll);
    } else {
      console.log(chatContent.value);
    }
  });
});

onBeforeUnmount(() => {
  if (chatContent.value) {
    chatContent.value.removeEventListener('scroll', handleChatScroll);
  }
});

// watch
watch(conversation, () => {
  // load conversation messages
  if (conversation.value._id)
    getMessages();
});

defineExpose({
  setContact,
  setConversation
});

</script>

<style lang="scss" scoped>
.chatContainer {
  height: 100vh;

  .chatBg {
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('/img/chatbg.png');
    background-repeat: repeat;
    opacity: 40%;
  }

  .chatHeader {
    z-index: 2;
  }

  .chatContent {
    z-index: 2;
    overflow-y: auto;
    height: 50vh;

    .messageContainer {
      max-width: 80% !important;

      .messageInfo {
        margin-top: -10px !important;
        position: relative;

        .time {
          font-size: 0.6rem !important;
        }
      }
    }
  }

  .sendIcon {
    transform: rotate(180deg);
  }
}
</style>
