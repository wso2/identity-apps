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

<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
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
     * login identifiers are enabled. (Backward compatibility method)
     *
     * @param resourceBundle Resource bundle for i18n
     * @param allowedAttributes Comma separated allowed attributes
     * @return {String}
     */
    public String getUsernameLabel(ResourceBundle resourceBundle, String allowedAttributes) {
        
        return getUsernameLabel(resourceBundle, allowedAttributes, null);
    }

    /**
     * Retrieve the username place holder when alternative
     * login identifiers are enabled.
     *
     * @param resourceBundle Resource bundle for i18n
     * @param allowedAttributes Comma separated allowed attributes
     * @param tenantDomain The tenant domain
     * @return {String}
     */
    public String getUsernameLabel(ResourceBundle resourceBundle, String allowedAttributes, String tenantDomain) {
        
        String[] attributes = allowedAttributes.split(",");
        List<String> attributeList = new ArrayList<>();
        String usernameLabel = "";
        List<String> customClaimURIs = new ArrayList<>();

        
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
                    customClaimURIs.add(attribute);
                    continue;
                }
        
                if (i18nKey != null) {
                    String i18nValue = AuthenticationEndpointUtil.i18n(resourceBundle, i18nKey);
                    if (index > 0) {
                        i18nValue = i18nValue.toLowerCase();
                    }
                    attributeList.add(i18nValue);
                }
            }

            List<String> customClaimsDisplayNames = getClaimDisplayNames(customClaimURIs, tenantDomain);
            attributeList.addAll(customClaimsDisplayNames);

            if (attributeList.size() > 0) {
                String orString = AuthenticationEndpointUtil.i18n(resourceBundle, "or").toLowerCase(); 
                usernameLabel = String.join(", ", attributeList.subList(0, attributeList.size() - 1))
                    + (attributeList.size() > 1 ? " " + orString + " " : "")
                    + attributeList.get(attributeList.size() - 1);
            }

        return usernameLabel;
    }


    /**
     * Retrieves the display names of multiple claims based on their URIs and tenant domain.
     * This method batches the API call for better performance.
     *
     * @param claimURIs    The list of claim URIs for which display names are to be retrieved.
     * @param tenantDomain The tenant domain in which the claims reside.
     * 
     * @return A list containing display names of the claims.
     *         Returns empty list if no claims are found or an error occurs.
     */
    private List<String> getClaimDisplayNames(List<String> claimURIs, String tenantDomain) {

        List<String> displayNames = new ArrayList<>();

        if (claimURIs == null || claimURIs.isEmpty() || tenantDomain == null) {
            return displayNames;
        }

        try {
            ClaimRetrievalClient claimRetrievalClient = new ClaimRetrievalClient();
            Map<String, LocalClaim> claimResult = claimRetrievalClient.getLocalClaimsByURIs(tenantDomain, claimURIs);

            for (String claimUri : claimURIs) {
                LocalClaim claim = claimResult.get(claimUri);
                if (claim != null && claim.getDisplayName() != null) {
                    displayNames.add(claim.getDisplayName());
                }
            }
        } catch (ClaimRetrievalClientException e) {
            log.error("Error while retrieving claim display names for claim URIs: " + claimURIs, e);
        }

        return displayNames;
    }
%>
