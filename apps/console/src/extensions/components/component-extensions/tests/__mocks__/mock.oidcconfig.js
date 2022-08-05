/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

// Note : Charachter limit is ignored since it's a mock response file.
module.exports = {
    "groupedTemplates": [
        {
            "authenticationProtocol": "",
            "category": "DEFAULT_CUSTOM",
            "description": "Manually configure the inbound authentication protocol, authentication flow, etc.",
            "displayOrder": 0,
            "id": "custom-application",
            "image": "customApp",
            "name": "Custom Application",
            "self": "",
            "types": [

            ]
        },
        {
            "category": "DEFAULT_GROUP",
            "description": "Regular web applications which uses re-directions inside browsers.",
            "id": "web-application",
            "image": "oidcWebApp",
            "name": "Web Application",
            "subTemplatesSectionTitle": "Protocols",
            "subTemplates": [
                {
                    "id": "b9c5e11e-fc78-484b-9bec-015d247561b8",
                    "name": "OpenID Connect",
                    "description": "Regular web applications which uses re-directions inside browsers.",
                    "image": "oidc",
                    "authenticationProtocol": "oidc",
                    "types": [
                        "java",
                        "dotNet"
                    ],
                    "category": "DEFAULT",
                    "displayOrder": 1,
                    "templateGroup": "web-application",
                    "self": "/t/carbon.super/api/server/v1/applications/templates/b9c5e11e-fc78-484b-9bec-015d247561b8"
                },
                {
                    "id": "776a73da-fd8e-490b-84ff-93009f8ede85",
                    "name": "SAML",
                    "description": "Regular web applications which uses redirections inside browsers.",
                    "image": "saml",
                    "authenticationProtocol": "saml",
                    "types": [
                        "java",
                        "dotNet"
                    ],
                    "category": "DEFAULT",
                    "displayOrder": 2,
                    "templateGroup": "web-application",
                    "self": "/t/carbon.super/api/server/v1/applications/templates/776a73da-fd8e-490b-84ff-93009f8ede85"
                }
            ]
        },
        {
            "id": "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
            "name": "Single-Page Application",
            "description": "Front-end applications that consume REST APIs.",
            "image": "spa",
            "authenticationProtocol": "oidc",
            "types": [
                "react",
                "angular",
                "vue"
            ],
            "category": "DEFAULT",
            "displayOrder": 3,
            "templateGroup": "spa",
            "self": "/t/carbon.super/api/server/v1/applications/templates/6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
        },
        {
            "category": "DEFAULT_GROUP",
            "description": "Applications developed to target native desktops.",
            "id": "desktop",
            "image": "windowsNative",
            "name": "Desktop Application",
            "subTemplatesSectionTitle": "Technology",
            "subTemplates": [
                {
                    "id": "df929521-6768-44f5-8586-624126ec3f8b",
                    "name": "Windows",
                    "description": "Applications developed to target windows desktops.",
                    "image": "windows",
                    "authenticationProtocol": "oidc",
                    "types": [
                        "dotNet"
                    ],
                    "category": "DEFAULT",
                    "displayOrder": 4,
                    "templateGroup": "desktop",
                    "self": "/t/carbon.super/api/server/v1/applications/templates/df929521-6768-44f5-8586-624126ec3f8b"
                }
            ]
        },
        {
            "category": "DEFAULT_GROUP",
            "description": "Applications developed to target mobiles devices.",
            "id": "mobile",
            "image": "oidcMobile",
            "name": "Mobile Application",
            "subTemplatesSectionTitle": "Technology",
            "subTemplates": [
                {
                    "id": "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec",
                    "name": "Android",
                    "description": "Applications developed to target Android mobiles devices.",
                    "image": "android",
                    "authenticationProtocol": "oidc",
                    "types": [
                        "android"
                    ],
                    "category": "DEFAULT",
                    "displayOrder": 5,
                    "templateGroup": "mobile",
                    "self": "/t/carbon.super/api/server/v1/applications/templates/44a2d9d9-bc0c-4b54-85df-1cf08f4002ec"
                }
            ]
        },
        {
            "id": "h9c5e23e-fc78-484b-9bec-015d242361b8",
            "name": "Box",
            "description": "Cloud content management and file sharing service for businesses.",
            "image": "box",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication"
            ],
            "category": "VENDOR",
            "displayOrder": 6,
            "self": "/t/carbon.super/api/server/v1/applications/templates/h9c5e23e-fc78-484b-9bec-015d242361b8"
        },
        {
            "id": "z345e11e-fc78-484b-9bec-015d2475u341r",
            "name": "Slack",
            "description": "Business communication platform with persistent chat rooms.",
            "image": "slack",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication",
                "Community"
            ],
            "category": "VENDOR",
            "displayOrder": 7,
            "self": "/t/carbon.super/api/server/v1/applications/templates/z345e11e-fc78-484b-9bec-015d2475u341r"
        },
        {
            "id": "r565e11e-fc78-484b-9bec-015d24753456",
            "name": "Workday",
            "description": "On‑demand financial management and human capital management.",
            "image": "workday",
            "authenticationProtocol": "oidc",
            "types": [
                "HR"
            ],
            "category": "VENDOR",
            "displayOrder": 8,
            "self": "/t/carbon.super/api/server/v1/applications/templates/r565e11e-fc78-484b-9bec-015d24753456"
        },
        {
            "id": "t565e11e-fc78-484b-9bec-015d2472008",
            "name": "Zoom",
            "description": "Enterprise video communications through online chat services.",
            "image": "zoom",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication"
            ],
            "category": "VENDOR",
            "displayOrder": 9,
            "self": "/t/carbon.super/api/server/v1/applications/templates/t565e11e-fc78-484b-9bec-015d2472008"
        }
    ],
    "meta": {
        "customInboundProtocolChecked": false,
        "customInboundProtocols": [

        ],
        "inboundProtocols": [
            {
                "displayName": "OpenID Connect",
                "enabled": true,
                "id": "oidc",
                "logo": "oidc",
                "name": "oidc",
                "type": "oauth2"
            },
            {
                "displayName": "SAML 2.0",
                "enabled": true,
                "id": "saml",
                "logo": "saml",
                "name": "saml",
                "type": "samlsso"
            },
            {
                "displayName": "WS-Trust",
                "enabled": true,
                "id": "ws-trust",
                "logo": "wsTrust",
                "name": "ws-trust",
                "type": "wstrust"
            }
        ],
        "protocolMeta": {

        }
    },
    "oidcConfigurations": {
        "authorizeEndpoint": "https://localhost:9443/oauth2/authorize",
        "introspectionEndpoint": "https://localhost:9443/oauth2/introspect",
        "jwksEndpoint": "https://localhost:9443/oauth2/jwks",
        "tokenEndpoint": "https://localhost:9443/oauth2/token",
        "userEndpoint": "https://localhost:9443/oauth2/userinfo"
    },
    "samlConfigurations": {
        "certificate": "MIIDqTCCApGgAwIBAgIEXbABozANBgkqhkiG9w0BAQsFADBkMQswCQYDVQQGEwJVUzELMAkGA1UE\nCAwCQ0ExFjAUBgNVBAcMDU1vdW50YWluIFZpZXcxDTALBgNVBAoMBFdTTzIxDTALBgNVBAsMBFdT\nTzIxEjAQBgNVBAMMCWxvY2FsaG9zdDAeFw0xOTEwMjMwNzMwNDNaFw0yMjAxMjUwNzMwNDNaMGQx\nCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEWMBQGA1UEBwwNTW91bnRhaW4gVmlldzENMAsGA1UE\nCgwEV1NPMjENMAsGA1UECwwEV1NPMjESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0B\nAQEFAAOCAQ8AMIIBCgKCAQEAxeqoZYbQ/Sr8DOFQ+/qbEbCp6Vzb5hzH7oa3hf2FZxRKF0H6b8CO\nMzz8+0mvEdYVvb/31jMEL2CIQhkQRol1IruD6nBOmkjuXJSBficklMaJZORhuCrB4roHxzoG19aW\nmscA0gnfBKo2oGXSjJmnZxIh+2X6syHCfyMZZ00LzDyrgoXWQXyFvCA2ax54s7sKiHOM3P4A9W4Q\nUwmoEi4HQmPgJjIM4eGVPh0GtIANN+BOQ1KkUI7OzteHCTLu3VjxM0sw8QRayZdhniPF+U9n3fa1\nmO4KLBsW4mDLjg8R/JuAGTX/SEEGj0B5HWQAP6myxKFz2xwDaCGvT+rdvkktOwIDAQABo2MwYTAU\nBgNVHREEDTALgglsb2NhbGhvc3QwHQYDVR0OBBYEFEDpLB4PDgzsdxD2FV3rVnOr/A0DMB0GA1Ud\nJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjALBgNVHQ8EBAMCBPAwDQYJKoZIhvcNAQELBQADggEB\nAE8H/axAgXjt93HGCYGumULW2lKkgqEvXryP2QkRpbyQSsTYcL7ZLSVB7MVVHtIsHh8f1C4Xq6Qu\n8NUrqu5ZLC1pUByaqR2ZIzcj/OWLGYRjSTHSVmVIq9QqBq1j7r6f3BWqaOIiknmTzEuqIVlOTY0g\nO+SHdS62vr2FCz4yOrBEulGAvomsU8sqg4PhFnkhxI4M912Ly+2RgN9L7AkhzK+EzXY1/QtlI/Vy\nsNfS6zrHasKz6CrKKCGqQnBnSvSTyF9OR5KFHnkAwE995IZrcSQicMxsLhTMUHDLQ/gRyy7V/ZpD\nMfAWR+5OeQiNAp/bG4fjJoTdoqkul51+2bHHVrU=",
        "issuer": "localhost",
        "metadata": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><EntityDescriptor xmlns=\"urn:oasis:names:tc:SAML:2.0:metadata\" entityID=\"localhost\"><IDPSSODescriptor WantAuthnRequestsSigned=\"false\" protocolSupportEnumeration=\"urn:oasis:names:tc:SAML:2.0:protocol\" validUntil=\"2020-09-29T05:25:24.215Z\"><KeyDescriptor use=\"signing\"><KeyInfo xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><X509Data><X509Certificate>MIIDqTCCApGgAwIBAgIEXbABozANBgkqhkiG9w0BAQsFADBkMQswCQYDVQQGEwJVUzELMAkGA1UE\nCAwCQ0ExFjAUBgNVBAcMDU1vdW50YWluIFZpZXcxDTALBgNVBAoMBFdTTzIxDTALBgNVBAsMBFdT\nTzIxEjAQBgNVBAMMCWxvY2FsaG9zdDAeFw0xOTEwMjMwNzMwNDNaFw0yMjAxMjUwNzMwNDNaMGQx\nCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEWMBQGA1UEBwwNTW91bnRhaW4gVmlldzENMAsGA1UE\nCgwEV1NPMjENMAsGA1UECwwEV1NPMjESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0B\nAQEFAAOCAQ8AMIIBCgKCAQEAxeqoZYbQ/Sr8DOFQ+/qbEbCp6Vzb5hzH7oa3hf2FZxRKF0H6b8CO\nMzz8+0mvEdYVvb/31jMEL2CIQhkQRol1IruD6nBOmkjuXJSBficklMaJZORhuCrB4roHxzoG19aW\nmscA0gnfBKo2oGXSjJmnZxIh+2X6syHCfyMZZ00LzDyrgoXWQXyFvCA2ax54s7sKiHOM3P4A9W4Q\nUwmoEi4HQmPgJjIM4eGVPh0GtIANN+BOQ1KkUI7OzteHCTLu3VjxM0sw8QRayZdhniPF+U9n3fa1\nmO4KLBsW4mDLjg8R/JuAGTX/SEEGj0B5HWQAP6myxKFz2xwDaCGvT+rdvkktOwIDAQABo2MwYTAU\nBgNVHREEDTALgglsb2NhbGhvc3QwHQYDVR0OBBYEFEDpLB4PDgzsdxD2FV3rVnOr/A0DMB0GA1Ud\nJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjALBgNVHQ8EBAMCBPAwDQYJKoZIhvcNAQELBQADggEB\nAE8H/axAgXjt93HGCYGumULW2lKkgqEvXryP2QkRpbyQSsTYcL7ZLSVB7MVVHtIsHh8f1C4Xq6Qu\n8NUrqu5ZLC1pUByaqR2ZIzcj/OWLGYRjSTHSVmVIq9QqBq1j7r6f3BWqaOIiknmTzEuqIVlOTY0g\nO+SHdS62vr2FCz4yOrBEulGAvomsU8sqg4PhFnkhxI4M912Ly+2RgN9L7AkhzK+EzXY1/QtlI/Vy\nsNfS6zrHasKz6CrKKCGqQnBnSvSTyF9OR5KFHnkAwE995IZrcSQicMxsLhTMUHDLQ/gRyy7V/ZpD\nMfAWR+5OeQiNAp/bG4fjJoTdoqkul51+2bHHVrU=</X509Certificate></X509Data></KeyInfo></KeyDescriptor><ArtifactResolutionService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:SOAP\" Location=\"https://localhost:9443/samlartresolve\" index=\"1\"/><SingleLogoutService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:SOAP\" Location=\"https://localhost:9443/samlsso\" ResponseLocation=\"https://localhost:9443/samlsso\"/><SingleLogoutService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" Location=\"https://localhost:9443/samlsso\" ResponseLocation=\"https://localhost:9443/samlsso\"/><SingleLogoutService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect\" Location=\"https://localhost:9443/samlsso\" ResponseLocation=\"https://localhost:9443/samlsso\"/><SingleSignOnService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" Location=\"https://localhost:9443/samlsso\"/><SingleSignOnService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect\" Location=\"https://localhost:9443/samlsso\"/></IDPSSODescriptor></EntityDescriptor>",
        "sloUrl": "https://localhost:9443/samlsso",
        "ssoUrl": "https://localhost:9443/samlsso"
    },
    "templates": [
        {
            "authenticationProtocol": "",
            "category": "DEFAULT_CUSTOM",
            "description": "Manually configure the inbound authentication protocol, authentication flow, etc.",
            "displayOrder": 0,
            "id": "custom-application",
            "image": "customApp",
            "name": "Custom Application",
            "self": "",
            "types": [

            ]
        },
        {
            "id": "b9c5e11e-fc78-484b-9bec-015d247561b8",
            "name": "OpenID Connect",
            "description": "Regular web applications which uses re-directions inside browsers.",
            "image": "oidc",
            "authenticationProtocol": "oidc",
            "types": [
                "java",
                "dotNet"
            ],
            "category": "DEFAULT",
            "displayOrder": 1,
            "templateGroup": "web-application",
            "self": "/t/carbon.super/api/server/v1/applications/templates/b9c5e11e-fc78-484b-9bec-015d247561b8"
        },
        {
            "id": "776a73da-fd8e-490b-84ff-93009f8ede85",
            "name": "SAML",
            "description": "Regular web applications which uses redirections inside browsers.",
            "image": "saml",
            "authenticationProtocol": "saml",
            "types": [
                "java",
                "dotNet"
            ],
            "category": "DEFAULT",
            "displayOrder": 2,
            "templateGroup": "web-application",
            "self": "/t/carbon.super/api/server/v1/applications/templates/776a73da-fd8e-490b-84ff-93009f8ede85"
        },
        {
            "id": "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
            "name": "Single-Page Application",
            "description": "Front-end applications that consume REST APIs.",
            "image": "spa",
            "authenticationProtocol": "oidc",
            "types": [
                "react",
                "angular",
                "vue"
            ],
            "category": "DEFAULT",
            "displayOrder": 3,
            "templateGroup": "spa",
            "self": "/t/carbon.super/api/server/v1/applications/templates/6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
        },
        {
            "id": "df929521-6768-44f5-8586-624126ec3f8b",
            "name": "Windows",
            "description": "Applications developed to target windows desktops.",
            "image": "windows",
            "authenticationProtocol": "oidc",
            "types": [
                "dotNet"
            ],
            "category": "DEFAULT",
            "displayOrder": 4,
            "templateGroup": "desktop",
            "self": "/t/carbon.super/api/server/v1/applications/templates/df929521-6768-44f5-8586-624126ec3f8b"
        },
        {
            "id": "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec",
            "name": "Android",
            "description": "Applications developed to target Android mobiles devices.",
            "image": "android",
            "authenticationProtocol": "oidc",
            "types": [
                "android"
            ],
            "category": "DEFAULT",
            "displayOrder": 5,
            "templateGroup": "mobile",
            "self": "/t/carbon.super/api/server/v1/applications/templates/44a2d9d9-bc0c-4b54-85df-1cf08f4002ec"
        },
        {
            "id": "h9c5e23e-fc78-484b-9bec-015d242361b8",
            "name": "Box",
            "description": "Cloud content management and file sharing service for businesses.",
            "image": "box",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication"
            ],
            "category": "VENDOR",
            "displayOrder": 6,
            "self": "/t/carbon.super/api/server/v1/applications/templates/h9c5e23e-fc78-484b-9bec-015d242361b8"
        },
        {
            "id": "z345e11e-fc78-484b-9bec-015d2475u341r",
            "name": "Slack",
            "description": "Business communication platform with persistent chat rooms.",
            "image": "slack",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication",
                "Community"
            ],
            "category": "VENDOR",
            "displayOrder": 7,
            "self": "/t/carbon.super/api/server/v1/applications/templates/z345e11e-fc78-484b-9bec-015d2475u341r"
        },
        {
            "id": "r565e11e-fc78-484b-9bec-015d24753456",
            "name": "Workday",
            "description": "On‑demand financial management and human capital management.",
            "image": "workday",
            "authenticationProtocol": "oidc",
            "types": [
                "HR"
            ],
            "category": "VENDOR",
            "displayOrder": 8,
            "self": "/t/carbon.super/api/server/v1/applications/templates/r565e11e-fc78-484b-9bec-015d24753456"
        },
        {
            "id": "t565e11e-fc78-484b-9bec-015d2472008",
            "name": "Zoom",
            "description": "Enterprise video communications through online chat services.",
            "image": "zoom",
            "authenticationProtocol": "oidc",
            "types": [
                "Communication"
            ],
            "category": "VENDOR",
            "displayOrder": 9,
            "self": "/t/carbon.super/api/server/v1/applications/templates/t565e11e-fc78-484b-9bec-015d2472008"
        }
    ]
}
