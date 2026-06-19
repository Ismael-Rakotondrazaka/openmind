export default defineNuxtRouteMiddleware(to => {
  const { user } = useUserSession();
  const localeRoute = useLocaleRoute();
  if (!user.value && to.name !== 'login') {
    return navigateTo(
      localeRoute({ name: 'login', query: { redirect: to.fullPath } })
    );
  }
});
