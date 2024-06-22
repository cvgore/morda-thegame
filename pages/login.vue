<script setup lang="ts">
import * as yup from 'yup'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
    middleware: 'guest',
})

const schema = yup.object({
    password: yup.string()
        .required('Required')
})

type Schema = yup.InferType<typeof schema>

const config = useRuntimeConfig();
const {showNotification} = useNotifications();

const state = reactive({
    password: ''
});

async function tryLogin(_event: FormSubmitEvent<Schema>) {
    const token = `p:morda:${btoa(encodeURIComponent(state.password))}`;
    try {
        await $fetch(`${config.public.apiBaseUrl}/v1/access`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error: any) {
        showNotification(`nieprawidłowe hasło - ${error.statusText}`);
        return;
    }

    useAuthToken().value = token;
    navigateTo('/game');
}
</script>

<template>
    <UContainer>
        <UCard class="mt-10">
            <template #header>
                <div class="flex justify-between">
                    <h1>Zaloguj się</h1>
                </div>
            </template>
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="tryLogin">
                    <UFormGroup label="Hasło" name="password">
                        <UInput v-model="state.password" type="password" />
                    </UFormGroup>

                    <UButton type="submit">
                        Zaloguj
                    </UButton>
                </UForm>
        </UCard>
    </UContainer>
</template>