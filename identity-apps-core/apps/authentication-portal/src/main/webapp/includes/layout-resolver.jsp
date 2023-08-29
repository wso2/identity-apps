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

<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>

<%-- This part is maintained for backward compatibility --%>
<%
    // Change the layout name to activate another layout
    layout = "default";

    // Activate the "custom" layout if exists
    if (config.getServletContext().getResource("extensions/layouts/custom/body.ser") != null) {
        layout = "custom";
    }
    
    if (!layout.equals("custom")) {
        if (layout.equals("default")) {
            layoutFileRelativePath = "includes/layouts/" + layout + "/body.ser";
        } else {
            layoutFileRelativePath = "extensions/layouts/" + layout + "/body.ser";
            if (config.getServletContext().getResource(layoutFileRelativePath) == null) {
                layout = "default";
                layoutFileRelativePath = "includes/layouts/default/body.ser";
            }
        }
    } else {
        layoutFileRelativePath = "extensions/layouts/custom/body.ser";
    }
%>

<%-- Layout Resolver --%>
<%

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

            // Layout resolving logic.
            if (brandingPreference.has(LAYOUT_KEY)) {
                if (brandingPreference.getJSONObject(LAYOUT_KEY).has(ACTIVE_LAYOUT_KEY)) {
                    if (!StringUtils.isBlank(brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY))) {
                        String tempLayout = brandingPreference.getJSONObject(LAYOUT_KEY).getString(ACTIVE_LAYOUT_KEY);
                        String tempLayoutFileRelativePath = customLayoutFileRelativeBasePath + "/" + tempLayout + "/body.ser";
                        if (config.getServletContext().getResource(tempLayoutFileRelativePath) != null) {
                            layout = tempLayout;
                            layoutFileRelativePath = tempLayoutFileRelativePath;
                        }
                    }
                }
            }
        }
    }
%>
