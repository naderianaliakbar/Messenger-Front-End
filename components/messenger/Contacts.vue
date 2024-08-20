<template>
  <div>

    <!--  Add Contact Dialog   -->
    <AddContact v-model="addContactDialog"/>

    <!--   Search And Back    -->
    <v-row class="d-flex border pt-2 pb-2 mb-0 px-4 mx-0">

      <!--    Menu Button    -->
      <v-btn class="mt-1 mr-1 ml-2"
             @click="closeContactsList"
             variant="plain"
             icon>
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <!--   Search   -->
      <v-text-field class="mt-1 ml-2 mb-2 mb-0 d-block"
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="جستجو"
                    placeholder="وارد کنید"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details>

      </v-text-field>
    </v-row>

    <!--  Add Contact   -->
    <v-row v-if="Object.values(messengerStore.contacts).length" class="d-flex mt-0 mb-0">
      <v-list class="w-100 pa-0 border px-2">
        <v-list-item prepend-icon="mdi-account-plus-outline"
                     @click="addContactDialog = true"
                     value="addContact">
          افزودن مخاطب
        </v-list-item>
      </v-list>
    </v-row>

    <!--  Loading   -->
    <v-row v-if="loading" class="d-flex mt-0 mb-0">
      <v-list class="w-100 pa-0 border px-8 bg-blue">
        <v-list-item value="loading">
          در حال به روز رسانی...
          <template v-slot:prepend>
            <v-progress-circular class="ml-4" indeterminate></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-row>

    <!--  Contacts List    -->
    <v-list v-if="Object.values(messengerStore.contacts).length" class="listHeight mt-0 pb-16 overflow-auto">

      <v-list-item v-for="(contact, i) in list"
                   @click="selectContact(contact)"
                   class=""
                   :key="i"
                   :value="contact">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <v-avatar size="55" color="blue">
            {{ contact.firstName.substr(0, 1) + contact.lastName.substr(0, 1) }}
          </v-avatar>
        </template>

        <v-list-item-title>
          {{ contact.firstName + ' ' + contact.lastName }}
        </v-list-item-title>


      </v-list-item>

    </v-list>

    <!--  Empty List   -->
    <v-row v-if="!Object.values(messengerStore.contacts).length && !loading" class="align-center justify-center h-100 text-subtitle-1">
      <v-label>هیچ مخاطبی ندارید.</v-label>
      <v-label>میتوانید با کلیک روی دکمه زیر مخاطب اضافه کنید.</v-label>
      <v-btn class="mt-5 rounded-xl"
             prepend-icon="mdi-account-plus-outline"
             @click="addContactDialog = true"
             color="secondary">
        افزودن مخاطب
      </v-btn>
    </v-row>

  </div>
</template>

<script setup>

import AddContact          from "~/components/messenger/AddContact.vue";
import {useAPI}            from "~/composables/useAPI";
import {useMessengerStore} from "~/store/messenger";

// get messenger store
const messengerStore = useMessengerStore();

const emit = defineEmits(['exit', 'select']);

const closeContactsList = () => {
  emit('exit');
};

const loading          = ref(true);
const addContactDialog = ref(false);
const search           = ref('');

const list = computed(() => {
  if (search.value) {
    let names = search.value.split(' ');
    return Object.values(messengerStore.contacts).filter(user => {
      // Check for different search conditions similar to server-side logic
      const fullName  = `${user.firstName} ${user.lastName}`.toLowerCase();
      const firstName = user.firstName.toLowerCase();
      const lastName  = user.lastName.toLowerCase();

      return (
          // Search assuming all words are in `first`
          firstName.includes(names.join(' ').toLowerCase()) ||
          // Search assuming all words are in `last`
          lastName.includes(names.join(' ').toLowerCase()) ||
          // Search assuming the first word is in `first` and the rest in `last`
          (names.length > 1 && firstName.includes(names[0].toLowerCase()) && lastName.includes(names.slice(1).join(' ').toLowerCase())) ||
          // Search assuming the first word is in `last` and the rest in `first`
          (names.length > 1 && lastName.includes(names[0].toLowerCase()) && firstName.includes(names.slice(1).join(' ').toLowerCase()))
      );
    });
  } else {
    return Object.values(messengerStore.contacts);
  }
});

const getContacts = () => {
  loading.value = true;

  useAPI('contacts', {
    method: 'get',
    onResponse({response}) {
      if (response.status === 200) {
        // add every contact to store
        response._data.list.forEach((contact) => {
          messengerStore.addContact(contact._user._id, {
            firstName: contact.name.first,
            lastName : contact.name.last,
            avatars  : contact._user.avatars,
            color    : contact._user.color
          });
        });

      }
    }
  });

  loading.value = false;
};

const selectContact = (contact) => {
  emit('select', contact);
};

// mounted
onMounted(async () => {
  await nextTick();
  getContacts();
});

</script>

<style scoped>

.listHeight {
  height: calc(100vh - 140px)
}
</style>
