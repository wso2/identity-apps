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

<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.util.Base64" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="org.apache.commons.logging.Log" %>
<%@ page import="org.apache.commons.logging.LogFactory" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@include file="../includes/init-url.jsp" %>

<%!
    private static final Log LOG = LogFactory.getLog("org-handle-check-api");
%>

<%
    final String checkHandlePath = "/api/server/v1/organizations/check-handle";
    final int connectTimeoutMs = 5000;
    final int readTimeoutMs = 10000;

    StringBuilder requestBody = new StringBuilder();
    String line;
    HttpURLConnection conn = null;

    try {
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
        }

        if (identityServerEndpointContextParam == null || identityServerEndpointContextParam.trim().isEmpty()) {
            LOG.error("The organization handle check endpoint is not configured.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": {\"code\": \"500\"}}");
            return;
        }

        String checkHandleUrl = identityServerEndpointContextParam + checkHandlePath;

        URL url = new URL(checkHandleUrl);
        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setConnectTimeout(connectTimeoutMs);
        conn.setReadTimeout(readTimeoutMs);
        conn.setInstanceFollowRedirects(false);
        conn.setUseCaches(false);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");

        // Authenticate the portal application; no signed-in user is required.
        IdentityManagementServiceUtil serviceUtil = IdentityManagementServiceUtil.getInstance();
        String clientCredentials = serviceUtil.getAppName() + ":" + String.valueOf(serviceUtil.getAppPassword());
        String clientAuthHeader = Base64.getEncoder().encodeToString(
            clientCredentials.getBytes(StandardCharsets.UTF_8));
        conn.setRequestProperty("Authorization", "Client " + clientAuthHeader);

        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestBody.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        InputStream responseStream = (responseCode >= 200 && responseCode < 300)
            ? conn.getInputStream()
            : conn.getErrorStream();

        StringBuilder responseBody = new StringBuilder();
        // getErrorStream() returns null for redirects and for error responses that
        // carry no body, so the stream must be null-checked before it is read.
        if (responseStream != null) {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(responseStream, StandardCharsets.UTF_8))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    responseBody.append(responseLine.trim());
                }
            }
        }

        if (responseCode >= 200 && responseCode < 300) {
            response.setStatus(responseCode);
            out.print(responseBody.toString());
        } else {
            // Log the upstream status and body so the failure can be diagnosed,
            // then return a generic error body instead of the upstream details.
            String responseMessage = conn.getResponseMessage();
            String logMessage = "Organization handle check failed. URL: " + checkHandleUrl
                + ", status: " + responseCode
                + (responseMessage != null && !responseMessage.isEmpty() ? " " + responseMessage : "")
                + ", response body: " + responseBody;

            // A 4xx describes the request itself rather than an upstream outage, so its
            // status is preserved. Redirects and 5xx are not forwarded to the browser.
            boolean clientError = responseCode >= 400 && responseCode < 500;
            int errorStatus = clientError ? responseCode : HttpServletResponse.SC_BAD_GATEWAY;

            if (clientError) {
                LOG.warn(logMessage);
            } else {
                LOG.error(logMessage);
            }

            response.setStatus(errorStatus);
            out.print("{\"error\": {\"code\": \"" + errorStatus + "\"}}");
        }
    } catch (Exception e) {
        LOG.error("Failed to invoke the organization handle check API.", e);
        response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
        out.print("{\"error\": {\"code\": \"502\"}}");
    } finally {
        if (conn != null) {
            conn.disconnect();
        }
    }
%>
