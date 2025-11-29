---
title: Islands Architecture
createdAt: 2025-10-28
updatedAt: 2025-10-28
---

## Server vs Client render

To understand islands, we need to first draw a distinction between server and client rendering. In a web application, you can build web pages that are server rendered and are sent to the browser in a sort of finished form. There are many ways to accomplish this, but an example would be a NextJS application that does the job of pre-rendering content and then sending a static HTML page when a user lands on the homepage. An example of client rendered content is a single page application that sends an HTML page with a `div` element that a javascript application uses to hydrate the page with content.

## What are islands?

Islands are small sections of interactivity enabled by client rendering on an otherwise server rendered web page. This is an extremely useful pattern because it allows us to enjoy the best the both paradigms have to offer. We get quick page loads because a majority of the page that does not have any reliance on user interaction comes to the browser environment ready to be displayed. Small sections that are reliant on user interactivity benefit from client side logic that allows the application to very quickly respond to users interacting with buttons, inputs, or media, for example.

## A Deeper Dive into Server vs Client

### Traditional SSR

Traditional SSR relies on page refresh to repopulate data. This is fundamental to understanding how the web works. There are two things that make the web so incredible, links and forms. These are the foundations of interactivity on the internet. They are, in fact, what makes the "web". Links join pages together relationally. Forms allow the user to give data to our applications thereby allowing interaction. Everything that we build, even modern applications exist on this architecture.

### Hydration or Client Rendering

Hydration describes modern client-side rendering. There was a big swing toward this sort of architecture in the 2010's led by libraries like React and Angular. Key differences from traditional server rendered pages are: heavy JS bundles, sparse initial markup, lacking SEO, theoretically good user interactivity because of JS in browser.

## Hydration vs Rendering

Rendering is the creation of new DOM content based on updated state So, for example, you have a simple counter app, a user clicks the increment button, state updates with a higher count, and the element that displays the current count re-**renders**. The page is then re-**hydrated** with this new render.

The difference between rendering and hydration lies in process and display respectively. Rendering means the creation of new elements. To hydrate a page is to update the display by putting the newly rendered elements in place of the stale ones based on old state.

## Why do I want Islands?

We should server render everything. This should be the default behavior of the web. Render the data completely and send it to the user in a finished state. The modern web complicates this but with functional necessity. We need to support interactivity. The internet is not a book. The data is malleable. When you need interactivity, JS should provide that. But it should only be there when it is necessary. This is the problem with the Single Page Application pattern. It relies too heavily on JS and abstracts useful native browser APIs.

To achieve a balanced middle ground between server and client strategies, we use islands. Server rendered pages that have minimal components that respond to user interaction and re-hydrate accordingly. Now there are plenty of frameworks that handle this behavior and they can be great. But for the sake of understanding the concept a little more clearly, here is a basic example that you can copy into a simple example application and see for yourself.

The following example uses TypeScript and Express in a NodeJS environment. I chose to illustrate this example using TS and Node because I think it makes the most sense for web based applications. But you could easily do something similar using PHP, Ruby on Rails, Python + Flask or Django, or Spring Boot, just to name a few. The pattern is the important part.

### Simple Example

```ts
// server.ts
import express from 'express';
import path from 'path';

const app = express();

// Serve static files (CSS, client-side JS)
app.use('/static', express.static('public'));

// Template rendering helper
const renderPage = (title: string, content: string, islands: string[] = []) => {
  const islandScripts = islands
    .map(island => `<script type="module" src="/static/islands/${island}.js"></script>`)
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
      ${content}
      ${islandScripts}
    </body>
    </html>
  `;
};

// Static page - no JavaScript needed
app.get('/', (req, res) => {
  const content = `
    <h1>Welcome to Island Architecture</h1>
    <p>This page is completely static - no JavaScript!</p>
    <a href="/interactive">Go to an interactive page!</a>
  `;

  res.send(renderPage('Home', content));
});

// Page with interactive islands
app.get('/interactive', (req, res) => {
  const content = `
    <h1>Interactive Page</h1>
    <p>This page has interactive "islands" of JavaScript:</p>
    
    <!-- Static content -->
    <section>
      <h2>Static Section</h2>
      <p>This text is rendered server-side and needs no JavaScript.</p>
    </section>
    
    <section>
      <h2>Another Static Section</h2>
      <p>More server-rendered content that doesn't need JavaScript.</p>
    </section>
    
    <!-- Interactive Island: Todo List -->
    <div data-island="todo">
      <h3>Todo Island</h3>
      <input type="text" placeholder="Add a todo...">
      <button>Add</button>
      <ul></ul>
    </div>
  `;

  // Only load JS for the islands we actually use
  res.send(renderPage('Interactive Page', content, ['todo']));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

```ts
// public/islands/todo.js
// Client-side JavaScript for todo island
document.addEventListener('DOMContentLoaded', () => {
  const todoIslands = Array.from(document.querySelectorAll('[data-island="todo"]'));
  if (!Boolean(todoIslands)) return; // Only run if instance of island exists

  todoIslands.forEach(ti => {
    const input = ti.querySelector('input[type="text"]');
    const addBtn = ti.querySelector('button');
    const list = ti.querySelector('ul');

    addBtn?.addEventListener('click', () => {
      const text = (input as HTMLInputElement)?.value.trim();
      if (!text) return;

      const li = document.createElement('li');
      li.textContent = text;
      list?.appendChild(li);

      (input as HTMLInputElement).value = '';
    });
  });
});
```

**Directory Structure**

```
├── server.ts
├── public/
│   └── islands/
│       └── todo.js
```

## Why This Matters

In my opinion, this is how we should be making web apps. Server render everything and only use JS interactivity when it is absolutely necessary. This ensures that the user receives content immediately on the initial render. But we can also add complex use interaction as an enhancement on top of the essential content. This provides a fantastic foundation for us to progressively enhance, thereby providing a feature rich environment at all accessability levels.
