<template>
  <div>

    <!--  Add Contact Dialog   -->
    <AddContact v-model="addContactDialog" />

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
    <v-row v-if="list.length" class="d-flex mt-0 mb-0">
      <v-list class="w-100 pa-0 border bg-secondary px-8">
        <v-list-item prepend-icon="mdi-account-plus-outline" value="addContact">
          افزودن مخاطب
        </v-list-item>
      </v-list>
    </v-row>

    <!--  Contacts List    -->
    <v-list v-if="list.length" class="listHeight mt-0 pb-16 overflow-auto">

      <v-list-item v-for="(item, i) in 100"
                   :key="i"
                   :value="item">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <v-avatar size="55" color="blue">A</v-avatar>
        </template>

        <v-list-item-title>
          علی‌اکبر نادریان
        </v-list-item-title>

        <v-list-item-subtitle class="w-100">
          پیام متنی زیر فرستاده شده توسط علی‌اکبر نادریان است
        </v-list-item-subtitle>

        <template v-slot:append>
          <v-row class="d-inline-block my-0 py-0">
            <v-col class="my-0 py-0" cols="12">
              <v-label class="text-caption">1381/03/02</v-label>
            </v-col>
            <v-col class="my-0 py-0 d-flex justify-center" cols="12">
              <label class="unreadCount bg-secondary">122</label>
            </v-col>
          </v-row>
        </template>

      </v-list-item>

    </v-list>

    <!--  Empty List   -->
    <v-row class="align-center justify-center h-100 text-subtitle-1">
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

import AddContact from "~/components/messenger/AddContact.vue";

const emit = defineEmits(['exit']);

const closeContactsList = () => {
  emit('exit');
};

const list = ref([]);
const addContactDialog = ref(false);

</script>

<style scoped>

.listHeight {
  height: calc(100vh - 90px)
}
</style>
