<template>
  <v-row class="bg-white ma-0 mb-0 pa-0 rounded elevation-1 messengerContainer">

    <!--  List   -->
    <v-col v-show="!smAndDown || pageAction === 'list'"
           class="border px-0 overflow-hidden"
           cols="12"
           md="3">


      <!--   Chats List    -->
      <v-slide-x-transition>
        <div class="" v-show="listAction === 'chats'">
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
                               @click="changeListAction('contacts')"
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
      </v-slide-x-transition>


      <!--   Contacts List   -->
      <v-slide-x-reverse-transition>
        <Contacts @exit="changeListAction('chats')" v-show="listAction === 'contacts'"/>
      </v-slide-x-reverse-transition>

    </v-col>

    <!--  Chat   -->
    <v-col v-show="!smAndDown || pageAction === 'chat'"
           class="position-relative border py-0 px-0"
           cols="12"
           md="9">
      <Chat/>
    </v-col>

  </v-row>
</template>

<script setup>
import {ref}              from "vue";
import {useDisplay}       from "vuetify";
import Chat               from "~/components/messenger/Chat.vue";
import Contacts           from "~/components/messenger/Contacts.vue";

definePageMeta({
  layout      : 'blank',
  middleware  : ['auth'],
  requiresAuth: true,
  // requiresRole: 'admin'
});

// create page action with screen size
const {smAndDown} = useDisplay();
// page action can be list or chat
const pageAction  = ref('');

// tablet actions is list (at first)
if (smAndDown) {
  if (!pageAction.value)
    pageAction.value = 'list';
}

// watch screen size changed to tablet or smaller
watch(smAndDown, (newValue) => {
  if (newValue) {
    if (!pageAction.value)
      pageAction.value = 'list';
  }
});

const listLoading = ref(false);

// list action can be chats or contacts
const listAction = ref('chats');

const changeListAction = (action) => {
    listAction.value = action;
};

</script>

<style scoped>
.messengerContainer {
  height: 100vh;
  box-sizing: border-box;
}

.listHeight {
  height: calc(100vh - 90px)
}
</style>
