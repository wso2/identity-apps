# Troubleshooting

Look through here if you come across any issue.

✨ If your issues isn't here and you were able to figure a solution, please consider contribute to the guide.

* [Maven](#maven)
    * [Build Failures](#build-failures)

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
