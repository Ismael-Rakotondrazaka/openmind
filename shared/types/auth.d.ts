declare module '#auth-utils' {
  interface User {
    email: string;
    firstName: null | string;
    id: string;
    imageUrl: null | string;
    lastName: null | string;
    role: 'admin' | 'moderator' | 'user';
    username: null | string;
  }
}

export {};
