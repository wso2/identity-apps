<%--
  ~ Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%-- Layout Resolver --%>
<%

    // Get the layout store url from the configuration file
    String tempLayoutStoreURL = application.getInitParameter("LayoutStoreURL");
    if (!StringUtils.isBlank(tempLayoutStoreURL)) {
        layoutStoreURL = tempLayoutStoreURL;
    }

    // Common data for the layout file.
    layoutData.put("BASE_URL", "includes/layouts/" + layout);

    if (brandingPreference != null) {
        // First, check if Branding is enabled.
        if (brandingPreference.has(CONFIGS_KEY)) {
            if (brandingPreference.getJSONObject(CONFIGS_KEY).has(IS_BRANDING_ENABLED_KEY)) {
                isBrandingEnabledInTenantPreferences = brandingPreference.getJSONObject(CONFIGS_KEY).getBoolean(IS_BRANDING_ENABLED_KEY);
            }
        }

        // Proceed only if the branding is enabled.
        if (isBrandingEnabledInTenantPreferences) {
            // Keys.
            String LAYOUT_KEY = "layout";
            String ACTIVE_LAYOUT_KEY = "activeLayout";
            String LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY = "sideImg";
            String LAYOUT_ATTRIBUTE_SIDE_IMAGE_URL_KEY = "imgURL";
            String LAYOUT_ATTRIBUTE_SIDE_IMAGE_ALT_KEY = "altText";
            String LAYOUT_ATTRIBUTE_PRODUCT_TAG_LINE_KEY = "productTagLine";

            // Layout names.
            String LEFT_IMAGE_LAYOUT_NAME = "left-image";
            String RIGHT_IMAGE_LAYOUT_NAME = "right-image";
            String LEFT_ALIGNED_LAYOUT_NAME = "left-aligned";
            String RIGHT_ALIGNED_LAYOUT_NAME = "right-aligned";

            // Keys for the layout data hash map.
            String SIDE_IMAGE_URL_KEY = "sideImgUrl";
            String SIDE_IMAGE_ALT_KEY = "sideImgAltText";
            String PRODUCT_TAG_LINE_KEY = "productTagLine";

            // Layout resolving logic.
            if (brandingPreference.has(LAYOUT_KEY)) {
                if (brandingPreference.getJSONObject(LAYOUT_KEY).has(ACTIVE_LAYOUT_KEY)) {
                    if (!StringUtils.isBlank(brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY))){
                        String temp = brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY);
                        if (StringUtils.equals(temp, "custom")) {
                            String tempLayout = "";
                            String tempLayoutFileRelativePath = "";
                            String tempBaseURL = "";

                            // App-wise and tenant-wise custom layout resolving logic.
                            if (StringUtils.equals(preferenceResourceType, APP_PREFERENCE_RESOURCE_TYPE)) {
                                tempLayout = temp + "-" + tenantRequestingPreferences + "-" + applicationRequestingPreferences;
                                tempLayoutFileRelativePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/apps/" + applicationRequestingPreferences + "/body.ser";
                                tempBaseURL = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/apps/" + applicationRequestingPreferences;
                            }

                            if (config.getServletContext().getResource(tempLayoutFileRelativePath) == null || StringUtils.equals(preferenceResourceType, ORG_PREFERENCE_RESOURCE_TYPE)) {
                                tempLayout = temp + "-" + tenantRequestingPreferences;
                                tempLayoutFileRelativePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/body.ser";
                                tempBaseURL = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences);
                            }

                            if (config.getServletContext().getResource(tempLayoutFileRelativePath) != null) {
                                layout = tempLayout;
                                layoutFileRelativePath = tempLayoutFileRelativePath;
                                layoutData.put("BASE_URL", tempBaseURL);
                            }
                        } else {
                            // Pre-added layouts
                            String layoutFilePath = "includes/layouts/" + temp + "/body.ser";
                            if (config.getServletContext().getResource(layoutFilePath) != null) {
                                layout = temp;
                                layoutFileRelativePath = layoutFilePath;
                                layoutData.put("BASE_URL", "includes/layouts/" + temp);

                                // Get the related data to specific layouts.
                                if (brandingPreference.getJSONObject(LAYOUT_KEY).has(LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY)) {
                                    if (brandingPreference.getJSONObject(LAYOUT_KEY).getJSONObject(LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY).has(LAYOUT_ATTRIBUTE_SIDE_IMAGE_URL_KEY)) {
                                        layoutData.put(SIDE_IMAGE_URL_KEY, brandingPreference.getJSONObject(LAYOUT_KEY).getJSONObject(LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY).getString(LAYOUT_ATTRIBUTE_SIDE_IMAGE_URL_KEY));
                                    }
                                    if (brandingPreference.getJSONObject(LAYOUT_KEY).getJSONObject(LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY).has(LAYOUT_ATTRIBUTE_SIDE_IMAGE_ALT_KEY)) {
                                        layoutData.put(SIDE_IMAGE_ALT_KEY, brandingPreference.getJSONObject(LAYOUT_KEY).getJSONObject(LAYOUT_ATTRIBUTE_SIDE_IMAGE_KEY).getString(LAYOUT_ATTRIBUTE_SIDE_IMAGE_ALT_KEY));
                                    }
                                }
                                if (brandingPreference.getJSONObject(LAYOUT_KEY).has(LAYOUT_ATTRIBUTE_PRODUCT_TAG_LINE_KEY)) {
                                    if (!StringUtils.isBlank(brandingPreference.getJSONObject(LAYOUT_KEY).getString(LAYOUT_ATTRIBUTE_PRODUCT_TAG_LINE_KEY))) {
                                        layoutData.put(PRODUCT_TAG_LINE_KEY, brandingPreference.getJSONObject(LAYOUT_KEY).getString(LAYOUT_ATTRIBUTE_PRODUCT_TAG_LINE_KEY));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
%>
