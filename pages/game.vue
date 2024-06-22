<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useNotifications} from "#imports";

type Taunt = { text: string, id: string }

definePageMeta({
    middleware: 'auth',
});
const config = useRuntimeConfig();
const taunts = ref<Taunt[]>([]);
const isTauntVisible = ref(false);
const {showNotification} = useNotifications();

async function requestNewTaunts() {
    const token = useAuthToken();
    try{
        const data = await $fetch<{taunts: Taunt[], batchId: string}>(`${config.public.apiBaseUrl}/v1/morda`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
            }
        });

        taunts.value = data.taunts;
    } catch (error: any) {
        showNotification(`problem podczas pobierania zaczepek: ${error.toString()}`);
    }
}

async function sendTauntScore(taunt: Taunt) {
    const token = useAuthToken();
    try {
        await $fetch(`${config.public.apiBaseUrl}/v1/morda/feedback`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.value}`,
            },
            body: {
                tauntId: taunt.id,
            }
        });
    } catch (error: any) {
        showNotification(`problem podczas wysyłania feedbacku dot zaczepki: ${error.toString()}`);
    }
}

function flipCard() {
    isTauntVisible.value = true
}
function selectTaunt(taunt: Taunt) {
    isTauntVisible.value = false
    sendTauntScore(taunt);
    requestNewTaunts();
}

requestNewTaunts();
</script>

<template>
    <div class="h-screen p-5">
        <UContainer class="h-full">
            <UCard class="h-full" :ui="{body:{padding:'h-full'}}" >
                <div class="flex items-center justify-center h-full" v-if="!isTauntVisible" @click="flipCard">
                    <div class="flex flex-col items-center gap-4">
                        <font-awesome-icon :icon="['fas', 'cauldron']" class="text-primary" size="10x"/>
                        <p class="text-2xl" >Kliknij, aby odwrócić kartę</p>
                    </div>
                </div>
                <div class="flex items-center justify-center h-full" v-else>
                    <div class="flex flex-col items-center gap-10">
                        <p class="text-2xl mb-5">Przeczytaj wybraną zaczepkę, a następnie kliknij na nią ;)</p>
                        <UButton size="xl" v-for="taunt in taunts" @click="selectTaunt(taunt)">
                            {{ taunt.text }}
                        </UButton>
                    </div>
                </div>
            </UCard>
        </UContainer>
    </div>
</template>