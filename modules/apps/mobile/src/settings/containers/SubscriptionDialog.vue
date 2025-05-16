<template>
  <IonModal
    :is-open="isOpen"
    @did-dismiss="isOpen = false"
  >
    <IonContent class="ion-padding">
      <h2 class="center header">
        {{ $t('settings.subscription.choose') }}
      </h2>
      <p class="center">
        {{ $t('settings.subscription.benefits.intro') }}
      </p>
      <div 
        v-for="(index) in [0, 1, 2, 3, 4, 5]"
        :key="index"
        class="benefit-block"
      >
        <IonItem
          class="benefit"
          lines="none"
        >
          <div slot="start">
            {{ $t(`settings.subscription.benefits.benefit${index}.icon`) }}
          </div>
          <IonLabel>
            <h2>{{ $t(`settings.subscription.benefits.benefit${index}.title`) }}</h2>
            <p>{{ $t(`settings.subscription.benefits.benefit${index}.description`) }}</p>
          </IonLabel>
        </IonItem>
          
        <div
          v-if="index !== 0"
          class="soon"
        >
          {{ $t("app.soon") }}
        </div>
      </div>

      <div class="delemiter" />

      <IonItem
        v-for="plan in subscriptionPlans"
        :key="plan.packageId"
        :color="selectedPlan?.packageId === plan.packageId ? 'primary' : 'light'"
        class="plan"
        lines="none"
        @click="selectPlan(plan)"
      >
        <div slot="start">
          ⭐️
        </div>
        <IonLabel>
          <h2>{{ $t(`settings.subscription.plans.${plan.packageId}`) }}</h2>
          <p>
            {{ plan.price }} / 
            {{ $t(`settings.subscription.periods.${plan.billingPeriod}`) }}
          </p>
          <p>{{ plan.description }}</p>
        </IonLabel>
        <IonIcon
          v-if="selectedPlan?.packageId === plan.packageId"
          slot="end"
          :icon="checkmarkCircle"
        />
      </IonItem>

      <IonButton
        expand="block"
        class="subscribe"
        :disabled="!selectedPlan"
        @click="subscribe"
      >
        {{ $t('settings.subscription.subscribe') }}
      </IonButton>

      <IonButton
        class="back"
        size="small"
        expand="block"
        color="medium"
        fill="clear"
        @click="isOpen = false"
      >
        {{ $t('app.back') }}
      </IonButton>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
import { IonModal, IonButton, IonItem, IonLabel, IonIcon, IonContent } from '@ionic/vue'
import { checkmarkCircle } from 'ionicons/icons'
import { ref, toRefs, watch } from 'vue'

/* -------------------------------------------------------------------------- */
/*                                   Models                                   */
/* -------------------------------------------------------------------------- */

export type SubscriptionPlan = {
  packageId: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  subscriptionPlans: SubscriptionPlan[];
  activePlan?: string;
}>()

const emit = defineEmits<{
  (e: 'subscribe', plan: SubscriptionPlan): void;
}>()

const isOpen = defineModel<boolean>('open', { default: false })

/* -------------------------------------------------------------------------- */
/*                                    State                                   */
/* -------------------------------------------------------------------------- */

const { activePlan } = toRefs(props)

const selectedPlan = ref<SubscriptionPlan | undefined>()

const selectPlan = (plan: SubscriptionPlan) => {
  selectedPlan.value = plan
}

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

watch(
  () => activePlan.value,
  (newValue) => {
    if (newValue) {
      selectedPlan.value = props.subscriptionPlans.find(plan => plan.packageId === newValue)
    }
  },
  { immediate: true }
)

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const subscribe = async () => {
  if (selectedPlan.value) {
    emit('subscribe', selectedPlan.value)
    isOpen.value = false
  }
}
</script>

<style scoped>
.header {
  padding-top: var(--ion-safe-area-top, 2rem);
}

.center {
  text-align: center;
}

.plan {
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.5s ease-in-out;
}

.subscribe {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  --box-shadow: none;
}

.benefit-block {
  position: relative;
}

.benefit {
  margin-bottom: 10px;
  border-radius: 8px;
}

.soon {
  position: absolute;
  border-radius: 5px;
  padding: .3rem;
  position: absolute;
  transform: rotate(-23deg);
  top: 3px;
  right: -3px;
  background-color: var(--ion-color-primary);
  color: var(--ion-color-dark-contrast);
  font-size: .55rem;
  z-index: 1;
}

.back {
  padding-bottom: var(--ion-safe-area-bottom, 2rem);
}

.delemiter {
  padding: 1rem;
}
</style>
