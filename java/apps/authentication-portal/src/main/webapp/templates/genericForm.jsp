<%--
  ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="e" uri="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" %>
<jsp:directive.include file="../includes/init-url.jsp"/>
<%@ include file="../includes/localize.jsp" %>

<div class="text-left">
    <div>
        <h3 class="ui header">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "welcome")%> <c:out value='${requestScope.data["username"]}'/>
        </h3>
    </div>
    <form class="ui large form" action="<%=commonauthURL%>" method="POST">
        <c:forEach var="input" items='${requestScope.data["inputs"]}'>
            <div class="field">
                <label for="<e:forHtmlAttribute value="${input.id}" />" class="control-label"><e:forHtml value="${input.label}" /></label>
                <input type="text" id="<e:forHtmlAttribute value="${input.id}" />" name="<e:forHtmlAttribute value="${input.id}" />" class="form-control">
            </div>
        </c:forEach>
        <input type="hidden" id="promptResp" name="promptResp" value="true">
        <input type="hidden" id="promptId" name="promptId" value="${requestScope.promptId}">
        <input type="submit" class="ui primary medium button" value="Submit">
    </form>
</div>
<%-- /content --%>
