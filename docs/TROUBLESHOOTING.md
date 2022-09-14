# Troubleshooting

Look through here if you come across any issue.

✨ If your issues isn't here and you were able to figure a solution, please consider contribute to the guide.

* [Node](#node)
  * [Dev Server Failures](#dev-server-failures)
    * [File watchers exceed error](#file-watchers-exceed-error)
  * [Package Install Failures](#package-install-failures)
    * [Global npm package install errors on Mac System](#global-npm-package-install-errors-on-mac-ystem)
* [Maven](#maven)
  * [Build Failures](#build-failures)

## Node

### Dev Server Failures

#### File watchers exceed error

- Error: ENOSPC: System limit for number of file watchers reached
- Steps to resolve:
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
```
