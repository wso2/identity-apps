<%--
  ~ Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.FlowDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.flow.v1.FlowExecutionResponse" %>
<%@ page import="java.net.*, java.io.*, org.json.*" %>
<%@include file="../includes/init-url.jsp" %>

<%
    StringBuilder requestBody = new StringBuilder();
    String line;

    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        if (requestBody.length() > 0) {
            FlowDataRetrievalClient flowDataRetrievalClient = new FlowDataRetrievalClient();
            FlowExecutionResponse flowExecutionResponse = flowDataRetrievalClient.executeFlow(requestBody.toString(), tenantDomain);

            int responseCode = flowExecutionResponse.getStatusCode();
            JSONObject responseObject = flowExecutionResponse.getResponse();
            if (responseCode == 0  || responseObject == null) {
                out.print("{\"error\": {\"code\": \"500\"}}");
                return;
            }

            switch (responseCode) {
                case HttpURLConnection.HTTP_OK:
                case HttpURLConnection.HTTP_CREATED:
                    out.print(responseObject.toString(2));
                    break;
                case HttpURLConnection.HTTP_INTERNAL_ERROR:
                    out.print("{\"error\": {\"code\": \"500\"}}");
                    break;
                default:
                    out.print("{\"error\": " + responseObject.toString(2) + "}");
                    break;
            }
        }
    } catch (Exception e) {
        out.print("{\"error\": \"Exception: " + e.getMessage() + "\"}");
    }
%>
