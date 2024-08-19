import {defineStore} from "pinia";

export const useMessengerStore = defineStore('messenger', {
    state() {
        return {
            contacts: []
        }
    },
    actions: {
        resetContacts() {
            this.contacts = [];
        },
        addContact(_id, firstName, lastName, avatars, color) {
            this.contacts.push({
                _id      : _id,
                firstName: firstName,
                lastName : lastName,
                avatars  : avatars,
                color    : color
            });
        },
    },
    persist: true
});
