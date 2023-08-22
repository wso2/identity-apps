<%--
 ~
 ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%
    // Set default layout for non-super tenant users.
    layout = "centered";
    layoutFileRelativePath =  "extensions/layouts/" + layout + "/body.ser";

    // Get the layout store url from the configuration file
    String layoutStoreURL = application.getInitParameter("LayoutStoreURL");
    if (StringUtils.isBlank(layoutStoreURL)) {
      layoutStoreURL = "";
    }

    // Common data for the layout file.
    layoutData.put("BASE_URL", layoutStoreURL.replace("${tenantDomain}", tenantForTheming));

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

        // layout resolving logic.
        if (brandingPreference.has(LAYOUT_KEY)) {
          if (brandingPreference.getJSONObject(LAYOUT_KEY).has(ACTIVE_LAYOUT_KEY)) {
            if (!StringUtils.isBlank(brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY))){
              String temp = brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY);
              String layoutFilePath;
              if (StringUtils.equals(temp, "custom")) {
                  layout = temp + "-" + tenantForTheming;
                  layoutFileRelativePath = application.getInitParameter("LayoutStoreURL").replace("${tenantDomain}", tenantForTheming) + "/body.ser";
              } else {
                  layoutFilePath = "extensions/layouts/" + temp + "/body.ser";
                  if (config.getServletContext().getResource(layoutFilePath) != null) {
                    layout = temp;
                    layoutFileRelativePath = layoutFilePath;

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
