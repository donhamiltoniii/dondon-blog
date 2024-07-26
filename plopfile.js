export default function (plop) {
  plop.setHelper("todayString", function () {
    const date = new Date();

    return date.toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });
  // create your generators here
  plop.setGenerator("blog", {
    description: "generates a new blog post file",
    prompts: [
      {
        type: "input",
        name: "title",
        message: "What are you calling this monster?: ",
      },
      {
        type: "input",
        name: "description",
        message: "Tell me a little bit about it: ",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/content/blog/{{kebabCase title}}.mdx",
        templateFile: "src/plop-templates/new-blog-post.hbs",
      },
    ],
  });
}
