<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="java.net.*, java.io.*, org.json.*" %>
<%@include file="../includes/init-url.jsp" %>

<%
    StringBuilder requestBody = new StringBuilder();
    String line;
    boolean isSubmitRequest = false;
    String endpoint = "";

    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        if (requestBody.length() > 0) {
            JSONObject requestJson = new JSONObject(requestBody.toString());
            endpoint = "/api/server/v1/flow/execute";
        }
    } catch (Exception e) {
        out.print("{\"error\": \"Error reading request: " + e.getMessage() + "\"}");
        return;
    }

    StringBuilder apiResponse = new StringBuilder();
    HttpURLConnection connection = null;
    String apiURL = identityServerEndpointContextParam + endpoint;

    try {
        URL url = new URL(apiURL);
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

        connection.setDoOutput(true);

        if (requestBody.length() > 0) {
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = requestBody.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }
        }

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_CREATED) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                apiResponse.append(inputLine);
            }
            in.close();

            JSONObject responseObject = new JSONObject(apiResponse.toString());
            out.print(responseObject.toString(2));
        } else if (responseCode == HttpURLConnection.HTTP_INTERNAL_ERROR) {
            out.print("{\"error\": {\"code\": \"500\"}}");
        } else {
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(connection.getErrorStream(), "utf-8"));
            StringBuilder errorResponse = new StringBuilder();
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                errorResponse.append(errorLine);
            }
            errorReader.close();

            JSONObject errorObject = new JSONObject(errorResponse.toString());
            out.print("{\"error\": " + errorObject.toString(2) + "}");
        }
    } catch (Exception e) {
        out.print("{\"error\": \"Exception: " + e.getMessage() + "\"}");
    } finally {
        if (connection != null) {
            connection.disconnect();
        }
    }
%>
