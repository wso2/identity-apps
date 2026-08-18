<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
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

<%
    // Only the i18n text related to these screens will be loaded from the text branding API.
    screenNames.add("sign-up");
    screenNames.add("email-link-expiry");
    screenNames.add("email-otp");
    screenNames.add("sms-otp");
    screenNames.add ("password-recovery");
    screenNames.add("password-reset");
    screenNames.add("password-reset-success");
    screenNames.add("flow-extension");
%>

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
    String accountsBaseURL = ServiceURLBuilder.create().addPath(contextPath).build().getAbsolutePublicURL();

    String state = request.getParameter("state");
    String code = request.getParameter("code");
    String spId = request.getParameter("spId");
    String confirmationCode = request.getParameter("confirmation");
    String flowType = request.getParameter("flowType");
    String mlt = request.getParameter("mlt");
    String flowId = request.getParameter("flowId");

    final String REGISTRATION = "REGISTRATION";
    final String INVITED_USER_REGISTRATION = "INVITED_USER_REGISTRATION";
    final String PASSWORD_RECOVERY = "PASSWORD_RECOVERY";

    if (StringUtils.isBlank(spId) && !StringUtils.isBlank(sp)) {
        try {
            if (sp.equals("My Account")) {
                spId = "My_Account";
            } else {
                ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
                spId = applicationDataRetrievalClient.getApplicationID(tenantDomain, sp);
            }
        } catch (Exception e) {
            // Ignored and send the default value.
        }
    }
%>

