<%--
  ~ Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com).
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

<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URI" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String sessionDataKey = request.getParameter("sessionDataKey");
    String vpPollToken = request.getParameter("pollToken");
    String walletUrl = request.getParameter("walletUrl");
    String vpTenantDomain = request.getParameter("tenantDomain");
    String vpOrgId = request.getParameter("orgId");
    String vpRootTenantDomain = request.getParameter("rootTenantDomain");

    // Validate walletUrl: only non-empty openid4vp:// URIs with an authority component are accepted.
    // Encode.forJavaScript at the render site neutralises quote injection but cannot prevent a
    // javascript: URI from executing in window.location.href, so scheme validation must happen here.
    boolean invalidWalletUrl = false;
    if (walletUrl != null && !walletUrl.isEmpty()) {
        try {
            URI walletUri = new URI(walletUrl);
            invalidWalletUrl = !"openid4vp".equalsIgnoreCase(walletUri.getScheme())
                    || walletUri.getRawAuthority() == null;
        } catch (URISyntaxException e) {
            invalidWalletUrl = true;
        }
    }

    // Reject any tenant domain or org ID that contains path separators or other characters outside
    // the allowed identifier format. Encode.forHtmlAttribute blocks attribute injection but not
    // path traversal, so we must validate before building the form action URL.
    if ((vpOrgId != null && !vpOrgId.matches("[a-zA-Z0-9\\-]+"))
            || (vpTenantDomain != null && !vpTenantDomain.matches("[a-zA-Z0-9\\.\\-]+"))
            || (vpRootTenantDomain != null && !vpRootTenantDomain.matches("[a-zA-Z0-9\\.\\-]+"))
            || invalidWalletUrl) {
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
    }

    // Build org/tenant-aware commonauthURL.
    // For sub-org login use /t/{rootTenant}/o/{orgId}/commonauth with the ROOT tenant (e.g. carbon.super).
    // This ensures TenantContextRewriteValve sets applicationResidentOrganizationId and the commonAuthId cookie
    // is written with path "/" or "/t/carbon.super/" which matches the OAuth2 authorize URL.
    String commonauthURLForWallet;
    boolean hasOrgId = vpOrgId != null && !vpOrgId.isEmpty();
    boolean hasNonSuperTenant = vpTenantDomain != null && !vpTenantDomain.isEmpty()
            && !"carbon.super".equals(vpTenantDomain);
    boolean hasRootTenant = vpRootTenantDomain != null && !vpRootTenantDomain.isEmpty();
    if (hasOrgId) {
        String rootTenant = hasRootTenant ? vpRootTenantDomain
                : (hasNonSuperTenant ? vpTenantDomain : "carbon.super");
        commonauthURLForWallet = "/t/" + rootTenant + "/o/" + vpOrgId + "/commonauth";
    } else if (hasNonSuperTenant) {
        commonauthURLForWallet = "/t/" + vpTenantDomain + "/commonauth";
    } else {
        commonauthURLForWallet = commonauthURL;
    }
