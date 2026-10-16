---
"@wso2is/common.ui.selective-org-subscription.v1": minor
"@wso2is/admin.webhooks.v1": minor
"@wso2is/console": patch
"@wso2is/i18n": patch
---

Add per-channel child organization subscription policy to webhooks, backed by the Webhook
Management API v2.

The Select Events list becomes an accordion. Expanding an event reveals its Subscription Policy —
no fanout, all child organizations, or an explicitly selected set — replacing the single
tenant-level policy. Selecting organizations uses a new roleless organization tree picker shipped
as `common.ui.selective-org-subscription.v1`.

The webhook resource version follows the feature flag: `/api/server/v2/webhooks` when
`webhooks.childOrgSubscription` is enabled and `/api/server/v1/webhooks` when it is not. The
metadata and event profile endpoints are unversioned in the v2 specification and are served from
v1 either way.

The two versions cannot be mixed. v2 reports a webhook's channels only once the server's
`Webhooks.ChildOrganizationSubscriptionEnabled` is on, because a channel is identified there by
the UUID column that arrives with the subscription migration; calling v2 before that returns an
empty channel list for every webhook, which would show an existing webhook as having no events
subscribed. The console therefore stays entirely on v1 until the feature is enabled.

`webhooks.childOrgSubscription` is disabled by default and must be enabled together with
`Webhooks.ChildOrganizationSubscriptionEnabled` in the server's `deployment.toml`. Nothing
enforces that the two agree.