<%
    String anonymousProfileTracker = null;
    if (cookies != null) {
        for (javax.servlet.http.Cookie cookie : cookies) {
            if ("cds_profile".equals(cookie.getName())) {
                anonymousProfileTracker = cookie.getValue();
                break;
            }
        }
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
            console.log("Received the recaptcha token.");
        };
    </script>

    <script src="${pageContext.request.contextPath}/libs/qrcode.min.js"></script>
    <style>
        .wallet-reg-spinner {
            display: inline-block; width: 16px; height: 16px;
            border: 2px solid #ddd; border-top-color: #ff7300;
            border-radius: 50%; animation: wallet-reg-spin 1s linear infinite;
            vertical-align: middle; margin-right: 8px;
        }
        @keyframes wallet-reg-spin { to { transform: rotate(360deg); } }
        .wallet-reg-steps { text-align: left; padding-left: 20px; }
        .wallet-reg-steps li { margin-bottom: 8px; color: #444; font-size: 13px; }
    </style>

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
    <script type="text/javascript" src="js/flow-components.js"></script>

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

            const { createElement, useEffect, useState, useRef } = React;
            const { DynamicContent, GlobalContextProvider, I18nProvider, executeFido2FLow, PasskeyEnrollment } = ReactUICore;

            const Content = () => {
                const baseUrl = "<%= identityServerEndpointContextParam %>";
                const accountsPortalUrl = "<%= accountsBaseURL %>";
                const defaultMyAccountUrl = "<%= myaccountUrl %>";
                const executionFlowApiProxyPath = accountsPortalUrl + "/util/execution-flow-api.jsp";
                const code = "<%= Encode.forJavaScript(code) != null ? Encode.forJavaScript(code) : null %>";
                const state = "<%= Encode.forJavaScript(state) != null ? Encode.forJavaScript(state) : null %>";
                const confirmationCode = "<%= Encode.forJavaScript(confirmationCode) != null ? Encode.forJavaScript(confirmationCode) : null %>";
                const mlt = "<%= Encode.forJavaScript(mlt) != null ? Encode.forJavaScript(mlt) : null %>";
                const flowId = "<%= Encode.forJavaScript(flowId) != null ? Encode.forJavaScript(flowId) : null %>";
                const spId = "<%= !StringUtils.isBlank(spId) && spId != "null" ? Encode.forJavaScript(spId) : "new-application" %>";

                const anonymousProfileTracker = "<%= Encode.forJavaScript(anonymousProfileTracker) != null ? Encode.forJavaScript(anonymousProfileTracker) : null %>";
                const extendedInputResolvers = [
                    (initiatingFlowType) => initiatingFlowType === "REGISTRATION" && anonymousProfileTracker !== "null"
                        ? { anonymous_profile_tracker: anonymousProfileTracker }
                        : {}
                ];
                const getExtendedFlowInputs = (initiatingFlowType) => {
                    const inputs = extendedInputResolvers.reduce(
                        (collected, resolveInputs) => ({ ...collected, ...resolveInputs(initiatingFlowType) }),
                        {}
                    );
                    return Object.keys(inputs).length > 0 ? { inputs } : {};
                };

                const [ flowData, setFlowData ] = useState(null);
                const [ components, setComponents ] = useState([]);
                const [ loading, setLoading ] = useState(true);
                const [ error, setError ] = useState(null);
                const [ postBody, setPostBody ] = useState(undefined);
                const [ flowError, setFlowError ] = useState(undefined);
                const [ flowMessages, setFlowMessages ] = useState(undefined);
                const [confirmationEffectDone, setConfirmationEffectDone] = useState(false);
                const [userAssertion, setUserAssertion] = useState(null);
                const [flowType, setFlowType] = useState("<%= Encode.forJavaScript(flowType) != null ? Encode.forJavaScript(flowType) : null %>");
                const [ countDownRedirection, setCountDownRedirection ] = useState(null);
                const [ walletQR, setWalletQR ] = useState(null);
                const walletPollRef = useRef(null);

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
                            applicationId: spId,
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
                        setPostBody({ applicationId: spId, flowType: "REGISTRATION", ...getExtendedFlowInputs("REGISTRATION") });
                    } else if (!postBody && code === "null" && confirmationCode === "null" && mlt === "null" && flowId === "null" && flowType !== "null") {
                        setPostBody({ applicationId: spId, flowType: flowType, ...getExtendedFlowInputs(flowType) });
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
                            if (data.error.flowType) {
                                setFlowType(data.error.flowType);
                            }
                            setError(data.error);

                            return;
                        }

                        if (data.flowId) {
                            localStorage.setItem("flowId", data.flowId);
                        }

                        if (data.flowType) {
                            setFlowType(data.flowType);
                        }

                        const isFlowEnded = handleFlowStatus(data);

                        if (isFlowEnded) {
                            return;
                        }

                        handleStepType(data);
                        setFlowData(data);
                    })
                    .catch((err) => {
                        console.error("Error fetching flow data:", err);
                        setError(err);
                    })
                    .finally(() => setLoading(false));
                }, [ postBody ]);

                useEffect(() => {
                    if (!walletQR) return;

                    const { url, requestId, pollToken, flowId } = walletQR;

                    if (!pollToken) {
                        setError({ code: "VP_ERROR", message: "Wallet session identifier is missing. Please try again." });
                        setWalletQR(null);
                        return;
                    }

                    // VP-scoped polling guards — local to this effect invocation.
                    var vpPollInFlight = false;
                    var vpSubmitted = false;
                    var vpNetworkErrors = 0;
                    var VP_MAX_NETWORK_ERRORS = 5;
                    var VP_POLL_INTERVAL = 2000;
                    // Must be shorter than VP_POLL_INTERVAL so a hung request is aborted
                    // before the next poll fires (avoids the vpPollInFlight early-return
                    // leaving no reschedule registered).
                    var VP_POLL_TIMEOUT = 1500;
                    // Client-side guard: stop polling after 5 min even if the server
                    // never sends a terminal status (e.g. cache expiry bug).
                    var VP_MAX_DURATION_MS = 300000;
                    var vpPollStart = Date.now();

                    // Status endpoint.
                    var vpStatusEndpoint = baseUrl + "/openid4vp/v1/status?pollToken="
                        + encodeURIComponent(pollToken);

                    // Holds the AbortController for the in-flight fetch so the cleanup
                    // function can cancel it on unmount.
                    var vpCurrentController = null;

                    function schedulePoll() {
                        walletPollRef.current = setTimeout(poll, VP_POLL_INTERVAL);
                    }

                    // Called exactly once when status is VERIFIED — drives the flow engine
                    // to complete the step and advance to the next one.
                    var ADVANCE_FLOW_TIMEOUT = 15000;

                    function advanceFlow() {
                        var controller = new AbortController();
                        var timeoutId = setTimeout(function() { controller.abort(); }, ADVANCE_FLOW_TIMEOUT);

                        fetch(executionFlowApiProxyPath, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                flowId: flowId,
                                actionId: "",
                                inputs: { vp_request_id: requestId }
                            }),
                            signal: controller.signal
                        })
                        .then(function(r) {
                            clearTimeout(timeoutId);
                            return r.json();
                        })
                        .then(function(data) {
                            if (data.error) {
                                if (data.error.flowType) setFlowType(data.error.flowType);
                                setError(data.error);
                                setWalletQR(null);
                                return;
                            }
                            if (data.flowId) localStorage.setItem("flowId", data.flowId);
                            if (data.flowType) setFlowType(data.flowType);

                            var isEnded = handleFlowStatus(data);
                            if (!isEnded) {
                                handleStepType(data);
                                setFlowData(data);
                            }
                            setWalletQR(null);
                        })
                        .catch(function() {
                            clearTimeout(timeoutId);
                            setError({ code: "NETWORK_ERROR", message: "Unable to complete authentication. Please try again." });
                            setWalletQR(null);
                        });
                    }

                    function poll() {
                        if (vpSubmitted || vpPollInFlight) return;
                        if (Date.now() - vpPollStart > VP_MAX_DURATION_MS) {
                            vpSubmitted = true;
                            setError({ code: "VP_EXPIRED" });
                            setWalletQR(null);
                            return;
                        }
                        vpPollInFlight = true;

                        var controller = new AbortController();
                        vpCurrentController = controller;
                        var timeoutId = setTimeout(function() { controller.abort(); }, VP_POLL_TIMEOUT);

                        fetch(vpStatusEndpoint, {
                            method: "GET",
                            headers: { "Accept": "application/json" },
                            signal: controller.signal
                        })
                        .then(function(r) {
                            clearTimeout(timeoutId);
                            var httpStatus = r.status;
                            return r.json().then(function(data) {
                                return { httpStatus: httpStatus, data: data };
                            });
                        })
                        .then(function(result) {
                            vpPollInFlight = false;
                            vpCurrentController = null;
                            vpNetworkErrors = 0;

                            var httpStatus = result.httpStatus;
                            var data = result.data;

                            // Non-200 responses are unexpected backend errors (servlet always
                            // returns 200 for the /status path; body is { error, error_description }).
                            if (httpStatus !== 200) {
                                vpSubmitted = true;
                                setError({ code: "VP_ERROR" });
                                setWalletQR(null);
                                return;
                            }

                            // HTTP 200 — body is { requestId, status: "ACTIVE"|"VERIFIED"|"FAILED"|"EXPIRED"|"NOT_FOUND" }
                            var status = data.status ? data.status.toUpperCase() : "";

                            if (status === "ACTIVE") {
                                schedulePoll();
                            } else if (status === "VERIFIED") {
                                vpSubmitted = true;
                                advanceFlow();
                            } else if (status === "FAILED") {
                                vpSubmitted = true;
                                setError({ code: "VP_FAILED" });
                                setWalletQR(null);
                            } else if (status === "EXPIRED" || status === "NOT_FOUND") {
                                vpSubmitted = true;
                                setError({ code: "VP_EXPIRED" });
                                setWalletQR(null);
                            } else {
                                vpSubmitted = true;
                                setError({ code: "VP_ERROR" });
                                setWalletQR(null);
                            }
                        })
                        .catch(function(err) {
                            clearTimeout(timeoutId);
                            vpPollInFlight = false;
                            vpCurrentController = null;
                            if (vpSubmitted) return;

                            // AbortError means the per-request timeout fired (or cleanup ran).
                            // Don't count it as a network error — just retry.
                            if (err.name === "AbortError") {
                                schedulePoll();
                                return;
                            }

                            vpNetworkErrors++;
                            if (vpNetworkErrors < VP_MAX_NETWORK_ERRORS) {
                                schedulePoll();
                            } else {
                                vpSubmitted = true;
                                setError({ code: "NETWORK_ERROR", message: "Unable to reach the server. Please check your connection and try again." });
                                setWalletQR(null);
                            }
                        });
                    }

                    schedulePoll();

                    return function() {
                        vpSubmitted = true;
                        if (walletPollRef.current) {
                            clearTimeout(walletPollRef.current);
                            walletPollRef.current = null;
                        }
                        if (vpCurrentController) {
                            vpCurrentController.abort();
                            vpCurrentController = null;
                        }
                    };
                }, [ walletQR ]);

                useEffect(() => {
                    if (error && error.code) {
                        const errorDetails = getI18nKeyForError(error.code, flowType, error.message, error.description);
                        let portal_url = accountsPortalUrl + "/register";
                        if (flowType === "PASSWORD_RECOVERY") {
                            portal_url = accountsPortalUrl + "/recovery";
                        }
                        let errorPageURL = accountsPortalUrl + "/error?" + "ERROR_MSG="
                            + errorDetails.message + "&" + "ERROR_DESC=" + errorDetails.description + "&" + "SP_ID="
                            + "<%= Encode.forJavaScript(spId) %>" + "&" + "flowType=" + flowType + "&" + "confirmation="
                            + "<%= Encode.forJavaScript(confirmationCode) %>" + "&";

                        if (errorDetails.portalUrlStatus === "true") {
                            errorPageURL += "PORTAL_URL=" + portal_url + "&";
                        }

                        errorPageURL += "SP=" + "<%= Encode.forJavaScript(sp) %>";

                        window.location.href = errorPageURL;
                    }

                    setFlowMessages(flowData && flowData.data && flowData.data.messages);

                    if (flowData && flowData.data && flowData.data.additionalData && flowData.data.additionalData.error) {
                        setFlowError(flowData.data.additionalData.error);
                        return;
                    }
                    setFlowError(undefined);
                }, [ error, flowType,
                    flowData && flowData.data && flowData.data.additionalData && flowData.data.additionalData.error,
                    flowData && flowData.data && flowData.data.messages ]);

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

                const handleViewStep = (flow) => {
                    if (!flow) return;
                    if (flow.flowId && flow.data && flow.data.additionalData && flow.data.additionalData.state) {
                        localStorage.setItem(flow.data.additionalData.state, flow.flowId);
                    }
                };

                const handleFlowStatus = (flow) => {
                    if (!flow) return false;

                    switch (flow.flowStatus) {
                        case "INCOMPLETE":
                            return false;

                        case "COMPLETE":

                            const sessionDataKey = localStorage.getItem("sessionDataKey");
                            const userAssertion = flow.data.additionalData?.userAssertion;
                            if (sessionDataKey && userAssertion) {
                                setUserAssertion(userAssertion);
                                return true;
                            }

                            localStorage.clear();

                            if (flow.type === "VIEW" && flow.data) {
                                const components = flow.data.components || [];
                                // If components array is empty, use default components.
                                if (components.length === 0) {
                                    const contextPath = "${pageContext.request.contextPath}";
                                    const accountStatus = flow.data.additionalData?.accountStatus;
                                    const defaultComponents = getDefaultComponentsForFlowType(flowType, accountStatus, contextPath);
                                    flow.data.components = defaultComponents;
                                }
                                return false;
                            }

                            let redirectionUrl = defaultMyAccountUrl;

                            if (flow.data.redirectURL !== null) {
                                redirectionUrl = flow.data.redirectURL;
                            }

                            setFlowData(flow);
                            setComponents(flow.data.components || []);
                            setCountDownRedirection(redirectionUrl);
                            return true;

                        default: return false;
                    }
                };

                const handleStepType = (flow) => {
                    if (!flow) return false;
                    switch (flow.type) {
                        case "VIEW":
                            handleViewStep(flow);
                            setComponents(flow.data.components || []);
                            break;
                        case "REDIRECTION": {
                            var redirectURL = flow.data.redirectURL;
                            if (redirectURL && redirectURL.startsWith("openid4vp://")) {
                                var requestId = flow.data.additionalData && flow.data.additionalData.vp_request_id;
                                var pollToken = flow.data.additionalData && flow.data.additionalData.vp_poll_token;
                                setWalletQR({ url: redirectURL, requestId: requestId, pollToken: pollToken, flowId: flow.flowId });
                                setLoading(false);
                            } else {
                                setLoading(true);
                                window.location.href = redirectURL;
                            }
                            break;
                        }

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

                const AutoLoginForm = (data) => {
                    const formRef = React.useRef();
                    const handleSubmit = () => {
                        formRef.current.submit();
                    };

                    useEffect(() => {
                        if (userAssertion) {
                            handleSubmit();
                            setUserAssertion(null);
                        }
                    }, [userAssertion]);

                    return (
                        createElement(
                            "form",
                            {
                                ref: formRef,
                                method: "POST",
                                action: baseUrl + "/commonauth",
                                style: { display: 'none' }
                            },
                            createElement("input", { type: "hidden", name: "sessionDataKey", value: encodeURIComponent(localStorage.getItem("sessionDataKey") || "") }),
                            createElement("input", { type: "hidden", name: "userAssertion", value: encodeURIComponent(data.userAssertion || "") })
                        )
                    );
                }

                const { useTranslations } = ReactUICore;

                const WalletQRView = function() {
                    var qrRef = useRef(null);
                    var deepLinkTimerRef = useRef(null);
                    var deepLinkHandlerRef = useRef(null);
                    var [ qrStatus, setQrStatus ] = useState("pending");
                    var [ qrErrorMsg, setQrErrorMsg ] = useState("");
                    var [ deepLinkMsg, setDeepLinkMsg ] = useState("");
                    var i18n = useTranslations();
                    var t = function(key, fallback) {
                        return (i18n && i18n.translations && i18n.translations[key]) || fallback;
                    };

                    useEffect(function() {
                        return function() {
                            if (deepLinkTimerRef.current) clearTimeout(deepLinkTimerRef.current);
                            if (deepLinkHandlerRef.current) window.removeEventListener("blur", deepLinkHandlerRef.current);
                        };
                    }, []);

                    useEffect(function() {
                        if (!walletQR || !walletQR.url) {
                            setQrStatus("error");
                            setQrErrorMsg(t("wallet.vp.qr.error.generate", "Unable to generate QR code. Please restart the registration flow."));
                            return;
                        }
                        if (typeof QRCode === "undefined") {
                            setQrStatus("error");
                            setQrErrorMsg(t("wallet.vp.qr.error.load", "QR code could not be loaded. Please restart the registration flow."));
                            return;
                        }
                        try {
                            qrRef.current.innerHTML = "";
                            new QRCode(qrRef.current, {
                                text: walletQR.url,
                                width: 250,
                                height: 250,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.M
                            });
                            setQrStatus("ok");
                        } catch (e) {
                            setQrStatus("error");
                            setQrErrorMsg(t("wallet.vp.qr.error.generate", "Unable to generate QR code. Please restart the registration flow."));
                        }
                    }, [walletQR && walletQR.url]);

                    function handleWalletLinkClick(e) {
                        e.preventDefault();
                        if (deepLinkHandlerRef.current) {
                            window.removeEventListener("blur", deepLinkHandlerRef.current);
                            deepLinkHandlerRef.current = null;
                        }
                        if (deepLinkTimerRef.current) {
                            clearTimeout(deepLinkTimerRef.current);
                            deepLinkTimerRef.current = null;
                        }
                        deepLinkTimerRef.current = setTimeout(function() {
                            deepLinkTimerRef.current = null;
                            setDeepLinkMsg(t("wallet.vp.qr.mobile.no.wallet", "No wallet app detected. Use the QR code on a mobile device with your wallet installed."));
                        }, 1500);
                        deepLinkHandlerRef.current = function() {
                            clearTimeout(deepLinkTimerRef.current);
                            deepLinkTimerRef.current = null;
                            deepLinkHandlerRef.current = null;
                            setDeepLinkMsg("");
                        };
                        window.addEventListener("blur", deepLinkHandlerRef.current, { once: true });
                        window.location.href = walletQR && walletQR.url;
                    }

                    return createElement("div", { className: "segment-form" },
                        createElement("h3", { className: "ui header text-center" }, t("wallet.vp.qr.heading", "Register with Digital Wallet")),
                        createElement("p", { className: "text-center", style: { color: "#666", fontSize: "14px" } },
                            t("wallet.vp.qr.subtitle", "Scan the QR code below with your digital wallet to share your credentials")
                        ),
                        createElement("div", { className: "ui divider hidden" }),
                        createElement("div", { className: "field text-center" },
                            createElement("div", {
                                ref: qrRef,
                                style: {
                                    margin: "0 auto",
                                    width: "250px",
                                    height: qrStatus === "error" ? "0" : "250px",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }
                            })
                        ),
                        createElement("div", { className: "ui divider hidden" }),
                        qrStatus === "error"
                            ? createElement("div", { className: "ui warning message", style: { textAlign: "center" } },
                                createElement("span", null, qrErrorMsg)
                              )
                            : createElement("div", { className: "text-center" },
                                createElement("span", { className: "wallet-reg-spinner" }),
                                createElement("span", null, t("wallet.vp.qr.waiting", "Waiting for wallet verification..."))
                              ),
                        createElement("div", { className: "ui info message", style: { marginTop: "16px" } },
                            createElement("div", { className: "header", style: { fontSize: "14px", marginBottom: "10px" } }, t("wallet.vp.qr.howto.heading", "How to register")),
                            createElement("ol", { className: "wallet-reg-steps" },
                                createElement("li", null, t("wallet.vp.qr.howto.step1", "Open your digital wallet app (e.g. Inji)")),
                                createElement("li", null, t("wallet.vp.qr.howto.step2", "Scan the QR code above")),
                                createElement("li", null, t("wallet.vp.qr.howto.step3", "Review the credential request")),
                                createElement("li", null, t("wallet.vp.qr.howto.step4", "Approve to share your credentials"))
                            )
                        ),
                        createElement("div", { className: "ui divider hidden" }),
                        createElement("div", { className: "text-center" },
                            createElement("p", { style: { color: "#888", fontSize: "13px", marginBottom: "10px" } },
                                t("wallet.vp.qr.mobile.cta", "Or tap below if you're on mobile:")
                            ),
                            createElement("a", { href: walletQR && walletQR.url, className: "ui primary fluid large button", onClick: handleWalletLinkClick },
                                t("wallet.vp.qr.mobile.button", "Open in Wallet")
                            ),
                            deepLinkMsg ? createElement("p", { style: { marginTop: "8px", color: "#856404", fontSize: "13px" } }, deepLinkMsg) : null
                        )
                    );
                };

                // An auto-login assertion means the flow has completed. Submit the auto-login form
                // regardless of the previous step type, so a passkey (WEBAUTHN) step that completes
                // the flow does not get re-rendered and stall the auto-login.
                if (userAssertion) {
                    return createElement(
                        AutoLoginForm,
                        { userAssertion: userAssertion }
                    );
                }

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

                if (walletQR) {
                    return createElement(
                        "div",
                        { className: "registration-content-container loaded" },
                        createElement(WalletQRView, null)
                    );
                }

                if ((loading || !components || components.length === 0) && !countDownRedirection) {
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
                            state: { countDownRedirection },
                            handleFlowRequest: (actionId, formValues) => {
                                setComponents([]);
                                localStorage.setItem("actionTrigger", actionId);
                                setPostBody({
                                    flowId: flowData.flowId,
                                    actionId,
                                    flowType: flowType,
                                    inputs: formValues
                                });
                            },
                            error: flowError,
                            messages: flowMessages
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
                        { locale: "<%= Encode.forJavaScript(lang) %>", translationsObject: <%= i18nJsonString %> },
                        createElement(Content)
                    )
                ),
                document.getElementById("react-root")
            );
        });
    </script>
</body>
</html>
