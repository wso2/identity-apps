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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.OrganizationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.organization.v1.OrganizationCheckResponse" %>
<%@include file="../includes/init-url.jsp" %>

<%
    StringBuilder requestBody = new StringBuilder();
    String line;

    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }

        OrganizationDataRetrievalClient organizationDataRetrievalClient = new OrganizationDataRetrievalClient();
        OrganizationCheckResponse organizationCheckResponse = organizationDataRetrievalClient.checkHandle(
                requestBody.toString());

        response.setStatus(organizationCheckResponse.getStatusCode());
        out.print(organizationCheckResponse.getResponse().toString());

    } catch (ApiException e) {
        response.setStatus(e.getCode() > 0 ? e.getCode() : 500);
        out.print("{\"error\": \"Organization handle check failed.\"}");
    } catch (Exception e) {
        response.setStatus(500);
        out.print("{\"error\": \"Organization handle check failed.\"}");
    }
%>
