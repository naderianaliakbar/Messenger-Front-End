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

      <!--      Search      -->
      <v-text-field class="mt-1 ml-2 mb-2 mb-0"
                    prepend-inner-icon="mdi-magnify"
                    label="جستجو"
                    placeholder="وارد کنید"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details>

      </v-text-field>
    </v-row>

    <!--  Chats List    -->
    <v-list class="listHeight mt-0 pb-5 mb-0 overflow-auto">

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
  </div>
</template>

<script setup>

const emit = defineEmits(['contacts']);

const goToContacts = () => {
  emit('contacts');
};

</script>

<style scoped>
.listHeight {
  height: calc(100vh - 90px)
}
</style>
