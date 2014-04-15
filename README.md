# cyberhobo [![npm](https://img.shields.io/npm/v/cyberhobo.svg)](https://npmjs.org/package/cyberhobo) [![npm](https://img.shields.io/npm/dm/cyberhobo.svg)](https://npmjs.org/package/cyberhobo)

#### Offline `git push` and `npm publish` for cyberhobos

![all aspiring cyberhobos seek to follow the ways of the dominictarr](https://raw.githubusercontent.com/feross/cyberhobo/master/img.jpg)

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

### example

```bash
$ touch test.txt
$ git add test.txt

# oh no! lost internet connection now. keep working...

$ git commit -m "wrote some awesome code"
[master 4f5f136] wrote some awesome code
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 test.txt

$ git push
CYBER HOBO ACTIVATED! Command saved for later!

$ npm publish
CYBER HOBO ACTIVATED! Command saved for later!

# more commits, pushes, etc., ...

# later, we have internet again! Run any git/npm command to push queued commands!

$ git status
============================================================
               HEY, YOU HAVE INTERNET NOW!
Time to re-run the commands you saved while you were offline
============================================================

==== Running "git push" in /Users/feross/code/cyberhobo ====

Counting objects: 3, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 229 bytes | 0 bytes/s, done.
Total 2 (delta 1), reused 0 (delta 0)
To git@github.com:feross/cyberhobo.git
   1174974..4f5f136  master -> master


==== Running "npm publish" in /Users/feross/code/cyberhobo ===

npm http PUT https://registry.npmjs.org/cyberhobo
npm http 201 https://registry.npmjs.org/cyberhobo
+ cyberhobo@0.1.0

CYBER HOBO MISSION COMPLETE: all up to date

On branch master
Your branch is up-to-date with 'origin/master'.
```

### warning

This may be a horrible idea. I don't know.

### license

MIT. Copyright [Feross Aboukhadijeh](https://www.twitter.com/feross).
