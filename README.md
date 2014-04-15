# cyberhobo [![npm](https://img.shields.io/npm/v/cyberhobo.svg)](https://npmjs.org/package/cyberhobo) [![npm](https://img.shields.io/npm/dm/cyberhobo.svg)](https://npmjs.org/package/cyberhobo)

#### Offline `git push` and `npm publish` for cyberhobos

![all aspiring cyberhobos seek to follow the ways of the dominictarr](img.jpg)

This module is gifted to cyberhobo extraordinaire, dominictarr.

### features

- Run `git push` and `npm publish` while you're offline!
- Next time you're online, all queued commands will run in order.

### usage

1. Install it globally.

  ```bash
  npm install -g cyberhobo
  ```

2. Set up bash/zsh aliases for `npm` and `git` so `cyberhobo` will run first.

  ```bash
  alias git='cyberhobo git'
  alias npm='cyberhobo npm'
  ```

  `cyberhobo` will detect if you're offline and intercept `git push` and `npm publish`
  commands, **queueing them to run later** when you're back online. If you're online or
  if you run a non `push`/`publish` command, then it will run normally.

  #### when you're back online

  If you're back in civilization and you have an internet connection, the next time you run
  any `git` or `npm` command, `cyberhobo` will realize this and run all the commands that
  were queued up while you were offline. They will run **in order**.

  If any of them fails with a non-zero exit code then `cyberhobo` bails, printing out the remaining
  commands so you can run them manually.

### license

MIT. Copyright [Feross Aboukhadijeh](https://www.twitter.com/feross).
