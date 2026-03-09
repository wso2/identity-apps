---
"@wso2is/admin.application-templates.v1": minor
"@wso2is/admin.identity-verification-providers.v1": minor
"@wso2is/admin.push-providers.v1": minor
"@wso2is/admin.template-core.v1": minor
"@wso2is/form": minor
"@wso2is/i18n": minor
---

* New Features
  - Multi-provider support: The Push Providers page now loads all configured
    providers (FCM, AmazonSNS) simultaneously. Users can switch between provider cards
    without losing configurations.
  - Default push provider toggle: Added a toggle to designate a default push
    sender. It remains disabled until the push sender is configured.
  - Default provider UI indicator: Provider cards now display a "Default"
    chip label when marked as the default push sender.
  - Reusable KeyValueMapField: Introduced a new component in @wso2is/form
    for dynamic key-value pairs with dropdown support and read-only modes.

* API Updates:
  - updatePushProvider and deletePushProvider now accept a providerName
    parameter for specific endpoints.
  - Added updateDefaultPushProviderConfig API function.
  - Added useGetPushNotificationConfigs hook.

* UI Architecture
  - Moved EmphasizedSegment out of the dynamic form to allow for custom 
    styling and layout flexibility.

* Localization (i18n) 
  - Added "Default" label translations across all 10 supported languages.
