---
"@wso2is/admin.applications.v1": patch
"@wso2is/console": patch
"@wso2is/core": patch
"@wso2is/react-components": patch
---

Accept any absolute URI as a SAML assertion audience, and stop hiding stored audiences that are not
conventional URLs. Audience entry previously required a `<scheme>://<authority>` shape, which rejected
URNs such as `urn:amazon:webservices`, and values failing the URL check were dropped at render, so a
non-compliant audience already present in the assertion could be neither seen nor removed. The non-TLS
warning on URL chips is also narrowed to plain `http`, so schemes with no transport of their own — such
as mobile deep links — are no longer flagged as insecure.
