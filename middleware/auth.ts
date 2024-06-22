export default defineNuxtRouteMiddleware(() => {
    if (useAuthToken().value === null) {
        return navigateTo('/login')
    }
})