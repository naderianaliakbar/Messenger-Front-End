<template>
  <v-dialog width="450">
    <v-card class="rounded-lg">
      <v-card-title>
        افزودن مخاطب
        <!--        <v-btn class="float-end"-->
        <!--               @click=""-->
        <!--               size="small"-->
        <!--               variant="plain"-->
        <!--               icon>-->
        <!--          <v-icon>mdi-close</v-icon>-->
        <!--        </v-btn>-->
      </v-card-title>

      <!--  Add Contact Form  -->
      <v-form ref="addContactForm" @submit.prevent="submit">

        <!--    Avatar And firstName And lastName     -->
        <v-row class="mx-5">

          <!--     FirstName And LastName      -->
          <v-col cols="8">

            <!--      FirstName       -->
            <v-text-field class=""
                          v-model="form.firstName"
                          label="نام"
                          :rules="[rules.notEmpty]"
                          variant="outlined"
                          density="compact">

            </v-text-field>

            <!--     LastName       -->
            <v-text-field class=""
                          v-model="form.lastName"
                          label="نام خانوادگی"
                          :rules="[rules.notEmpty]"
                          variant="outlined"
                          density="compact">

            </v-text-field>

          </v-col>

          <!--    Avatar      -->
          <v-col cols="4">
            <v-avatar color="secondary" size="100">
              {{ form.firstName.substr(0,1) + form.lastName.substr(0,1) }}
            </v-avatar>
          </v-col>

        </v-row>

        <v-row class="mx-8 mt-0">
          <!--      Phone       -->
          <v-text-field class=""
                        v-model="form.phone"
                        label="شماره تلفن"
                        :rules="[rules.notEmpty,rules.phone]"
                        variant="outlined"
                        density="compact">

          </v-text-field>
        </v-row>

        <v-card-actions class="mx-5 mb-2 d-flex justify-end">
          <v-btn class="bg-primary px-5 float-end"
                 prepend-icon="mdi-account-plus-outline"
                 :loading="loading"
                 type="submit"
                 color="white">
            افزودن
          </v-btn>
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>

<script setup>

import {useAPI}     from "~/composables/useAPI";
import {useNuxtApp} from "#app";

const {$notify} = useNuxtApp();

const rules = {
  notEmpty: (value) => (value ? true : 'پر کردن این فیلد اجباری است'),
  phone   : (value) =>  {
    const phoneRegex = /^0\d{10}$/;
    if(phoneRegex.test(value)) {
      return true;
    } else {
      return 'فرمت شماره تلفن وارد شده اشتباه است';
    }
  },
};

const action  = ref('add');
const loading = ref(false);
const form    = ref({
  firstName: '',
  lastName : '',
  phone    : ''
});

const addContactForm = ref(null);

const submit = async () => {
  await addContactForm.value.validate();
  if (addContactForm.value.isValid) {
    loading.value = true;

    if (action.value === 'add') {
      await add();
    }

    loading.value = false;
  }
}

const add = async () => {
  await useAPI('contacts', {
    method: 'post',
    body  : {
      firstName: form.value.firstName,
      lastName : form.value.lastName,
      phone    : form.value.phone,
    },
    onResponse({response}) {
      if (response.status === 200) {
        $notify('مخاطب اضافه شد', 'success');
      } else if (response.status === 400) {
        if (response._data && response._data.message) {
          if (response._data.message === 'User Not Found') {
            $notify('کاربر پیدا نشد. از کاربر دعوت کنید در پیام رسان عضو شود', 'error');
          } else if (response._data.message === 'This contact has already been added') {
            $notify('این مخاطب قبلا اضافه شده است', 'error');
          } else {
            $notify('مشکلی در ذخیره کردن مخاطب پیش آمد. لطفا دوباره تلاش کنید', 'error');
          }
        }
      }
    }
  });
};

</script>

<style scoped>

</style>
