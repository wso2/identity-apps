<%--
  ~ Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>

<%!
    /**
     * Checks whether multiple authentication options are available for the current step.
     *
     * @param multiOptionURI       The multi-option URI containing the list of authenticators.
     * @param currentAuthenticator The current authenticator identifier (e.g., "FIDOAuthenticator:LOCAL").
     * @return true if multiple authentication options are available, false otherwise.
     */
    private boolean isMultiAuthAvailable(String multiOptionURI, String currentAuthenticator) {

        if (StringUtils.isBlank(multiOptionURI) || "null".equals(multiOptionURI)) {
            return false;
        }

        int startIndex = multiOptionURI.indexOf("authenticators=");
        if (startIndex == -1) {
            return false;
        }

        String authSubstring = multiOptionURI.substring(startIndex + 15);
        int endIndex = authSubstring.indexOf("&");

        // Extract the authenticators list.
        String authenticators = (endIndex != -1) ? authSubstring.substring(0, endIndex) : authSubstring;
        List<String> authList = Arrays.asList(authenticators.split("%3B"));

        // Multi-option is only available if there are at least two options.
        if (authList.size() < 2) {
            return false;
        }

        // Backup codes are not considered a separate "option" for the UI toggle.
        if (authList.size() == 2 && authList.contains("backup-code-authenticator%3ALOCAL")) {
            return false;
        }

        // Ensure the multiOptionURI belongs to the current authentication step by
        // verifying the presence of the current authenticator in the list.
        if (StringUtils.isNotBlank(currentAuthenticator)) {
            String currentAuthName = currentAuthenticator.split(":")[0];
            if (authList.stream()
                    .map(auth -> auth.split("%3A")[0])
                    .noneMatch(currentAuthName::equals)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks whether multiple authentication options are available, without verifying step ownership
     * against a specific authenticator.
     *
     * @param multiOptionURI The multi-option URI containing the list of authenticators.
     * @return true if multiple authentication options are available, false otherwise.
     */
    private boolean isMultiAuthAvailable(String multiOptionURI) {
        return isMultiAuthAvailable(multiOptionURI, null);
    }
%>
