import {defineStore} from "pinia";

export const useMessengerStore = defineStore('messenger', {
    state() {
        return {
            conversations: {},
            contacts     : {}
        }
    },
    actions: {
        resetContacts() {
            this.contacts = {};
        },
        addContact(_id, contact) {
            this.contacts[_id] = {
                _id      : _id,
                firstName: contact.firstName,
                lastName : contact.lastName,
                avatars  : contact.avatars,
                color    : contact.color,
                online   : false,
                status   : {
                    operation    : '', // isTyping - sendFile - sendVoice
                    _conversation: '' // conversation _id
                },
                lastSeen : null
            };
        },
        addConversation(_id, conversation) {
            this.conversations[_id] = conversation;
        }
    },
    persist: true
});
