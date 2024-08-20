import {defineStore} from "pinia";

export const useMessengerStore = defineStore('messenger', {
    state() {
        return {
            conversations: {},
            contacts     : {}
        }
    },
    actions: {
        addContact(_id, contact) {
            this.contacts[_id]['_id']       = _id;
            this.contacts[_id]['firstName'] = contact.firstName;
            this.contacts[_id]['lastName']  = contact.lastName;
            this.contacts[_id]['avatars']   = contact.avatars;
            this.contacts[_id]['color']     = contact.color;

            // add online field
            if (!this.contacts[_id]['online']) {
                this.contacts[_id]['online'] = false;
            }

            // add status field
            if (!this.contacts[_id]['status']) {
                this.contacts[_id]['status'] = {
                    operation    : '', // isTyping - sendFile - sendVoice
                    _conversation: '' // conversation _id
                };
            }

            // add lastSeen field
            if (!this.contacts[_id]['lastSeen']) {
                this.contacts[_id]['lastSeen'] = null;
            }
        },
        addConversation(_id, conversation) {
            this.conversations[_id]['_id']         = conversation._id;
            this.conversations[_id]['type']        = conversation.type;
            this.conversations[_id]['members']     = conversation.members;
            this.conversations[_id]['unreadCount'] = conversation.unreadCount;
            this.conversations[_id]['updatedAt']   = conversation.updatedAt;

            // switch for conversation type and set special fields

        }
    },
    persist: true
});
