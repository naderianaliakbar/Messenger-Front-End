<template>
  <!-- Login  -->
  <v-row no-gutters class="auth-wrapper bg-surface">
    <!-- Login -->
    <v-col class="auth-card-v2 d-flex align-center justify-center" cols="12" md="4">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <!-- Welcome -->
        <v-card-text>
          <h5 class="text-h5 mb-1">به فروشگاه زیرو خوش آمدید! 👋🏻</h5>
          <p class="mb-0">لطفا وارد حساب کاربری خود شوید</p>
          <v-divider class="mt-5 mb-n4"></v-divider>
        </v-card-text>

        <!-- Form -->
        <v-card-text class="text-center">
          <v-window v-model="step">
            <v-form :readonly="loading" @submit.prevent="submit" ref="loginForm">
              <!-- Step 1 -->
              <v-window-item :value="1">
                <v-label class="text-subtitle-2 mb-2">لطفا شماره موبایل خود را وارد نمایید.</v-label>

                <!-- Phone Number -->
                <v-text-field class="mt-2" v-model="form.phoneNumber" label="شماره موبایل" placeholder="وارد کنید"
                              :readonly="loading" :rules="[rules.notEmpty, rules.phone]" density="compact"
                              variant="outlined"></v-text-field>
              </v-window-item>

              <!-- Step 2 -->
              <v-window-item :value="2">
                <v-label class="text-subtitle-2">لطفا کد ارسال شده را وارد نمایید.</v-label>
                <!-- OTP Input -->
                <v-otp-input class="ltrDirection" v-model="form.otp" length="5" :rules="[rules.otp]"></v-otp-input>

                <!-- Timer -->
                <v-label v-if="timer.active" class="d-block my-2 ltrDirection text-pink font-weight-bold">
                  {{ '0' + timer.minutes }} : {{ timer.second < 10 ? '0' + timer.second : timer.second }}
                </v-label>

                <!-- reSend OTP code -->
                <v-label v-if="!timer.active" class="mb-2 text-caption text-pink" @click="sendOTP"
                         :clickable="!timer.active">دریافت مجدد کد
                </v-label>
              </v-window-item>

              <!-- Step 3 -->
              <v-window-item :value="3">
                <v-label class="text-subtitle-2 mb-2" v-if="action === 2">لطفا رمز عبور خود را وارد نمایید.</v-label>
                <v-label class="text-subtitle-2 mb-2" v-if="action === 1">لطفا مشخصات خود را وارد نمایید.</v-label>

                <!-- First Name -->
                <v-text-field v-if="action === 1"
                              class="mt-3"
                              v-model="form.firstName"
                              label="نام"
                              placeholder="وارد کنید"
                              :rules="[rules.notEmpty]"
                              density="compact"
                              variant="outlined">
                </v-text-field>

                <!-- Last Name -->
                <v-text-field v-if="action === 1"
                              class="mt-3"
                              v-model="form.lastName"
                              label="نام خانوادگی"
                              placeholder="وارد کنید"
                              :rules="[rules.notEmpty]"
                              density="compact"
                              variant="outlined">
                </v-text-field>

                <!-- Password -->
                <v-text-field class="mt-3"
                              v-model="form.password"
                              label="رمز عبور"
                              placeholder="وارد کنید"
                              :append-inner-icon="form.showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                              :type="form.showPassword ? 'text' : 'password'"
                              @click:append-inner="togglePasswordVisible"
                              :rules="[rules.notEmpty, rules.password]"
                              density="compact"
                              variant="outlined">
                </v-text-field>

                <!-- Confirm Password -->
                <v-text-field v-if="action === 1"
                              v-model="form.confirmPassword"
                              class="mt-3"
                              label="تکرار رمز عبور"
                              placeholder="وارد کنید"
                              :append-inner-icon="form.showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                              :type="form.showPassword ? 'text' : 'password'"
                              @click:append-inner="togglePasswordVisible"
                              :rules="[rules.notEmpty, rules.confirmPassword]"
                              density="compact"
                              variant="outlined">
                </v-text-field>
              </v-window-item>

              <!-- Submit -->
              <v-btn class="mt-6 bg-secondary border text-center text-white w-100"
                     :loading="loading"
                     height="40"
                     variant="outlined"
                     type="submit">
                <v-icon class="mx-2 mr-n5">mdi-arrow-right</v-icon>
                <p>ادامه</p>
              </v-btn>
            </v-form>
          </v-window>
        </v-card-text>
      </VCard>
    </v-col>

    <!-- Image -->
    <v-col md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;">
          <v-img max-width="613" src="img/auth-v2-login-illustration-light.png" class="mt-16 mb-2"/>
        </div>
        <v-img class="auth-footer-mask" src="img/misc-mask-light.png" alt="auth-footer-mask" height="280"
               width="100"></v-img>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>

definePageMeta({
  layout: "blank"
});

import {ref, computed}                     from 'vue';
import {useCookie, useNuxtApp, navigateTo} from '#app';
import {useAPI}                            from '~/composables/useAPI';

const user = useCookie('user');
if(user.value) {
  navigateTo('/messenger');
}

