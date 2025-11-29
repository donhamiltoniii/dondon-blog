---
title: NeoVim Thoughtz
createdAt: 2025-11-29
lastUpdate: 2025-11-29
---

## Inserting Characters with Visual Block

I recently wanted to prepended dashes to a couple of lines to turn this:

```
Structure and Interpretation of Computer Programs by Gerald Jay Sussman 
Computer Systems: A Programmer’s Perspective by Randal E. Bryant 
Designing Data-Intensive Applications by Martin Kleppmann
```

into this:

```
- Structure and Interpretation of Computer Programs by Gerald Jay Sussman 
- Computer Systems: A Programmer’s Perspective by Randal E. Bryant 
- Designing Data-Intensive Applications by Martin Kleppmann
```

And I super forgot how. Here's a quick guide for when I forget again.

1. Enter `VISUAL BLOCK` - `ctrl + v`
2. select rows - `j/k`
3. Enter VB `INSERT` - `shift + I` (THIS IS WHAT GOT ME! CAPITAL I!)
4. Enter characters - `- ` in this case
5. Indicate that you are finished - `esc`

That's it! Your prepend is applied to all lines!
