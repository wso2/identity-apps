<%--
 ~
 ~ Copyright (c) 2021, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.util.logging.Logger" %>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<div class="tracking-reference-container ${ param.align }" >
    <label class="tracking-reference-label"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "tracking.reference.id")%></label>
    <div class="ui action right labeled input tracking-reference-input">
        <input id="tracking-reference" readonly="" type="text">
        <button id="ref-copy-button" type="button" class="ui icon button" onclick="copyValueToClipboard()">
            <i aria-hidden="true" class="copy icon"></i>
        </button>
    </div>
</div>

<%-- Resolve the tracking ref from the request --%>
<%
    String trackingRef = request.getParameter("crId");
    String logError = request.getParameter("logError");
    String error = request.getParameter("error");
    String errorCode = request.getParameter("errorCode");

    if (trackingRef == null) {
        String trackingRefs = request.getHeader("X-Azure-Ref");
        // Display only the first ref if there are multiple refs
        if (trackingRefs != null) {
            trackingRef = trackingRefs.split(",")[0];
        }
    }

    // Log the captured error to BE log is only enabled
    if (Boolean.parseBoolean(logError)) {
        Logger logger = Logger.getLogger("Error Tracking Ref");
        logger.warning( "[Ref: " + trackingRef + "] " + errorCode + " - " + error );
    }
%>

<script>
    const trackingRefInput = document.getElementById("tracking-reference");
    
    // set tracking reference input element's value
    trackingRefInput.value = "<%=trackingRef%>";

    // copy tracking reference input element's value to the clipboard
    function copyValueToClipboard() {
        navigator.clipboard.writeText(trackingRefInput.value);
        const copyBtn = document.getElementById("ref-copy-button")

        copyBtn.setAttribute("data-tooltip", "<%=AuthenticationEndpointUtil.i18n(resourceBundle, "copied")%>");
        copyBtn.setAttribute("data-inverted", "");
        copyBtn.setAttribute("data-variation", "tiny");

        setTimeout(() => {
            ["data-tooltip", "data-inverted", "data-variation"].forEach(attr => {
                copyBtn.removeAttribute(attr);
            });
        }, 1200)
    }
</script>
