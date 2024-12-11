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
    boolean isSubmitRequest = false;
    String endpoint = "";

    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        System.out.println("Request: " + requestBody.toString());

        if (requestBody.length() > 0) {
            JSONObject requestJson = new JSONObject(requestBody.toString());
            if (requestJson.has("applicationId")) {
                endpoint = "/data/init-response.json"; 
            } else if (requestJson.has("action") && "PasswordOnboarder".equalsIgnoreCase(requestJson.getString("action"))) {
                endpoint = "/data/password-submit-response.json";
            } else if (requestJson.has("action") && "EmailOTPVerifier1".equalsIgnoreCase(requestJson.getString("action"))) {
                endpoint = "/data/emailotp-submit-1-response.json";
            } else if (requestJson.has("action") && "EmailOTPVerifier2".equalsIgnoreCase(requestJson.getString("action"))) {
                endpoint = "/data/emailotp-submit-2-response.json";
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

    String apiURL = scheme + "://" + serverName + ":" + serverPort + contextPath + endpoint;

    StringBuilder apiResponse = new StringBuilder();
    HttpURLConnection connection = null;

    try {
        URL url = new URL(apiURL);
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");

        connection.setDoOutput(true);

        // if (requestBody.length() > 0) {
        //     try (OutputStream os = connection.getOutputStream()) {
        //         byte[] input = requestBody.toString().getBytes("utf-8");
        //         os.write(input, 0, input.length);
        //     }
        // }

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                apiResponse.append(inputLine);
            }
            in.close();

            // Parse the API response JSON
            JSONObject responseObject = new JSONObject(apiResponse.toString()); 

            System.out.println("Response: " + responseObject.toString(2));           

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
