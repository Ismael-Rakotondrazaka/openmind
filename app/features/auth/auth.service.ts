export const updateAuthUserEmail = async ({
  email,
}: {
  email: string;
}): Promise<void> => {
  await $fetch('/api/auth/email/update', { body: { email }, method: 'POST' });
};

export const updateAuthUserPassword = async ({
  password,
}: {
  password: string;
}): Promise<void> => {
  await $fetch('/api/auth/password/update', {
    body: { password },
    method: 'POST',
  });
};
