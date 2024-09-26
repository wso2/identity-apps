# Using Feature Flags

Feature flags are a powerful way to enable or disable features in your application dynamically. This approach allows you to 
deploy new features safely, perform A/B testing, and roll out features incrementally. In this guide, we'll walk through how to 
define and use feature flags in identity-apps React applications.

## High-Level Overview

- Identify the High-Level Feature: Determine the main feature that you want to control using feature flags.
- Locate Feature Config in Deployment Config: Ensure you have a configuration file or environment variables that manage your feature flags.
- Choose a Suitable Feature Identifier: Define a unique identifier for your sub-feature.
- Update the Disabled Features Array: Add your feature identifier to the disabledFeatures array in the feature configuration to disable it.
- Use Feature Flags in Your Code: Conditionally show/hide UI elements or run logic based on the feature flag.

## Step-by-Step Guide

1. Identify the High-Level Feature

First, determine which feature you want to control using a feature flag. For example, let's say we want to control the visibility
of a new "filter by metadata attribute" input field in organizations page. In this case, the high level feature is "organizations".

2. Locate Feature Config in Deployment Config

The deployment configuration in each React app includes a section for feature flags. Go to the file and locate the relevant
feature config object for your feature.

deployment.config.json:

```js
{
  "ui": {
    "features": [
      // other features,
      "organizations": { 
        "disabledFeatures": [],
        "enabled": true,
        "scopes": {
          "create": [ 
            "internal_organization_create"
          ],
          "delete": [ "internal_organization_delete" ],
          "feature": [ "console:organizations" ],
          "read": [ "internal_organization_view" ], 
          "update": [ "internal_organization_update" ] 
        }
      },   
    ]
  }
}
```

3. Choose a Suitable Feature Identifier

Select a unique and descriptive identifier for your feature. For our example, we'll use `organizations.filterByMetadataAttributes`.

4. Update the Disabled Features Array
   
Add your feature identifier to the `disabledFeatures` array in your configuration.

Updated deployment.config.json:

```js
{
  "ui": {
    "features": [
      // other features,
      "organizations": { 
        "disabledFeatures": [
          "organizations.filterByMetadataAttributes"
        ],
        "enabled": true,
        "scopes": {
          "create": [ 
            "internal_organization_create"
          ],
          "delete": [ "internal_organization_delete" ],
          "feature": [ "console:organizations" ],
          "read": [ "internal_organization_view" ], 
          "update": [ "internal_organization_update" ] 
        }
      },   
    ]
  }
}
```

5. Use Feature Flags in Your Code

Finally, use the feature flag to conditionally show/hide UI elements or run specific logic in your React components.

Example:

```js
import { isFeatureEnabled } from "@wso2is/core/helpers"

const App = () => {
  const organizationFeatureConfig: string[] = useSelector((state: AppState) =>
        state.config.ui.features?.organizations);

  return (
    <div>
      <h1>Organizations</h1>
      {isFeatureEnabled(organizationFeatureConfig, "organizations.filterByMetadataAttributes") && (
        <Select>
          <label>Select metadata attribute</label>
        </Select>
      )}
    </div>
  );
};

export default App;
```

In the above example, the "filter by metadata attribute" input is conditionally rendered based on the defined feature flag. If
`organizations.filterByMetadataAttributes` is included in the `disabledFeatures` array, the section will not be displayed.

## Conclusion

Using feature flags allows you to manage feature deployment more flexibly and safely. By following the steps outlined in this 
guide, you can define feature flags, manage them in your configuration, and use them to control the behavior and appearance of 
your application dynamically
