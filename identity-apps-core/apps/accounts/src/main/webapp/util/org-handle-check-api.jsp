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
<%@ page import="java.net.*, java.io.*" %>
<%@ page import="java.util.Base64" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@include file="../includes/init-url.jsp" %>

<%
    StringBuilder requestBody = new StringBuilder();
    String line;

    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        String checkHandleUrl = identityServerEndpointContextParam
            + "/api/server/v1/organizations/check-handle";

        URL url = new URL(checkHandleUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
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
            byte[] input = requestBody.toString().getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        InputStream responseStream = (responseCode >= 200 && responseCode < 300)
            ? conn.getInputStream()
            : conn.getErrorStream();

        StringBuilder responseBody = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(responseStream, "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                responseBody.append(responseLine.trim());
            }
        }

        response.setStatus(responseCode);
        out.print(responseBody.toString());

    } catch (Exception e) {
        response.setStatus(500);
        out.print("{\"error\": \"Exception: " + e.getMessage() + "\"}");
    }
%>
