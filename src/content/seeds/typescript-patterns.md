---
title: TypeScript Patterns
createdAt: 2025-10-31
updatedAt: 2025-10-31
---

I recently read a [very good article](https://nagibaba.medium.com/typescript-patterns-that-made-my-code-self-documenting-3c0fe8bcd002) discussing TypeScript Patterns that "self-document" your code. There is some really good stuff here and this is definitely something that I'll be digging deeper into. One of the concepts that really stood out is the idea of "branding" types in TS. This is not something that I have seen before but I think it is a really good idea. It doesn't do much for the code itself but it makes things more readable as far as intent for developers.

## Branded Types

This is largely superfluous as it doesn't change anything about how the code functions. But it labels things better. The article does a good job of illustrating exactly how this works so I will give a quick example but then talk more about what is happening.

```ts
type UserBirthdate = Date & { readonly __brand: 'UserBirthdate' };
type UserEmail = string & { readonly __brand: 'UserEmail' };
type UserName = string & { readonly __brand: 'UserName' };

interface User {
  birthdate: UserBirthdate;
  email: UserEmail;
  name: UserName;
}

const user1: User = {
  birthdate: new Date('3056-08-08'),
  email: 'me@dondon.dev',
  name: 'Dondon',
};
```
