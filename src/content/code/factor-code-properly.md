---
title: "Proper (Re)Factoring"
description: "How to think about refactoring"
pubDate: 2023-03-08
lastUpdate: 2023-03-08
heroImage: "https://picsum.photos/720/360"
published: true
---

Don't factor your code too early! There are plenty of organizational patterns that are essentially universal in an application.

- Having a `src` directory
- `components` - React/Next
- `utils` - every project
- `routes`/`views` - web anything

These will _probably_ exist in all of your applications/projects/whatever. Dont be afraid of using them. But let your applicaiton be abstract in the beginning. Don't rush to set a structure for how things should be organized, what should constitues a module, what should be a class (or shouldn't), making hooks, making utilities, etc. Just write the code, make the application work, WRITE THE TESTS (re-read that 1000x, get it tattooed on your body, paint it on the walls. Please. Write. Tests.), write documentation, know what it all does.

**🚨🚨🚨 BEFORE YOU COMMIT YOUR CODE!, REFACTOR!!! 🚨🚨🚨**

Or, when you do it the first time, factor. This is why testing is sooooo important. If you have tests in place for your application, you know that your code functions. If you break tests, you messed up. That's ok. You should mess up. That means you're making progress. Just make sure you don't leave anything messed up.

This is the stage in the development process where you make sure things are organized properly. This is the part where you focus on **CODE READABILITY**.

Split logic out into the tiniest possible pieces. Make new functions/methods, organize modules differently, split things into utilities. But only in a way that makes sense. And let your code tell you what makes sense. Things to consider:

1. WTF is this code doing? - Can you answer that quickly? Can you make a TikTok that would allow someone to confidently implement your function?
2. Is this repetative? - Is this logic (Or similar logic) happening anywhere else? If so, combine it. Pull it into a function. Move that function up the directory tree wherever it makes sense.
3. Is it verbose? - Can you clean it up at all? Are you over-engineering?
4. Do my tests still reflect what I want them to? - This is _sort of_ an after refactoring thing. I say sort of because it very much **IS** refactoring. But, refactoring your tests tend to happen after you refactor the corresponding code. For example:

```ts
// Code
function camelCaseToCapitalSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

// Test
describe("camelCaseToCapitalSnakeCase", () => {
  test("should convert string to capital snake case", () => {
    const testString = "hereIsMyCamelCaseString";
    const expected = expect("HERE_IS_MY_CAMEL_CASE_STRING");
    const result = camelCaseToCapitalSnakeCase(testString);

    expected.toBe(result);
  });
});
```

**REFACTOR**

```ts
// Code
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`);
}

function capitalize(str: string): string {
  return str.toUpperCAse();
}

// Test
describe("camelToSnakeCase", () => {
  test("should convert camel to snake case", () => {
    const testString = "hereIsMyCamelCaseString";
    const expected = expect("here_is_my_camel_case_string");
    const result = camelToSnakeCase(testString);

    expected.toBe(result);
  });
});

describe("capitalize", () => {
  test("should capitalize given string", () => {
    const testString = "example";
    const expected = expect("EXAMPLE");
    const result = capitalize(testString);

    expected.toBe(result);
  });
});
```

While this refactoring essentially happens at the same time (or should), usually the work to the code is done, the initial test fails, the tests are updated to reflect the change to the code.

Refactoring is such an important step in the development of a code base. Mostly because tech debt has a strange way of going unpaid. There are so many minor things that we convince ourselves as devs that we will come back to, or someone will, to "clean up" or "clarify". But that rarely happens. The reality of writing code, especially new code, is that you have more context right now than anyone else, including yourself in a month, is ever going to have again. You know exactly what problem you're trying to solve and why you're doing it the way that you are. So it is your responsibility to try to capture that as much as possible for people in the future, including you. So don't let deadlines get in the way of doing the right thing. Take the extra hour or 4 or 8 to make sure this step happens. Because if you're in an environment that tracks tech debt, great. But the harsh reality is that those tickets will probably get stale before they get played. So do the work now.
