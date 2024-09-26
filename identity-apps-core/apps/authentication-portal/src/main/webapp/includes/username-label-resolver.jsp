<%--
  ~ Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="java.util.List" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.util.ResourceBundle" %>

<%!
    private static final String USERNAME_CLAIM_URI = "http://wso2.org/claims/username";
    private static final String EMAIL_CLAIM_URI = "http://wso2.org/claims/emailaddress";
    private static final String MOBILE_CLAIM_URI = "http://wso2.org/claims/mobile";
%>
<%!
    /**
     * Retrieve the username place holder when alternative
     * login identifiers are enabled.
     *
     * @return {String}
     */
    public String getUsernameLabel(ResourceBundle resourceBundle, String allowedAttributes) {
        
        String[] attributes = allowedAttributes.split(",");
        List<String> attributeList = new ArrayList<>();
        String usernameLabel="";

        
            for (int index = 0; index < attributes.length; index++) {
                String attribute = attributes[index];
                String i18nKey = null;
        
                if (StringUtils.equals(attribute, USERNAME_CLAIM_URI)) {
                    i18nKey = "username";
                } else if (StringUtils.equals(attribute, EMAIL_CLAIM_URI )) {
                    i18nKey = "email";
                } else if (StringUtils.equals(attribute, MOBILE_CLAIM_URI)) {
                    i18nKey = "mobile";
                }
        
                if (i18nKey != null) {
                    String i18nValue = AuthenticationEndpointUtil.i18n(resourceBundle, i18nKey);
                    if (index > 0) {
                        i18nValue = i18nValue.toLowerCase();
                    }
                    attributeList.add(i18nValue);
                }
            }

            if (attributeList.size() > 0) {
                String orString = AuthenticationEndpointUtil.i18n(resourceBundle, "or").toLowerCase(); 
                usernameLabel = String.join(", ", attributeList.subList(0, attributeList.size() - 1))
                    + (attributeList.size() > 1 ? " " + orString + " " : "")
                    + attributeList.get(attributeList.size() - 1);
            }

        return usernameLabel;
    }
%>
