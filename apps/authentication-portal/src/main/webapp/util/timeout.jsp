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

<%@ page import="java.net.MalformedURLException" %>

<%--Include timeout JS functions--%>
<jsp:include page="countdown.jsp"/>

<%--Include the reusable modal component--%>
<%
    String description = "You have been idle in this page for too long. For security reasons," +
        "you need to start over or you will be redirected to the sign-in page";
%>
<jsp:include page="modal.jsp">
    <jsp:param name="title" value="This sign-in instance is about to timeout!"/>
    <jsp:param
            name="description"
            value="<%=description%>"/>
    <jsp:param name="action_button_text" value="Start over"/>
    <jsp:param name="cancel_button_text" value="Dismiss"/>
</jsp:include>

<%!
    /**
     * Parses the given attribute to a number. If the value is empty or
     * null, then it will fallback to the default value.
     *
     * @param attribute {@link Object} request attribute.
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

<%!
    /**
     * Parses the given attribute to a String.
     *
     * @param attribute {@link Object} request attribute
     * @param defaultValue {@link String} default value substitution for attribute
     * @return parsed value or default value.
     */
    private String parseRequestAttributeToAString(Object attribute, String defaultValue) {
        try {
            return attribute.toString();
        } catch (NumberFormatException | NullPointerException e) {
            return defaultValue;
        }
    }
%>

<%

    /**
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
     *      request.setAttribute("pageName", "login");
     *  %&gt;
     *  &lt;%@ include file="utility/timeout.jsp" %&gt;
     *
     * Why "this" as a default value for {@code pageName} ?
     * It's serves a default value for the description in the modal. Check the method
     * {@code modal.changeDescriptionAsHTML} in script.
     */
    int totalTimeoutMinutes = parseRequestAttributeToANumber(request.getAttribute("totalTimeoutMinutes"), 35);
    int notifyOnMinute = parseRequestAttributeToANumber(request.getAttribute("notifyOnMinute"), 2);
    String pageName = parseRequestAttributeToAString(request.getAttribute("pageName"), "this");

    /*
     * Once re-initialized via context URL it will contain the login URL back to the service provider
     * to start over. If the access url is not configured for a particular application we will try to
     * send the user to root /. We have to do this until we mandate the `accessUrl` for apps.
     */
    String appAccessUrlEncoded = "";

    try {

        String _serviceProvider = request.getParameter("sp");
        String _userTenantDomain = request.getParameter("t");
        String _tenantDomain = getTenantDomainFromContext();
        ApplicationDataRetrievalClient _client = new ApplicationDataRetrievalClient();
        String _accessUrl = _client.getApplicationAccessURL(_tenantDomain, _serviceProvider);

        String url = replaceUserTenantHintPlaceholder(_accessUrl, _userTenantDomain);
        if (isNotEmpty(url)) {
            appAccessUrlEncoded = encodeURL(url);
        }

    } catch (ApplicationDataRetrievalClientException | MalformedURLException e) {
        // Ignored and fallback to login page url.
    }

%>

<script>

    /**
     * This the props object that holds dynamic server side variables.
     * This will allow the script functions to access the variable
     * simply via a object.
     */
    const PROPS = {
        totalTimeoutMinutes: <%= totalTimeoutMinutes %>,
        notifyOnMinute: <%= notifyOnMinute %>,
        appAccessUrlEncoded: "<%= appAccessUrlEncoded %>",
        pageName: "<%= pageName %>",
        showModal: <%= isNotEmpty(appAccessUrlEncoded) %>
    };

    if(PROPS.showModal) {
        $(document).ready(function () {

            const SPACE_CHAR = " ";
            const timeout = Countdown.minutes(PROPS.totalTimeoutMinutes);
            const countdown = new Countdown(timeout, onDone, onTick);

            const modal = new ModalRef(function (/*Modal onAction*/) {
                // Once the modal action button clicked, the user will be redirected
                // to the specified URL immediately. If the url is not available then
                // it will not redirect or do anything.
                if (PROPS.appAccessUrlEncoded) {
                    window.location = PROPS.appAccessUrlEncoded;
                }
            });

            /**
             * This function will be called everytime when time ticks.
             *
             * @param time {{total: number, hours: number, seconds: number, minutes: number, days: number}}
             */
            function onTick(time) {
                if (time.total < Countdown.minutes(PROPS.notifyOnMinute)) {
                    modal.changeDescriptionAsHTML(
                    "You have been idle in" + SPACE_CHAR + PROPS.pageName + SPACE_CHAR +
                    "page for too long. For security reasons, you need to start over or you will be redirected " +
                    "to the sign-in page"  + SPACE_CHAR + "<b>" + Countdown.timeToReadable(time) + "</b>."
                    );
                }
                if (time.total === Countdown.minutes(PROPS.notifyOnMinute)) {
                    modal.show();
                }
            }

            /**
             * Once the timer is finished, this method will be
             * invoked to execute the target action.
             */
            function onDone() {
                // Once the countdown is over, the user will be redirected
                // to the access URL immediately.
                window.location = PROPS.appAccessUrlEncoded;
            }

            countdown.start();
        });
    }

</script>
