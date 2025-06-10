# Troubleshooting

Look through here if you come across any issue.

✨ If your issues isn't here and you were able to figure a solution, please consider contribute to the guide.

* [Changesets](#changesets)
* [Node](#node)
  * [Dev Server Failures](#dev-server-failures)
    * [Out of Memory error](#out-of-memory-error)
    * [File watchers exceed error](#file-watchers-exceed-error)
  * [Package Install Failures](#package-install-failures)
    * [Global npm package install errors on Mac System](#global-npm-package-install-errors-on-mac-system)
* [Maven](#maven)
  * [Build Failures](#build-failures)

## Changesets

### Failed to find where HEAD diverged from master

You may sometimes see the following error when trying to generate changeset on your feature branch.

```
❯ pnpm changeset
🦋  error Error: Failed to find where HEAD diverged from master. Does master exist?
```

**How to fix:**

1. First you need to checkout to master branch.
`git checkout master`

2. Then get the latest changes from upstream.
`git pull upstream master`

3. Rebase the feature branch on master branch, and try generating changesets again.
`git checkout <your_feature_branch>`
`git rebase master`

## Node

### Dev Server Failures

#### Out of Memory error

##### 🛑 Error:

```
<--- Last few GCs --->

[8366:0x3f04ad0]    23325 ms: Mark-sweep 2042.0 (2085.7) -> 2041.3 (2086.2) MB, 734.9 / 0.0 ms  (average mu = 0.102, current mu = 0.013) allocation failure scavenge might not succeed
[8366:0x3f04ad0]    24138 ms: Mark-sweep 2043.2 (2086.2) -> 2042.5 (2087.2) MB, 807.7 / 0.0 ms  (average mu = 0.055, current mu = 0.007) allocation failure scavenge might not succeed


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 0x309d6aa5be1d]
    1: StubFrame [pc: 0x309d6aa5d1df]
Security context: 0x124119b1e6e9 <JSObject>
    2: getIntersectionType(aka getIntersectionType) [0x1a0a8652b3a1] [/home/marcus/work/ClientElectron/node_modules/typescript/lib/typescript.js:~39985] [pc=0x309d6b65f1d2](this=0x0d5af00026f1 <undefined>,types=0x3352c04a57b9 <JSArray[23]>,aliasSymbol=0x0d5af00026f1 <undefined>,aliasTypeArguments=0x0d5af00026f1 <undefine...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
1: 0x8dc510 node::Abort() [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
2: 0x8dc55c  [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
3: 0xad9b5e v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
4: 0xad9d94 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
5: 0xec7bf2  [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
6: 0xec7cf8 v8::internal::Heap::CheckIneffectiveMarkCompact(unsigned long, double) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
7: 0xed3dd2 v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
8: 0xed4704 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
9: 0xed7371 v8::internal::Heap::AllocateRawWithRetryOrFail(int, v8::internal::AllocationSpace, v8::internal::AllocationAlignment) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
10: 0xea07f4 v8::internal::Factory::NewFillerObject(int, bool, v8::internal::AllocationSpace) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
11: 0x114018e v8::internal::Runtime_AllocateInNewSpace(int, v8::internal::Object**, v8::internal::Isolate*) [/home/marcus/.nvm/versions/node/v10.15.3/bin/node]
12: 0x309d6aa5be1d
```

##### 🟩 Steps to resolve

- Temporarily disable ES Lint Webpack plugin.

```bas
DISABLE_ESLINT_PLUGIN=true
```

- Temporarily disable Fork TS Checker Webpack plugin.

```bash
DISABLE_TS_CHECK_PLUGIN=true
```

#### File watchers exceed error

##### 🛑 Error

```bash
ENOSPC: System limit for number of file watchers reached.
```

##### 🟩 Steps to resolve
  - Need to increase the amount of max_user_watches in system file.
  - Use 'sudo nano /etc/sysctl.conf' to access the file.
  - Then add 'fs.inotify.max_user_watches = 5242881' at the end of the file.
  - Next save the file and exit.
  - Finally use 'sudo sysctl -p' to apply changes.

### Package Install Failures

#### Global npm package install errors on Mac System

```bash
npm i -g pnpm
```

A global npm package install such above via `npm` could result in the following stacktrace in Mac systems.

```bash
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/pnpm
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/pnpm'
npm ERR!  [Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/pnpm'] {
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'mkdir',
npm ERR!   path: '/usr/local/lib/node_modules/pnpm'
npm ERR! }
npm ERR!
npm ERR! The operation was rejected by your operating system.
npm ERR! It is likely you do not have the permissions to access this file as the current user
npm ERR!
npm ERR! If you believe this might be a permissions issue, please double-check the
npm ERR! permissions of the file and its containing directories, or try running
npm ERR! the command again as root/Administrator.
```

The reason for this is that your user does not have permissions to write to `/usr/local/lib/node_modules`.

##### Possible Fixes

1. Check who owns the errored path.

    ```bash
    ls -la /usr/local/lib/node_modules
    ```

   If the above command shows the owner as `root` then you need to change it so that your user can modify the path.

2. Checking your username if you do not know already.

    ```bash
    whoami
    ```

3. Change the owner of the path. Replace `ownerName` with the username you received after executing the above command.

    ```bash
    sudo chown -R ownerName: /usr/local/lib/node_modules
    ```

## Maven

### Build Failures

- If you face any out of memory build failures, make sure that you have set maven options to `set MAVEN_OPTS=-Xmx384M`
- For Maven v3.8 up, add below configuration to the `~/.m2/settings.xml` (Create a new file if the file exist)

```xml
<settings>
    <mirrors>
        <mirror>
            <id>wso2-nexus-public</id>
            <mirrorOf>external:http:*</mirrorOf>
            <url>http://maven.wso2.org/nexus/content/groups/wso2-public/</url>
            <blocked>false</blocked>
        </mirror>
        <mirror>
            <id>wso2-nexus-release</id>
            <mirrorOf>external:http:*</mirrorOf>
            <url>http://maven.wso2.org/nexus/content/repositories/releases/</url>
            <blocked>false</blocked>
        </mirror>
        <mirror>
            <id>wso2-nexus-snapshots</id>
            <mirrorOf>external:http:*</mirrorOf>
            <url>http://maven.wso2.org/nexus/content/repositories/snapshots/</url>
            <blocked>false</blocked>
        </mirror>
    </mirrors>
</settings>
