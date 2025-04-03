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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.nio.file.Files, java.nio.file.Paths, java.io.IOException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<% request.setAttribute("pageName", "self-registration"); %>

<%
    String myaccountUrl = application.getInitParameter("MyAccountURL");
    if (StringUtils.isNotEmpty(myaccountUrl)) {
        myaccountUrl = myaccountUrl + "/t/" + tenantDomain;
    } else {
        myaccountUrl = IdentityManagementEndpointUtil.getUserPortalUrl(
            application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL), tenantDomain);
    }
%>

<%
    String local = "en-US";
    String jsonFilePath = application.getRealPath("/i18n/translations/" + local + ".json");
    String translationsJson = "{}";
    String state = request.getParameter("state");
    String code = request.getParameter("code");

    try {
        byte[] jsonData = Files.readAllBytes(Paths.get(jsonFilePath));
        translationsJson = new String(jsonData, "UTF-8");
    } catch (IOException e) {
        e.printStackTrace();
    }
%>

<!DOCTYPE html>
<html lang="en-US">
<head>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>

    <link rel="preload" href="${pageContext.request.contextPath}/libs/react/react.production.min.js" as="script" />
    <link rel="preload" href="${pageContext.request.contextPath}/libs/react/react-dom.production.min.js" as="script" />
    <link rel="preload" href="${pageContext.request.contextPath}/js/react-ui-core.min.js" as="script" />
</head>
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
  <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
      <layout:component componentName="ProductHeader">
          <%-- product-title --%>
          <%
              File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
              if (productTitleFile.exists()) {
          %>
              <jsp:include page="extensions/product-title.jsp"/>
          <% } else { %>
              <jsp:include page="includes/product-title.jsp"/>
          <% } %>
      </layout:component>
      <layout:component componentName="MainSection">
          <div class="ui segment left aligned">
              <div id="react-root" class="react-ui-container"/>
          </div>
      </layout:component>
      <layout:component componentName="ProductFooter">
          <%-- product-footer --%>
          <%
              File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
              if (productFooterFile.exists()) {
          %>
          <jsp:include page="extensions/product-footer.jsp"/>
          <% } else { %>
          <jsp:include page="includes/product-footer.jsp"/>
          <% } %>
      </layout:component>
      <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
          <jsp:include page="${pathOfDynamicComponent}" />
      </layout:dynamicComponent>
  </layout:main>

  <%-- footer --%>
  <%
      File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
      if (footerFile.exists()) {
  %>
  <jsp:include page="extensions/footer.jsp"/>
  <% } else { %>
  <jsp:include page="includes/footer.jsp"/>
  <% } %>

    <script src="${pageContext.request.contextPath}/libs/react/react.production.min.js"></script>
    <script src="${pageContext.request.contextPath}/libs/react/react-dom.production.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/react-ui-core.min.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            if (typeof React === "undefined") {
                console.error("React library is required for React components build.");
                return;
            }

            if (typeof ReactDOM === "undefined") {
                console.error("ReactDOM library is required for rendering components.");
                return;
            }

            const { createElement, useEffect, useState } = React;
            const { DynamicContent, I18nProvider } = ReactUICore;

            const Content = () => {
                const baseUrl = "<%= identityServerEndpointContextParam %>";
                const defaultMyAccountUrl = "<%= myaccountUrl %>";
                const apiUrl = baseUrl + "${pageContext.request.contextPath}/util/self-registration-api.jsp";
                const code = "<%= code != null ? code : null %>";
                const state = "<%= state != null ? state : null %>";

                const locale = "en-US";
                const translations = <%= translationsJson %>;

                const [ flowData, setFlowData ] = useState(null);
                const [ components, setComponents ] = useState([]);
                const [ loading, setLoading ] = useState(true);
                const [ error, setError ] = useState(null);
                const [ postBody, setPostBody ] = useState(undefined);

                useEffect(() => {
                    const savedFlowId = localStorage.getItem("flowId");
                    const actionTrigger = localStorage.getItem("actionTrigger");

                    if (code !== "null" && state !== "null") {
                        setPostBody({
                            flowId: savedFlowId,
                            actionId: actionTrigger,
                            inputs: {
                                code,
                                state
                            }
                        });
                    }
                }, [ code, state ]);

                useEffect(() => {
                    if (!postBody && code === "null") {
                        setPostBody({ applicationId: "new-application" });
                    }
                }, []);

                useEffect(() => {
                    if (!postBody) return;
                    setLoading(true);

                    fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postBody)
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }

                        return response.json();
                    })
                    .then((data) => {
                        if (data.error) {
                            setError(data.error);

                            return;
                        }

                        if (data.flowId) {
                            localStorage.setItem("flowId", data.flowId);
                        }

                        const isFlowEnded = handleFlowStatus(data);

                        if (isFlowEnded) {
                            return;
                        }

                        if (data.type == "VIEW") {
                            setComponents(data.data.components || []);
                        } else {
                            handleStepType(data);
                        }
                        setFlowData(data);
                    })
                    .catch((err) => {
                        console.error("Error fetching flow data:", err);
                        setError(err);
                    })
                    .finally(() => setLoading(false));
                }, [ postBody ]);

                const handleFlowStatus = (flow) => {
                    if (!flow) return false;

                    switch (flow.flowStatus) {
                        case "INCOMPLETE":
                            return false;

                        case "COMPLETE":
                            localStorage.clear();

                            if (flow.data.url !== null) {
                                window.location.href = flow.data.url;
                            }

                            window.location.href = defaultMyAccountUrl;
                            return true;

                        default:
                            console.log(`Flow status: ${flow.flowStatus}. No special action.`);
                            return false;
                    }
                };

                const handleStepType = (flow) => {
                    if (!flow) return false;

                    switch (flow.type) {
                        case "REDIRECTION":
                            setLoading(true);
                            window.location.href = flow.data.redirectURL;

                        default:
                            console.log(`Flow step type: ${flow.type}. No special action.`);
                    }
                };

                if (error) {
                    return createElement(
                        "div",
                        { className: "ui visible negative message" },
                        "An error occurred while processing the registration flow. Please try again later."
                    );
                }

                if (loading || (!components || components.length === 0)) {
                    return createElement(
                        "div",
                        { className: `content-container loading ${!loading ? "hidden" : ""}` },
                        createElement(
                            "div",
                            { className: "spinner" }
                        )
                    );
                }

                return createElement(
                    "div",
                    { className: "content-container loaded" },
                    createElement(
                        DynamicContent, {
                            elements: components,
                            handleFlowRequest: (actionId, formValues) => {
                                setComponents([]);
                                localStorage.setItem("actionTrigger", actionId);
                                setPostBody({
                                    flowId: flowData.flowId,
                                    actionId,
                                    inputs: formValues
                                });
                            },
                            error: flowData && flowData.data && flowData.data.additionalData && flowData.data.additionalData.error
                        }
                    )
                );
            }

            ReactDOM.render(
            createElement(
                I18nProvider,
                { locale: "en-US", translationsObject: <%= translationsJson %> },
                createElement(Content)
            ),
                document.getElementById("react-root")
            );
        });
    </script>
</body>
</html>