const {$notify} = useNuxtApp();

const step       = ref(1);
const action     = ref(1);
const loading    = ref(false);
const validation = ref('');
const timer      = ref({
  active : false,
  minutes: 1,
  second : 60,
  counter: null,
});
const form       = ref({
  phoneNumber    : '',
  otp            : '',
  password       : '',
  confirmPassword: '',
  showPassword   : false,
  firstName      : '',
  lastName       : ''
});
const rules      = {
  notEmpty       : (value) => (value ? true : 'پر کردن این فیلد اجباری است'),
  phone          : (value) => {
    const phoneRegex = /^0\d{10}$/;
    if(phoneRegex.test(value)) {
      return true;
    } else {
      return 'فرمت شماره تلفن وارد شده اشتباه است';
    }
  },
  password       : (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber    = /[0-9]/.test(value);
    const hasSymbol    = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const minLength    = value.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !minLength) {
      return 'رمز عبور ضعیف است';
    } else {
      return true;
    }
  },
  confirmPassword: (value) => (value === form.value.password ? true : 'رمز عبور یکسان نیست'),
};

const togglePasswordVisible = () => {
  form.value.showPassword = !form.value.showPassword;
};

const changeStep = (val) => {
  step.value = val;
};

const startTimer = () => {
  timer.value.minutes = 1;
  timer.value.second  = 60;
  timer.value.active  = true;
  timer.value.counter = setInterval(() => {
    if (timer.value.second === 1) {
      if (timer.value.minutes) {
        timer.value.minutes--;
        timer.value.second = 60;
      } else {
        timer.value.active = false;
        timer.value.minutes -= 1;
        timer.value.second = 60;
        clearInterval(timer.value.counter);
      }
    } else {
      timer.value.second--;
    }
  }, 1000);
};

const sendOTP = async () => {

  // request
  await useAPI('auth/login', {
    method: 'post',
    body  : {
      method: 'phone',
      action: 'authenticate',
      phone : form.value.phoneNumber,
    },
    onResponse({response}) {
      if (response.status === 200) {
        startTimer();
        changeStep(2);
      } else {
        $notify('مشکلی در ارسال کد بوجود آمد. لطفا بعدا تلاش کنید', 'error');
      }
    }
  });
};

const verifyOTP = async () => {

  // request
  await useAPI('auth/login', {
    method: 'post',
    body  : {
      method: 'phone',
      action: 'verification',
      phone : form.value.phoneNumber,
      code  : form.value.otp,
    },
    onResponse({response}) {

      if (response.status === 200) {
        // set validation and action(1 -> register , 2 -> login)
        validation.value = response._data.validation;
        action.value     = response._data.userIsExists ? 2 : 1;
        changeStep(3);
      } else {
        // parse error
        if (response._data.message && response._data.message === 'The OTP code is wrong') {
          $notify('کد وارد شده صحیح نیست', 'error');
        }
      }
    }
  });

};

const login = async () => {
  // request
  await useAPI('auth/login', {
    method: 'post',
    body  : {
      method    : 'phone',
      action    : 'access',
      phone     : form.value.phoneNumber,
      password  : form.value.password,
      validation: validation.value,
      firstName : form.value.firstName,
      lastName  : form.value.lastName
    },
    async onResponse({response}) {
      if (response.status === 200) {

        const user = useCookie('user', {
          secure: true,
          maxAge: 86400 * 30,
        });

        user.value = response._data.user;

        const token = useCookie('token', {
          secure: true,
          maxAge: 86400 * 30,
        });

        token.value = response._data.token;

        $notify('خوش آمدید', 'success');
        await navigateTo( '/messenger');
      } else if (response.status === 401) {
        $notify('رمز عبور وارد شده اشتباه است', 'error');
      } else if (response.status === 400) {
        if (response._data && response._data.message) {
          // validation has expired
          if (response._data.message === 'Validation has expired') {
            $notify('مدت زمان اعتبار سنجی شما تمام شده است. لطفا دوباره تلاش کنید', 'error');
          } else if (response._data.message === 'Validation error') {
            $notify('مقادیر وارد شده معتبر نیستند', 'error');
            // password
            if (response._data.message.errors.includes('password must be a Strong Password')) {
              $notify('رمز عبور وارد شده ضعیف است', 'error');
            }
          }
        }
      }
    },
  });
};

const loginForm = ref(null);

const submit = async () => {
  await loginForm.value.validate();
  if (loginForm.value.isValid) {
    loading.value = true;
    switch (step.value) {
      case 1:
        await sendOTP();
        break;
      case 2:
        if (form.value.otp && form.value.otp.length === 5) {
          await verifyOTP();
        } else {
          useNuxtApp().$notify('لطفا کد otp را کامل وارد کنید', 'error');
        }
        break;
      case 3:
        await login();
        break;
    }
    loading.value = false;
  }
};

</script>

<style scoped>
.auth-wrapper {
  min-block-size: 100dvh;
}

.auth-footer-mask {
  position: absolute;
  inset-block-end: 0;
  min-inline-size: 100%;
}
</style>

