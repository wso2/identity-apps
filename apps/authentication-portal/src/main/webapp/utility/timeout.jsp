<%--
  ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>

<%@ page import="static org.apache.commons.lang.StringUtils.isNotEmpty" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityTenantUtil.*" %>
<%@ page import="static org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil.*" %>
<%@ page import="static org.apache.commons.lang.StringUtils.isNotBlank" %>

<%--Include timeout JS functions--%>
<jsp:directive.include file="countdown.jsp"/>

<%--Include the reusable modal component--%>
<jsp:include page="utility/modal.jsp">
    <jsp:param name="title" value="Heads Up!"/>
    <jsp:param name="description"
               value="You have been in idle for too long. You will be redirected to the signup page soon."/>
    <jsp:param name="action_button_text" value="Start Over"/>
    <jsp:param name="cancel_button_text" value="Dismiss"/>
</jsp:include>

<%!

    /**
     * Parses the given attribute to a number. If the value is empty or
     * null, then it will fallback to the default value.
     *
     * @param attribute {ServletRequest} request attribute.
     * @param defaultValue default value.
     * @return parsed value or default value.
     */
    private int parseRequestAttributeToANumber(Object attribute, int defaultValue) {
        try {
            if (isNotBlank(attribute.toString())) {
                return Integer.parseInt(attribute.toString());
            }
        } catch (NumberFormatException | NullPointerException e) {
            // Ignore the error.
        }
        return defaultValue;
    }

%>

<%

    /*
     * These variables are the ones that passed on this timeout.jsp component via
     * request attributes. If the values are not present then default values are initialized.
     *
     * Pages that includes this directive will have a default timeout value of
     * 10 minutes and the timer will notify the user when there's 1 minute left. To change
     * this behaviour you can specify the {@code totalTimeoutMinutes} and {@code notifyOnMinute}
     * before including this file. For example:-
     *
     *  &lt;%
     *      request.setAttribute("totalTimeoutMinutes", 2);
     *      request.setAttribute("notifyOnMinute", 1);
     *  %&gt;
     *  &lt;%@ include file="utility/timeout.jsp" %&gt;
     */
    int totalTimeoutMinutes = parseRequestAttributeToANumber(request.getAttribute("totalTimeoutMinutes"), 10);
    int notifyOnMinute = parseRequestAttributeToANumber(request.getAttribute("notifyOnMinute"), 1);

    /*
     * Once re-initialized via context URL it will contain the login URL back to the service provider
     * to start over. If the access url is not configured for a particular application we will try to
     * send the user to root /. We have to do this until we mandate the `accessUrl` for apps.
     */
    String appAccessUrlEncoded = "/";

    try {

        String _serviceProvider = request.getParameter("sp");
        String _userTenantDomain = request.getParameter("ut");
        String _tenantDomain = getTenantDomainFromContext();
        ApplicationDataRetrievalClient _client = new ApplicationDataRetrievalClient();
        String _accessUrl = _client.getApplicationAccessURL(_tenantDomain, _serviceProvider);

        String url = replaceUserTenantHintPlaceholder(_accessUrl, _userTenantDomain);
        if (isNotEmpty(url)) {
            appAccessUrlEncoded = encodeURL(url);
        }

    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
    }

%>

<script>

    /**
     * This the props object that holds dynamic server side variables.
     * This will allow the script functions to access the variable
     * simply via a object.
     */
    const DYNAMIC_PROPS = {
        totalTimeoutMinutes: <%= totalTimeoutMinutes %>,
        notifyOnMinute: <%= notifyOnMinute %>
    };

    $(document).ready(function () {

        const timeout = Countdown.minutes(DYNAMIC_PROPS.totalTimeoutMinutes);
        const countdown = new Countdown(timeout, onDone, onTick);
        const modal = new ModalRef(function () {
            countdown.stop();
        });

        /**
         * This function will be called everytime when time ticks.
         *
         * @param time {{total: number, hours: number, seconds: number, minutes: number, days: number}}
         */
        function onTick(time) {
            if (time.total < Countdown.minutes(DYNAMIC_PROPS.notifyOnMinute)) {
                modal.changeDescriptionAsHTML(
                    "You have been in idle for too long. You will be redirected to " +
                    "the signup page <b>" + Countdown.timeToReadable(time) + "</b>.");
            }
            if (time.total === Countdown.minutes(DYNAMIC_PROPS.notifyOnMinute)) {
                modal.show();
            }
        }

        /**
         * Once the timer is finished, this method will be invoked to execute the target
         * action. It will redirect the user to the specified URL immediately.
         */
        function onDone() {
            window.location = "<%= appAccessUrlEncoded %>";
        }

        countdown.start();

    });

</script>
