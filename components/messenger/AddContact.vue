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
            <v-avatar color="secondary" size="100">A</v-avatar>
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

const rules = {
  notEmpty: (value) => (value ? true : 'پر کردن این فیلد اجباری است'),
  phone   : (value) => (value.length === 11 ? true : 'شماره موبایل باید ۱‍۱ رقمی باشد'),
};

const form = ref({
  firstName: '',
  lastName : '',
  phone    : ''
});

const addContactForm = ref(null);

const submit = async () => {
  await addContactForm.value.validate();
  if (addContactForm.value.isValid) {

  }
}

</script>

<style scoped>

</style>
