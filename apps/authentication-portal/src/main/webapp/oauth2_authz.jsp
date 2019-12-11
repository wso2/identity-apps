<%--
  ~ Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ page import="java.io.File" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");
    boolean displayScopes = Boolean.parseBoolean(getServletContext().getInitParameter("displayScopes"));
%>

<!doctype html>
<html>
<head>
    <!-- header -->
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
        if (headerFile.exists()) {
    %>
        <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/header.jsp"/>
    <% } %>
</head>
<body>
    <main class="center-segment">
        <div class="ui container medium center aligned middle aligned">

            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
                <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
                <jsp:directive.include file="includes/product-title.jsp"/>
            <% } %>

            <div class="ui segment">
                <h3 class="ui header">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "authorize")%>
                </h3>

                <form action="<%=oauth2AuthorizeURL%>" method="post" id="profile" name="oauth2_authz" class="segment-form">
                    <% if (loginFailed) { %>
                        <div class="ui visible warning message">
                            <strong><%=Encode.forHtml(request.getParameter("application"))%></strong>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                        </div>
                    <% } %>

                    <div class="field"> 
                        <%
                            if (displayScopes && StringUtils.isNotBlank(scopeString)) {
                                // Remove "openid" from the scope list to display.
                                List<String> openIdScopes = Stream.of(scopeString.split(" "))
                                        .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                                        .collect(Collectors.toList());
    
                                if (CollectionUtils.isNotEmpty(openIdScopes)) {
                        %>

                        <div class="ui segment" style="text-align: left;"></div>
                            <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h5>
                            <div class="scopes-list ui list">
                                <%
                                    for (String scopeID : openIdScopes) {
                                %>
                                <div class="item">
                                    <i class="check circle outline icon"></i>
                                    <div class="content">
                                        <%=Encode.forHtml(scopeID)%>
                                    </div>
                                </div>
                                <%
                                    }
                                %>
                            </div>
                        </div>

                        <%
                                }
                            }
                        %>

                        <div class="ui secondary segment" style="text-align: left;">
                            <div class="ui form">
                                <div class="grouped fields">
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" class="hidden" name="scope-approval" id="approveCb" value="approve">
                                            <label for="approveCb">Approve Once</label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" class="hidden" name="scope-approval" id="approveAlwaysCb" value="approveAlways">
                                            <label for="approveAlwaysCb">Approve Always</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div class="buttons right aligned">
                        <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                            value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                        <input type="hidden" name="consent" id="consent" value="deny"/>
                        
                        <input type="button" class="btn  btn-primary" id="approve" name="approve"
                                onclick="approved(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"continue")%>"/>
                        <input class="btn" type="reset"
                                onclick="deny(); return false;"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"deny")%>"/>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <div class="ui modal mini" id="modal_claim_validation" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
        <div class="header">
            <h4 class="modal-title"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h4>
        </div>
        <div class="content">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.select.approve.always")%>
        </div>
        <div class="actions">
            <button type="button" class="ui primary button"  onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>

    <!-- product-footer -->
    <%
        File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
        if (productFooterFile.exists()) {
    %>
        <jsp:include page="extensions/product-footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/product-footer.jsp"/>
    <% } %>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:directive.include file="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">

        function approved() {
            var scopeApproval = $("input[name='scope-approval']");
    
            // If scope approval radio button is rendered then we need to validate that it's checked
            if (scopeApproval.length > 0) {
                if (scopeApproval.is(":checked")) {
                    var checkScopeConsent = $("input[name='scope-approval']:checked");
                    $('#consent').val(checkScopeConsent.val());
                } else {
                    $("#modal_scope_validation").modal('show');
                    return;
                }
            }
    
            document.getElementById("profile").submit();
        }

        function hideModal(elem) {
            $(elem).closest('.modal').modal('hide');
        }
        
        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("profile").submit();
        }
    
    </script>

</body>
</html>
