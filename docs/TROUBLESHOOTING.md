# Troubleshooting

Look through here if you come across any issue.

✨ If your issues isn't here and you were able to figure a solution, please consider contribute to the guide.

* [Node](#node)
    * [Dev Server Failures](#dev-server-failures)
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
