---
title: 'Tmux: Getting Started'
createdAt: 2025-11-10
updatedAt: 2026-03-21
---

## What is a TMUX?

Tmux is pretty awesome, I've heard about it for a long time, and I finally am taking an hour to learn it. If I would have known it was this quick, I would have just learned it forever ago because it is really useful. Tmux is a multiplexer which means nothing because nobody knows what a multiplexer is so it doesn't give you any reference for what it does. What is a multiplexer? The internet (AI bot) says this:

> A multiplexer (often abbreviated mux) is a digital circuit that selects one of several input signals and forwards the chosen input to a single output line.
>
> In essence, it works like a multiple‑to‑single switch controlled by a set of select lines (also called address or control bits). The number of select lines determines how many inputs can be addressed:

This is actually helpful with regard to Tmux since Tmux essentially allows you to work with multiple sessions, windows, and panes inside of your terminal environment. So instead of having one terminal window and a bunch of tabs that are hard to navigate around, Tmux gives you a similar performance, allowing you to manage multiple windows, with some really useful commands that make it really easy to do so. The concept of sessions is really cool too becuase you could do something like run a server, exit (close) the window, and still have access to your running server. This is cool and you should do it.

## Tmux Elements

### Sessions

The relationship between sessions, windows, and panes is pretty simple, but here's a general overview. Sessions are top level. Anything you do in Tmux is gonna happen in a session. These are similar to browser sessions. It's essetnailly the 5W's of whatever you're doing. Who: you, What: typing stuff: When: now (and later maybe), Where: some file system, Why: Because your life is dope and you do dope shit. Windows

### Windows

Windows are where work actually happens. You can think of windows as individual terminal windows since that is what they are. If you didn't use Tmux, these would be tabs or multiple terminal windows.

### Panes

Panes are windows inside of windows. Panes allow you to split a screen (window) and perform multiple tasks. I can see where this might be useful, but I think just having multiple windows is gonna suffice for me.

## Keyboard Shortcuts

There are a bunch of cool shortcuts in Tmux because, obviously there are. That's what makes it useful. Here are some of the really useful ones based on what they correspond to.

One important thing to note, Tmux relies on a "prefix" for it's keyboard shortcuts. This is to prevent collision between Tmux's shortcuts and other terminal shortcuts. The default prefix is `ctrl + b` but you can change this if you would like. I don't like so it's just `ctrl + b` for me.

### Windows

1. Create a new window - `<prefix> + c`
2. Cycle between previous and next windows respectively - `<prefix> + p/n`
3. Choose a specific window - `<prefix> + [index]`
4. The index will be next to the name of the window in the bottom bar
5. List all windows - `<prefix> + w`
6. Rename a window - `<prefix> + ,`

### Panes

1. Split screen horizontal - `<prefix> + "`
2. Split screen vertically - `<prefix> + %`
3. Move around panes - `<prefix> + [arrow keys]`
4. Cycle through panes - `<prefix> + o`
5. close a pane - `<prefix> + x` or type `exit`
6. rearrange panes - `<prefix> + SPACE`

## Commands

Tmux also has built in commands. These are really useful for scripting. Scripting is awesome. You should do that too. Also use NeoVim with Lua. Anyway, to start command mode, type `<prefix> + :` then you can type stuff like `list-windows` and Tmux will list all windows in this session or `split-windows` with the `-v/-h` flag for vertical or horizontal. There are more. I will not list them.

## Configuration

You can adda Tmux configuration file and you want to do this. Add a configuration file at `~/.config/tmux/tmux.conf`.

## Scripting
