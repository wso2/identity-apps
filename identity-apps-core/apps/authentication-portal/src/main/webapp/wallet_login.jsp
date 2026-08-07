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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String sessionDataKey = request.getParameter("sessionDataKey");
    String walletUrl = request.getParameter("walletUrl");
    String vpTenantDomain = request.getParameter("tenantDomain");
    String vpOrgId = request.getParameter("orgId");
    String vpRootTenantDomain = request.getParameter("rootTenantDomain");

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

        <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>

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
                        Sign in with Digital Wallet
                    </h3>
                    <p class="text-center" style="color: #666; font-size: 14px;">
                        Scan the QR code below with your digital wallet to verify your identity
                    </p>
                    <div class="ui divider hidden"></div>

                    <div class="segment-form">
                        <%-- QR Code --%>
                        <div class="field text-center">
                            <div id="qrcode"></div>
                        </div>

                        <%-- Status --%>
                        <div class="ui divider hidden"></div>
                        <div class="text-center" id="statusContainer">
                            <div id="status">
                                <span class="wallet-spinner"></span>
                                <span>Waiting for wallet...</span>
                            </div>
                        </div>

                        <div class="ui divider hidden"></div>

                        <%-- Instructions --%>
                        <div class="ui info message">
                            <div class="header" style="font-size: 14px; margin-bottom: 10px;">
                                How to sign in
                            </div>
                            <ol class="wallet-steps">
                                <li>Open your digital wallet app (Inji, etc.)</li>
                                <li>Scan the QR code above</li>
                                <li>Review the credential request</li>
                                <li>Approve to share your credentials</li>
                            </ol>
                        </div>

                        <div class="ui divider hidden"></div>

                        <%-- Deep link for mobile --%>
                        <div class="text-center">
                            <p style="color: #888; font-size: 13px; margin-bottom: 10px;">
                                Or tap below if you're on mobile:
                            </p>
                            <a id="walletLink" href="#" class="ui primary fluid large button">
                                Open in Wallet
                            </a>
                        </div>

                        <%-- Error container --%>
                        <div id="errorContainer" class="ui negative message" style="display: none;">
                            <div class="header">Authentication Failed</div>
                            <p id="errorMessage">An error occurred during verification.</p>
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
                walletUrl: '<%=walletUrl != null ? Encode.forJavaScript(walletUrl) : ""%>',
                pollInterval: 2000,
                pollTimeout: 8000,
                pollEndpoint: '/oid4vp/v1/request/<%=Encode.forUriComponent(sessionDataKey != null ? sessionDataKey : "")%>/status'
            };

            var pollTimer = null;
            var submitted = false;
            var pollInFlight = false;
            var networkErrorCount = 0;
            var MAX_NETWORK_ERRORS = 5;

            function logDebugDetails(stage, details) {
                console.log('[OpenID4VP][wallet_login.jsp][' + stage + ']', details || {});
            }

            // Initialize QR code
            function initQRCode() {
                var qrContainer = document.getElementById('qrcode');
                if (!qrContainer || !CONFIG.walletUrl) return;

                if (typeof QRCode === 'undefined') {
                    qrContainer.textContent = 'QR code library failed to load. Please refresh the page.';
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
                    qrContainer.textContent = 'Failed to generate QR code. Please use the link below.';
                }
            }

            // Set up deep link
            function initDeepLink() {
                var walletLink = document.getElementById('walletLink');
                if (walletLink && CONFIG.walletUrl) {
                    walletLink.href = CONFIG.walletUrl;
                }
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
                logDebugDetails('poll-request', { endpoint: CONFIG.pollEndpoint });

                var controller = new AbortController();
                var timeoutId = setTimeout(function() { controller.abort(); }, CONFIG.pollTimeout);

                fetch(CONFIG.pollEndpoint, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    clearTimeout(timeoutId);
                    pollInFlight = false;
                    networkErrorCount = 0;
                    logDebugDetails('poll-response', data);

                    var status = data.status ? data.status.toUpperCase() : '';

                    if (status === 'ACTIVE') {
                        updateStatus('pending', 'Waiting for wallet...');
                        schedulePoll();
                    } else if (status === 'VERIFIED') {
                        handleSuccess();
                    } else if (status === 'FAILED') {
                        handleFailed(data.message || null);
                    } else if (status === 'EXPIRED') {
                        handleFailed('The QR code has expired. Please try again.');
                    } else if (status === 'NOT_FOUND') {
                        handleError('The authentication session could not be found. Please restart the login flow.');
                    } else if (status === 'ERROR' || status === '') {
                        handleError(data.message || 'Verification failed. Please try again.');
                    } else {
                        handleError('Unexpected status: ' + status);
                    }
                })
                .catch(function(error) {
                    clearTimeout(timeoutId);
                    pollInFlight = false;
                    var isAbort = error && error.name === 'AbortError';
                    logDebugDetails('poll-error', { message: isAbort ? 'request timed out' : (error && error.message) });
                    networkErrorCount++;
                    if (!submitted && networkErrorCount < MAX_NETWORK_ERRORS) {
                        schedulePoll();
                    } else if (!submitted) {
                        handleError('Unable to reach the server. Please check your connection and try again.');
                    }
                });
            }

            // Handle successful verification
            function handleSuccess() {
                if (submitted) return;
                submitted = true;

                updateStatus('success', 'Credentials verified. Completing authentication...');

                setTimeout(function() {
                    document.getElementById('authStatus').value = 'success';
                    document.getElementById('authRequestId').value = CONFIG.sessionDataKey;
                    logDebugDetails('auth-submit', { status: 'success', sessionDataKey: CONFIG.sessionDataKey });
                    document.getElementById('authForm').submit();
                }, 1000);
            }

            // Handle terminal failure — shows reason then submits status=failed after a short delay.
            function handleFailed(message) {
                if (submitted) return;
                submitted = true;

                var reason = message || 'The wallet rejected the credential request or verification failed.';
                updateStatus('error', reason);

                document.getElementById('errorMessage').textContent = reason;
                document.getElementById('errorContainer').style.display = 'block';

                setTimeout(function() {
                    document.getElementById('authStatus').value = 'failed';
                    document.getElementById('authRequestId').value = CONFIG.sessionDataKey;
                    document.getElementById('authForm').submit();
                }, 3000);
            }

            // Handle terminal errors (session not found, network error) — stops polling, shows error.
            function handleError(message) {
                if (submitted) return;
                submitted = true;

                var reason = message || 'An error occurred during verification.';
                updateStatus('error', reason);

                document.getElementById('errorMessage').textContent = reason;
                document.getElementById('errorContainer').style.display = 'block';
            }

            // Initialize
            document.addEventListener('DOMContentLoaded', function() {
                logDebugDetails('init-config', {
                    sessionDataKey: CONFIG.sessionDataKey,
                    walletUrl: CONFIG.walletUrl,
                    pollEndpoint: CONFIG.pollEndpoint
                });

                if (!CONFIG.sessionDataKey) {
                    handleError('Missing session key. Please restart the login flow.');
                    return;
                }

                if (CONFIG.walletUrl) {
                    initQRCode();
                    initDeepLink();
                } else {
                    handleError('Missing wallet URL for QR generation.');
                    return;
                }

                schedulePoll();
            });
        </script>
    </body>
</html>
