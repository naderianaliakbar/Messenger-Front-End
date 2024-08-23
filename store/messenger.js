import {defineStore} from "pinia";
import {useAPI}      from "~/composables/useAPI";

export const useMessengerStore = defineStore('messenger', {
    state() {
        return {
            conversations: {},
            messages     : {},
            users        : {}
        }
    },
    actions: {
        addUser(user) {

            if (!this.users[user._id])
                this.users[user._id] = {};

            this.users[user._id]['_id']       = user._id;
            this.users[user._id]['firstName'] = user.name.first;
            this.users[user._id]['lastName']  = user.name.last;
            this.users[user._id]['avatars']   = user.avatars;
            this.users[user._id]['color']     = user.color;

            // add online field
            if (!this.users[user._id]['online']) {
                this.users[user._id]['online'] = false;
            }

            // add status field
            if (!this.users[user._id]['status']) {
                this.users[user._id]['status'] = {
                    operation    : '', // isTyping - sendFile - sendVoice
                    _conversation: '' // conversation _id
                };
            }

            // add lastSeen field
            if (!this.users[user._id]['lastSeen']) {
                this.users[user._id]['lastSeen'] = null;
            }
        },
        addConversation(conversation) {

            if (!this.conversations[conversation._id])
                this.conversations[conversation._id] = {};

            this.conversations[conversation._id]['_id']         = conversation._id;
            this.conversations[conversation._id]['type']        = conversation.type;
            this.conversations[conversation._id]['members']     = conversation.members;
            this.conversations[conversation._id]['unreadCount'] = conversation.unreadCount;
            this.conversations[conversation._id]['updatedAt']   = conversation.updatedAt;

            // create messages field if not exists
            if (!this.messages[conversation._id]) {
                this.messages[conversation._id] = {};
            }

            // switch for conversation type and set special fields

        },
        addMessage(message) {

            if (!this.conversations[message._conversation])
                return;

            // create message array
            if (!this.messages[message._conversation][message._id])
                this.messages[message._conversation][message._id] = {};

            this.messages[message._conversation][message._id]['_id']           = message._id;
            this.messages[message._conversation][message._id]['type']          = message.type;
            this.messages[message._conversation][message._id]['_sender']       = message._sender;
            this.messages[message._conversation][message._id]['createdAt']     = message.createdAt;
            this.messages[message._conversation][message._id]['updatedAt']     = message.updatedAt;
            this.messages[message._conversation][message._id]['_conversation'] = message._conversation;
            this.messages[message._conversation][message._id]['_readBy']       = message._readBy;


            // switch for message type and set special fields
            switch (message.type) {
                case 'text':
                    this.messages[message._conversation][message._id]['content'] = message.content;
                    break;
            }

        },
    },
    persist: true
});
