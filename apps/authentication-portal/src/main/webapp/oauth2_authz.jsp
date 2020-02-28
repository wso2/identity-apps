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
<%@ page import="org.wso2.carbon.identity.oauth2.OAuth2ScopeService" %>
<%@ page import="org.wso2.carbon.identity.oauth2.bean.Scope" %>
<%@ page import="org.wso2.carbon.identity.oauth2.IdentityOAuth2ScopeException" %>
<%@ page import="org.wso2.carbon.identity.oauth.dto.ScopeDTO" %>
<%@ page import="org.wso2.carbon.identity.oauth.IdentityOAuthAdminException" %>
<%@ page import="org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Set" %>

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
                <form class="ui large form" action="<%=oauth2AuthorizeURL%>" method="post" id="profile"
                      name="oauth2_authz">
                    <h4><%=Encode.forHtml(request.getParameter("application"))%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>:</h4>
        
                    <div class="field"> 
                        <%
                            if (displayScopes && StringUtils.isNotBlank(scopeString)) {
                                // Remove "openid" from the scope list to display.
                                List<String> openIdScopes = Stream.of(scopeString.split(" "))
                                        .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                                        .collect(Collectors.toList());
    
                                if (CollectionUtils.isNotEmpty(openIdScopes)) {
                        %>
                        <div class="ui segment" style="text-align: left;">
                            <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h5>
                            <div class="scopes-list ui list">
                                <%
                                    try {
                                        String scopesAsString = String.join(" ", openIdScopes);
                                        Set<Scope> scopes = new OAuth2ScopeService().getScopes(null, null,
                                                true, scopesAsString);
        
                                        for (Scope scope : scopes) {
                                            String displayName = scope.getDisplayName();
                                            String description = scope.getDescription();
                                            openIdScopes.remove(scope.getName());
            
                                            if (displayName != null) {
                                %>
                                <div class="item">
                                    <i class="check circle outline icon"></i>
                                    <div class="content">
                                        <div class="header">
                                            <%=Encode.forHtml(displayName)%>
                                        </div>
                                        <% if (description != null) { %>
                                        <div class="description">
                                            <%=Encode.forHtml(description)%>
                                        </div>
                                        <% } %>
                                    </div>
                                </div>
                                <%
                                            }
                                        }
                                    } catch (IdentityOAuth2ScopeException e) {
                                        // Ignore the error
                                    }
        
                                    // Unregistered scopes if exist, get the consent with provided scope name.
                                    if (CollectionUtils.isNotEmpty(openIdScopes)) {
                                        for (String scope : openIdScopes) {
                                %>
                                <div class="item">
                                    <i class="check circle outline icon"></i>
                                    <div class="content">
                                        <div class="header">
                                            <%=Encode.forHtml(scope)%>
                                        </div>
                                    </div>
                                </div>
                                <%
                                        }
                                    }
                                %>
                            </div>
                        </div>

                        <%
                                }
                            }
                        %>
            
                        <div class="ui divider hidden"></div>
            
                        <div style="text-align: left;">
                            <div class="ui form">
                                <div class="grouped fields">
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" class="hidden" name="scope-approval" id="approveCb"
                                                   value="approve" checked>
                                            <label for="approveCb"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "approve.once")%></label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="ui radio checkbox">
                                            <input type="radio" class="hidden" name="scope-approval" id="approveAlwaysCb" value="approveAlways">
                                            <label for="approveAlwaysCb"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "approve.always")%></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="align-right buttons">
                        <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                            value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                        <input type="hidden" name="consent" id="consent" value="deny"/>
            
                        <input class="ui large button link-button" type="reset"
                               onclick="deny(); return false;"
                               value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>"/>
                        <input type="button" class="ui primary large button" id="approve" name="approve"
                               onclick="approved(); return false;"
                               value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"continue")%> "/>
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
