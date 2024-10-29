<%--
  ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
<%
    StringBuilder requestBody = new StringBuilder();
    String line;
    boolean useCreatedObject = false;

    // Read the request body
    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        // Check if the request does NOT contain "applicationId"
        if (requestBody.length() > 0) {
            System.out.print(requestBody);
            JSONObject requestJson = new JSONObject(requestBody.toString());
            if (!requestJson.has("applicationId")) {
                useCreatedObject = true;  // Flag to use the "created" object
            }
        }
    } catch (Exception e) {
        out.print("{\"error\": \"Error reading request: " + e.getMessage() + "\"}");
        return;
    }

    String scheme = request.getScheme();
    String serverName = request.getServerName();
    int serverPort = request.getServerPort();
    String contextPath = request.getContextPath();

    // Construct the API URL
    String apiUrl = scheme + "://" + serverName + ":" + serverPort + contextPath + "/registration-mock-data.json";

    StringBuilder apiResponse = new StringBuilder();
    HttpURLConnection connection = null;

    try {
        URL url = new URL(apiUrl);
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                apiResponse.append(inputLine);
            }
            in.close();

            // Parse the API response JSON
            JSONObject apiJson = new JSONObject(apiResponse.toString());

            // Select the appropriate object based on the request content
            JSONObject responseObject;

            if (useCreatedObject && apiJson.has("created")) {
                responseObject = apiJson.getJSONObject("created");
            } else if (apiJson.has("init")) {
                responseObject = apiJson.getJSONObject("init");
            } else {
                responseObject = new JSONObject().put("error", "Invalid API response");
            }

            // Send the selected object as the response
            out.print(responseObject.toString(2));
        } else {
            out.print("{\"error\": \"Failed to fetch data. Response Code: " + responseCode + "\"}");
        }
    } catch (Exception e) {
        out.print("{\"error\": \"Exception: " + e.getMessage() + "\"}");
    } finally {
        if (connection != null) {
            connection.disconnect();
        }
    }
%>
