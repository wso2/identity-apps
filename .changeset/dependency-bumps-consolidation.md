---
"@wso2is/console": patch
"@wso2is/myaccount": patch
"@wso2is/core": patch
"@wso2is/admin.copilot.v1": patch
---

Consolidate open dependabot dependency bumps:

- vite 5.4.8 -> 6.4.3 (apps/console, apps/myaccount)
- js-yaml 3.13.1 -> 3.15.0 (modules/core)
- axios 1.7.9 -> 1.18.0 (features/admin.copilot.v1)
- simple-git 1.129.0 -> 3.36.0 (root devDependency)
- storybook 9.1.9 -> 9.1.19 (root devDependency)
- fast-xml-parser 3.15.0 -> 5.7.0 (root devDependency)
- lodash 4.17.23 -> 4.18.1 (transitive, via workspace override)
- immutable 5.1.6 -> 5.1.9 (transitive, via workspace override)
- @babel/core 7.29.0 -> 7.29.6 (transitive, via workspace override)
- joi 17.13.3 -> 17.13.4 (transitive, via workspace override)
- dompurify 3.4.11 -> 3.4.12 (transitive, via workspace override)
- org.apache.cxf:cxf-core 3.4.10 -> 3.6.11 (identity-apps-core). Capped at the
  latest 3.x line rather than 4.1.7: CXF 4.x requires the `jakarta.ws.rs`
  namespace and JDK 17, which is incompatible with the module's existing
  javax.ws.rs-api 2.1.1 / Jersey 1.19.1 / JDK 11 baseline.
- com.fasterxml.jackson.core:jackson-core/jackson-annotations/jackson-databind/
  jackson-jaxrs-json-provider aligned to 2.18.9 in both apps/console/java and
  apps/myaccount/java (previously a mix of 2.10.5/2.13.2/2.13.4.2/2.18.8/2.18.9/2.22.0)
- org.apache.tomcat:tomcat-catalina 9.0.11 -> 9.0.118 (apps/console/java, apps/myaccount/java)
- @storybook/react-webpack5 9.1.9 -> 9.1.19 (root devDependency, kept in sync with `storybook`)
