<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="java.util.Enumeration" %>

<%!
/**
 * Add a string value to JsonObject with support for key chaining (dot notation).
 * Example: addValue(jsonObj, "user.profile.name", "John").
 */
public static void addValue(JsonObject jsonObject, String key, String value) {
    if (jsonObject == null || key == null || key.trim().isEmpty()) {
        return;
    }

    String[] keyParts = key.split("\\.");
    JsonObject currentObject = jsonObject;

    // Navigate through the key chain, creating nested objects as needed.
    for (int i = 0; i < keyParts.length - 1; i++) {
        String keyPart = keyParts[i].trim();
        if (!currentObject.has(keyPart)) {
            currentObject.add(keyPart, new JsonObject());
        }
        currentObject = currentObject.getAsJsonObject(keyPart);
    }

    // Add the final value.
    String finalKey = keyParts[keyParts.length - 1].trim();
    currentObject.addProperty(finalKey, value);
}

/**
 * Convert JsonObject to compact JSON string.
 */
public static String toJson(JsonObject jsonObject) {
    Gson gson = new Gson();
    return gson.toJson(jsonObject);
}
%>

<%
    JsonObject reactGlobalContext = new JsonObject();
    addValue(reactGlobalContext, "branding.privacyPolicyUrl", privacyPolicyURL);
    addValue(reactGlobalContext, "branding.termsOfUseUrl", termsOfUseURL);
    addValue(reactGlobalContext, "branding.supportEmail", supportEmail);

    String backToUrl = Encode.forJavaScript(IdentityManagementEndpointUtil.encodeURL(request.getParameter("callback")));
    String sp = Encode.forJava(request.getParameter("sp"));
    String accessUrl;
    try {
        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        accessUrl = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
    } catch (Exception e) {
        accessUrl = null;
    }
    if (StringUtils.equalsIgnoreCase(backToUrl, "null")) {
        backToUrl = accessUrl;
    }
    addValue(reactGlobalContext, "application.accessUrl", accessUrl);
    addValue(reactGlobalContext, "application.callbackOrAccessUrl", backToUrl);

    // Generate i18n JSON object for React consumption.
    JsonObject i18nJson = new JsonObject();

    Enumeration<String> keys = resourceBundle.getKeys();
    while (keys.hasMoreElements()) {
        String key = keys.nextElement();
        String value = i18n(resourceBundle, customText, key);
        i18nJson.addProperty(key, value);
    }

    for (String key : customText.keySet()) {
        if (!i18nJson.has(key)) {
            i18nJson.addProperty(key, (String) customText.get(key));
        }
    }

    String i18nJsonString = toJson(i18nJson);
    String reactGlobalContextJson = toJson(reactGlobalContext);
%>