%>

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

        <%-- analytics --%>
        <%
            File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
            if (analyticsFile.exists()) {
        %>
            <jsp:include page="extensions/analytics.jsp"/>
        <% } else { %>
            <jsp:include page="includes/analytics.jsp"/>
        <% } %>

        <script src="${pageContext.request.contextPath}/libs/qrcode.min.js"></script>

        <style>
            #qrcode {
                margin: 0 auto;
                width: 250px;
                height: 250px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #qrcode canvas,
            #qrcode img {
                border-radius: 8px;
            }
            .wallet-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ddd;
                border-top-color: #ff7300;
                border-radius: 50%;
                animation: wallet-spin 1s linear infinite;
                vertical-align: middle;
                margin-right: 8px;
            }
            @keyframes wallet-spin {
                to { transform: rotate(360deg); }
            }
            .wallet-steps {
                text-align: left;
                padding-left: 20px;
            }
            .wallet-steps li {
                margin-bottom: 8px;
                color: #444;
                font-size: 13px;
            }
            @media (max-width: 480px) {
                #qrcode {
                    width: 200px;
                    height: 200px;
                }
            }
        </style>
    </head>

    <body class="login-portal layout totp-portal-layout">
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
                <div class="ui segment">
                    <%-- page content --%>
                    <h3 class="ui header text-center">
                        <%= i18n(resourceBundle, customText, "wallet.vp.login.heading") %>
                    </h3>
                    <p id="walletSubtitle" class="text-center" style="color: #666; font-size: 14px;">
                        <%= i18n(resourceBundle, customText, "wallet.vp.login.subtitle") %>
                    </p>
                    <div class="ui divider hidden"></div>

                    <div class="segment-form">
                        <%-- QR Code --%>
                        <div id="qrcodeSection" class="field text-center">
                            <div id="qrcode"></div>
                        </div>

                        <%-- Status --%>
                        <div class="ui divider hidden"></div>
                        <div class="text-center" id="statusContainer">
                            <div id="status">
                                <span class="wallet-spinner"></span>
                                <span><%= i18n(resourceBundle, customText, "wallet.vp.login.waiting") %></span>
                            </div>
                            <div id="errorActions" style="display: none; margin-top: 16px;">
                                <button class="ui primary fluid large button" onclick="goBackToSignIn()">
                                    <%= i18n(resourceBundle, customText, "wallet.vp.login.back.button") %>
                                </button>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <%-- Instructions --%>
                        <div id="instructionsSection" class="ui info message">
                            <div class="header" style="font-size: 14px; margin-bottom: 10px;">
                                <%= i18n(resourceBundle, customText, "wallet.vp.login.howto.heading") %>
                            </div>
                            <ol class="wallet-steps">
                                <li><%= i18n(resourceBundle, customText, "wallet.vp.login.howto.step1") %></li>
                                <li><%= i18n(resourceBundle, customText, "wallet.vp.login.howto.step2") %></li>
                                <li><%= i18n(resourceBundle, customText, "wallet.vp.login.howto.step3") %></li>
                                <li><%= i18n(resourceBundle, customText, "wallet.vp.login.howto.step4") %></li>
                            </ol>
                        </div>

                        <div class="ui divider hidden"></div>

                        <%-- Deep link for mobile --%>
                        <div id="deepLinkSection" class="text-center">
                            <p style="color: #888; font-size: 13px; margin-bottom: 10px;">
                                <%= i18n(resourceBundle, customText, "wallet.vp.login.mobile.cta") %>
                            </p>
                            <a id="walletLink" href="#" class="ui primary fluid large button">
                                <%= i18n(resourceBundle, customText, "wallet.vp.login.mobile.button") %>
                            </a>
                            <p id="deepLinkMsg" style="display: none; margin-top: 8px; color: #856404; font-size: 13px;"></p>
                        </div>

                    </div>
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

        <form id="authForm" style="display: none;" method="POST" action="<%=Encode.forHtmlAttribute(commonauthURLForWallet)%>">
            <input type="hidden" name="sessionDataKey"
                value='<%=Encode.forHtmlAttribute(sessionDataKey != null ? sessionDataKey : "")%>'>
            <input type="hidden" name="status" id="authStatus" value="">
            <input type="hidden" name="vp_request_id" id="authRequestId" value="">
        </form>

        <script type="text/javascript">
            var CONFIG = {
                sessionDataKey: '<%=sessionDataKey != null ? Encode.forJavaScript(sessionDataKey) : ""%>',
                pollToken: '<%=vpPollToken != null ? Encode.forJavaScript(vpPollToken) : ""%>',
                walletUrl: '<%=walletUrl != null ? Encode.forJavaScript(walletUrl) : ""%>',
                pollInterval: 2000,
                pollTimeout: 8000,
                pollEndpoint: '/openid4vp/v1/status?pollToken=<%=Encode.forUriComponent(vpPollToken != null ? vpPollToken : "")%>'
            };
            var I18N = {
                waiting:        '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.waiting"))%>',
                verified:       '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.verified"))%>',
                errorExpired:   '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.error.expired"))%>',
                errorNetwork:   '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.error.network"))%>',
                errorFailed:    '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.error.failed"))%>',
                errorGeneric:   '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.error.generic"))%>',
                mobileNoWallet: '<%=Encode.forJavaScript(i18n(resourceBundle, customText, "wallet.vp.login.mobile.no.wallet"))%>'
            };

            var pollTimer = null;
            var submitted = false;
            var pollInFlight = false;
            var networkErrorCount = 0;
            var MAX_NETWORK_ERRORS = 5;
            var currentController = null;
            var vpRequestId = '';

            // Initialize QR code
            function initQRCode() {
                var qrContainer = document.getElementById('qrcode');
                if (!qrContainer || !CONFIG.walletUrl) return;

                if (typeof QRCode === 'undefined') {
                    handleError('Unable to generate QR code. Please restart the login flow.');
                    return;
                }

                try {
                    new QRCode(qrContainer, {
                        text: CONFIG.walletUrl,
                        width: 250,
                        height: 250,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } catch (e) {
                    handleError('Unable to generate QR code. Please restart the login flow.');
                }
            }

            // Set up deep link
            function initDeepLink() {
                var walletLink = document.getElementById('walletLink');
                if (!walletLink || !CONFIG.walletUrl) return;

                walletLink.addEventListener('click', function(e) {
                    e.preventDefault();

                    var fallbackTimer = setTimeout(function() {
                        document.getElementById('deepLinkMsg').textContent = I18N.mobileNoWallet;
                        document.getElementById('deepLinkMsg').style.display = 'block';
                    }, 1500);

                    window.addEventListener('blur', function() {
                        clearTimeout(fallbackTimer);
                        document.getElementById('deepLinkMsg').style.display = 'none';
                    }, { once: true });

                    window.location.href = CONFIG.walletUrl;
                });
            }

            // Update status display — uses textContent for dynamic parts to avoid XSS
            function updateStatus(type, message) {
                var statusDiv = document.getElementById('status');
                statusDiv.innerHTML = '';

                var icon;
                var textSpan = document.createElement('span');
                textSpan.textContent = message;

                if (type === 'pending') {
                    icon = document.createElement('span');
                    icon.className = 'wallet-spinner';
                } else if (type === 'success') {
                    icon = document.createElement('i');
                    icon.className = 'check circle icon';
                    icon.style.color = '#28a745';
                    textSpan.style.color = '#28a745';
                } else if (type === 'error') {
                    icon = document.createElement('i');
                    icon.className = 'times circle icon';
                    icon.style.color = '#dc3545';
                    textSpan.style.color = '#dc3545';
                }

                if (icon) statusDiv.appendChild(icon);
                statusDiv.appendChild(textSpan);
            }

            // Schedule next poll using recursive setTimeout to avoid overlapping requests
            function schedulePoll() {
                pollTimer = setTimeout(pollStatus, CONFIG.pollInterval);
            }

            // Poll for VP status
            function pollStatus() {
                if (submitted || pollInFlight) return;

                pollInFlight = true;

                var controller = new AbortController();
                currentController = controller;
                var timeoutId = setTimeout(function() { controller.abort(); }, CONFIG.pollTimeout);

                fetch(CONFIG.pollEndpoint, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                })
                .then(function(response) {
                    clearTimeout(timeoutId);
                    var httpStatus = response.status;
                    return response.json().then(function(data) {
                        return { httpStatus: httpStatus, data: data };
                    });
                })
                .then(function(result) {
                    pollInFlight = false;
                    currentController = null;
                    networkErrorCount = 0;

                    var httpStatus = result.httpStatus;
                    var data = result.data;

                    // Non-200 responses are unexpected backend errors (servlet always
                    // returns 200 for the /status path; body is { error, error_description }).
                    if (httpStatus !== 200) {
                        handleError('Something went wrong. Please try again.');
                        return;
                    }

                    // HTTP 200 — body is { requestId, status: "ACTIVE"|"VERIFIED"|"FAILED"|"EXPIRED"|"NOT_FOUND" }
                    if (data.requestId) { vpRequestId = data.requestId; }
                    var status = data.status ? data.status.toUpperCase() : '';

                    if (status === 'ACTIVE') {
                        updateStatus('pending', I18N.waiting);
                        schedulePoll();
                    } else if (status === 'VERIFIED') {
                        if (!vpRequestId) {
                            handleError(I18N.errorGeneric);
                            return;
                        }
                        handleSuccess();
                    } else if (status === 'FAILED') {
                        handleFailed(null);
                    } else if (status === 'EXPIRED' || status === 'NOT_FOUND') {
                        handleFailed(I18N.errorExpired);
                    } else {
                        handleError(I18N.errorGeneric);
                    }
                })
                .catch(function(error) {
                    clearTimeout(timeoutId);
                    pollInFlight = false;
                    currentController = null;
                    var isAbort = error && error.name === 'AbortError';

                    if (isAbort) {
                        if (!submitted) schedulePoll();
                        return;
                    }
                    networkErrorCount++;
                    if (!submitted && networkErrorCount < MAX_NETWORK_ERRORS) {
                        schedulePoll();
                    } else if (!submitted) {
                        handleError(I18N.errorNetwork);
                    }
                });
            }

            // Handle successful verification
            function handleSuccess() {
                if (submitted) return;
                submitted = true;

                updateStatus('success', I18N.verified);

                setTimeout(function() {
                    document.getElementById('authStatus').value = 'success';
                    document.getElementById('authRequestId').value = vpRequestId;
                    document.getElementById('authForm').submit();
                }, 1000);
            }

            // Hide stale wallet content and show error state with back button.
            function showErrorState(reason) {
                document.getElementById('walletSubtitle').style.display = 'none';
                document.getElementById('qrcodeSection').style.display = 'none';
                document.getElementById('instructionsSection').style.display = 'none';
                document.getElementById('deepLinkSection').style.display = 'none';
                updateStatus('error', reason);
                document.getElementById('errorActions').style.display = 'block';
            }

            // Submit status=failed to commonauth — IS redirects to login page with all sign-in options.
            function goBackToSignIn() {
                document.getElementById('authStatus').value = 'failed';
                document.getElementById('authRequestId').value = vpRequestId;
                document.getElementById('authForm').submit();
            }

            // Handle terminal VP failure (FAILED / EXPIRED / NOT_FOUND).
            function handleFailed(message) {
                if (submitted) return;
                submitted = true;

                var reason = message || I18N.errorFailed;
                showErrorState(reason);
            }

            // Handle terminal errors (network failure, missing config) — stops polling, shows error.
            function handleError(message) {
                if (submitted) return;
                submitted = true;

                var reason = message || I18N.errorGeneric;
                showErrorState(reason);
            }

            // Cancel any in-flight poll when the user navigates away.
            window.addEventListener('pagehide', function() {
                submitted = true;
                if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
                if (currentController) { currentController.abort(); currentController = null; }
            });

            document.addEventListener('DOMContentLoaded', function() {
                
                if (!CONFIG.pollToken) {
                    handleError('Sign-in session is invalid. Please restart the login flow.');
                    return;
                }

                if (CONFIG.walletUrl) {
                    initQRCode();
                    initDeepLink();
                } else {
                    handleError('Unable to generate QR code. Please restart the login flow.');
                    return;
                }

                schedulePoll();
            });
        </script>
    </body>
</html>
