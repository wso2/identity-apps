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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<jsp:directive.include file="includes/flow-utils.jsp"/>

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
    String accessedURL = request.getRequestURL().toString();
    String servletPath = request.getServletPath();
    String contextPath = request.getContextPath();
    String subPath = servletPath + contextPath;
    String baseURL = accessedURL.substring(0, accessedURL.length() - subPath.length());
    String authenticationPortalURL = baseURL + contextPath;

    if (tenantDomain != null
        && !tenantDomain.isEmpty()
        && !tenantDomain.equalsIgnoreCase(IdentityManagementEndpointConstants.SUPER_TENANT)) {
        authenticationPortalURL = baseURL + "/t/" + tenantDomain + contextPath;
    }
%>

<%
    String local = "en-US";
    String jsonFilePath = application.getRealPath("/i18n/translations/" + local + ".json");
    String translationsJson = "{}";
    String state = request.getParameter("state");
    String code = request.getParameter("code");
    String spId = request.getParameter("spId");
    String confirmationCode = request.getParameter("confirmation");
    String flowType = request.getParameter("flowType");
    String mlt = request.getParameter("mlt");
    String flowId = request.getParameter("flowId");

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

    <script>
        window.onSubmit = function(token) {
            console.log("Got recaptcha token:", token);
        };
    </script>
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
              <div id="react-root" class="react-ui-container"></div>
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
    <script type="text/javascript" src="js/error-utils.js"></script>
    <script type="text/javascript" src="js/constants.js"></script>

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
            const { DynamicContent, GlobalContextProvider, I18nProvider, executeFido2FLow, PasskeyEnrollment } = ReactUICore;

            const Content = () => {
                const baseUrl = "<%= identityServerEndpointContextParam %>";
                const authenticationEndpoint = baseUrl + "${pageContext.request.contextPath}";
                const defaultMyAccountUrl = "<%= myaccountUrl %>";
                const authPortalURL = "<%= authenticationPortalURL %>";
                const executionFlowApiProxyPath = authPortalURL + "/util/execution-flow-api.jsp";
                const code = "<%= Encode.forJavaScript(code) != null ? Encode.forJavaScript(code) : null %>";
                const state = "<%= Encode.forJavaScript(state) != null ? Encode.forJavaScript(state) : null %>";
                const confirmationCode = "<%= Encode.forJavaScript(confirmationCode) != null ? Encode.forJavaScript(confirmationCode) : null %>";
                const flowType = "<%= Encode.forJavaScript(flowType) != null ? Encode.forJavaScript(flowType) : null %>";
                const mlt = "<%= Encode.forJavaScript(mlt) != null ? Encode.forJavaScript(mlt) : null %>";
                const flowId = "<%= Encode.forJavaScript(flowId) != null ? Encode.forJavaScript(flowId) : null %>";
                const spId = "<%= !StringUtils.isBlank(spId) && spId != "null" ? Encode.forJavaScript(spId) : "new-application" %>";

                const locale = "en-US";
                const translations = <%= translationsJson %>;

                const [ flowData, setFlowData ] = useState(null);
                const [ components, setComponents ] = useState([]);
                const [ loading, setLoading ] = useState(true);
                const [ error, setError ] = useState(null);
                const [ postBody, setPostBody ] = useState(undefined);
                const [ flowError, setFlowError ] = useState(undefined);
                const [confirmationEffectDone, setConfirmationEffectDone] = useState(false);

                useEffect(() => {
                    const savedFlowId = localStorage.getItem("flowId");

                    if (code !== "null" && state !== "null") {
                        setPostBody({
                            flowId: savedFlowId,
                            actionId: "",
                            inputs: {
                                code,
                                state
                            }
                        });
                    }
                }, [code, state]);

                useEffect(() => {
                    if (mlt !== "null" && flowId !== "null") {
                        setPostBody({
                            flowId: flowId,
                            actionId: "",
                            inputs: {
                                mlt
                            }
                        });
                    }
                }, [mlt, flowId]);

                useEffect(() => {
                    if (confirmationCode !== "null" && !confirmationEffectDone) {
                        setPostBody({
                            flowType: flowType,
                            inputs: {
                                confirmationCode: confirmationCode
                            }
                        });
                        setConfirmationEffectDone(true);
                    }
                }, [confirmationCode, confirmationEffectDone]);

                useEffect(() => {
                    if (!postBody && code === "null" && confirmationCode === "null" && mlt === "null" && flowId === "null" && flowType == "null") {
                        setPostBody({ applicationId: spId, flowType: "REGISTRATION" });
                    } else if (!postBody && code === "null" && confirmationCode === "null" && mlt === "null" && flowId === "null" && flowType !== "null") {
                        setPostBody({ applicationId: spId, flowType: flowType });
                    }
                }, []);

                useEffect(() => {
                    if (!postBody) return;
                    setLoading(true);

                    fetch(executionFlowApiProxyPath, {
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

                useEffect(() => {
                    if (error && error.code) {
                        const errorDetails = getI18nKeyForError(error.code, flowType);
                        let portal_url = authPortalURL + "/register.do";
                        if (flowType === "INVITED_USER_REGISTRATION" || flowType === "PASSWORD_RECOVERY") {
                            portal_url = authPortalURL + "/recovery.do";
                        }
                        const errorPageURL = authPortalURL + "/execution_flow_error.do?" + "ERROR_MSG="
                            + errorDetails.message + "&" + "ERROR_DESC=" + errorDetails.description + "&" + "SP_ID="
                            + "<%= Encode.forJavaScript(spId) %>" + "&" + "flowType=" + flowType + "&" + "confirmation="
                            + "<%= Encode.forJavaScript(confirmationCode) %>" + "&" +
                            "PORTAL_URL=" + portal_url + "&SP=" + "<%= Encode.forJavaScript(sp) %>";

                        window.location.href = errorPageURL;
                    }

                    if (flowData && flowData.data && flowData.data.additionalData && flowData.data.additionalData.error) {
                        setFlowError(flowData.data.additionalData.error);
                    }
                }, [ error, flowType, flowData && flowData.data && flowData.data.additionalData && flowData.data.additionalData.error ]);

                const handleInternalPrompt = (flowData) => {
                    let providedInputs = {};
                    flowData.data.requiredParams.map((param) => {
                        if (param === "origin") {
                            providedInputs[param] = window.location.origin;
                        }
                    });

                    setPostBody({
                        flowId: flowData.flowId,
                        actionId: "",
                        inputs: providedInputs
                    });
                }

                const handleFlowStatus = (flow) => {
                    if (!flow) return false;

                    switch (flow.flowStatus) {
                        case "INCOMPLETE":
                            return false;

                        case "COMPLETE":
                            localStorage.clear();

                            if (flow.data.redirectURL !== null) {
                                window.location.href = flow.data.redirectURL;

                                return true;
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
                            break;

                        case "INTERNAL_PROMPT":
                            handleInternalPrompt(flow);
                            break;

                        case "WEBAUTHN":
                            executeFido2FLow(
                                flow,
                                setPostBody,
                                (error) => {
                                    setFlowError(error);
                                }
                            );
                            break;

                        default:
                            console.log(`Flow step type: ${flow.type}. No special action.`);
                    }
                };

                if (flowData && flowData.type === "WEBAUTHN") {
                    return createElement(
                        "div",
                        { className: "registration-content-container loaded" },
                        createElement(
                            PasskeyEnrollment, {
                                passkeyError: flowError
                            }
                        )
                    );
                }

                if (loading || (!components || components.length === 0)) {
                    return createElement(
                        "div",
                        { className: `registration-content-container loading ${!loading ? "hidden" : ""}` },
                        createElement(
                            "div",
                            { className: "spinner" }
                        )
                    );
                }

                return createElement(
                    "div",
                    { className: "registration-content-container loaded" },
                    createElement(
                        DynamicContent, {
                            contentData: flowData.data && flowData.data,
                            handleFlowRequest: (actionId, formValues) => {
                                setComponents([]);
                                localStorage.setItem("actionTrigger", actionId);
                                setPostBody({
                                    flowId: flowData.flowId,
                                    actionId,
                                    flowType: "REGISTRATION",
                                    inputs: formValues
                                });
                            },
                            error: flowError
                        }
                    )
                );
            }

            ReactDOM.render(
                createElement(
                    GlobalContextProvider,
                    { globalData: <%= reactGlobalContextJson %> },
                    createElement(
                        I18nProvider,
                        { locale: "en-US", translationsObject: <%= translationsJson %> },
                        createElement(Content)
                    )
                ),
                document.getElementById("react-root")
            );
        });
    </script>
</body>
</html>
