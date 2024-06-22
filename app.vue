<template>
  <NuxtPage />
    <UContainer class="flex flex-col fixed bottom-0 left-0 right-0 z-1 gap-y-1 mb-1">
        <UAlert color="primary" :description="n.text" v-for="n in list" :key="n.id" />
    </UContainer>
</template>

<script setup lang="ts">
const {list} = useNotifications();
</script>