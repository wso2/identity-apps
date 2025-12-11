<%--
  ~ Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ResourceBundle" %>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ClaimRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ClaimRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.LocalClaim" %>

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
    public String getUsernameLabel(ResourceBundle resourceBundle, String allowedAttributes, String tenantDomain) {
        
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
                } else {
                    i18nKey = getClaimDisplayName(attribute, tenantDomain);
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

    /**
     * Retrieves the display name of a claim based on its URI and tenant domain.
     *
     * @param claimUri     The URI of the claim for which the display name is to be retrieved.
     *                     If the claim URI is blank, the method will return null.
     * @param tenantDomain The tenant domain in which the claim resides.
     * 
     * @return The display name of the claim if found, or null if the claim does not exist
     *         or an error occurs during retrieval.
     */
    private String getClaimDisplayName(String claimUri, String tenantDomain) {

        if (StringUtils.isBlank(claimUri)) {
            return null;
        }

        try {
            ClaimRetrievalClient claimRetrievalClient = new ClaimRetrievalClient();
            List<String> claimURIs = Arrays.asList(claimUri);
            Map<String, LocalClaim> claimResult = claimRetrievalClient.getLocalClaimsByURIs(tenantDomain, claimURIs);
            LocalClaim claim = claimResult.get(claimUri);

            if (claim != null) {
                return claim.getDisplayName();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
%>
