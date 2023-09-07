<%--
 ~
 ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content.
 ~
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
<%@ page import="org.json.JSONArray" %>
<%@ page import="org.json.JSONObject" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");

    String scopeMetaData = request.getParameter("scopeMetadata");
    List<String> scopesWithMetadata = new ArrayList<>();
    Map<String,List<String>> scopeDetails = new TreeMap<>();

    if (scopeMetaData != null) {
        JSONArray scopeMetadataArray  = new JSONArray(scopeMetaData);

        for (int count = 0; count < scopeMetadataArray.length(); count++) {
            JSONObject jsonObj = (JSONObject) scopeMetadataArray.get(count);
            String key = (String) jsonObj.get("name");
            List<String> scopes = new ArrayList<>();
            JSONArray scopeArray = new JSONArray (jsonObj.get("scopes").toString());

            for (int scopeCount = 0; scopeCount < scopeArray.length(); scopeCount++) {
                JSONObject scope = (JSONObject) scopeArray.get(scopeCount);
                scopes.add((String) (scope.get("displayName")));
                scopesWithMetadata.add((String) scope.get("identifier"));
            }

            scopeDetails.put(key,scopes);
        }
    }

    boolean displayScopes = Boolean.parseBoolean(getServletContext().getInitParameter("displayScopes"));
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
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
</head>
<body class="login-portal layout authentication-portal-layout">

    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

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
                <form class="ui large form" action="<%=oauth2AuthorizeURL%>" method="post" id="profile"
                      name="oauth2_authz">
                      <div class="field light-font">
                        <div>
                            <h4 class="app-name-container">
                                <strong id="app-name"
                                        class="text-capitalize text-typography primary login-portal-app-font"
                                        data-content=<%=Encode.forHtml(request.getParameter("application"))%>>
                                    <%=Encode.forHtml(request.getParameter("application"))%>
                                </strong>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                            </h4>
                        </div>
                    </div>

                    <div class="field">
                        <%
                            if (displayScopes && (StringUtils.isNotBlank(scopeString) ||
                                CollectionUtils.isNotEmpty(scopesWithMetadata))) {

                                // Remove "openid" from the scope list to display.
                                List<String> openIdScopes = Stream.of(scopeString.split(" "))
                                        .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                                        .collect(Collectors.toList());

                                for (String scope : scopesWithMetadata) {
                                    if (openIdScopes.contains(scope)) {
                                        openIdScopes.remove(scope);
                                    }
                                }

                                if (CollectionUtils.isNotEmpty(openIdScopes) || CollectionUtils.isNotEmpty(scopesWithMetadata) ) {
                        %>
                        <div style="text-align: left;">
                            <h5><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h5>
                            <div class="claim-list ui list">
                                <%
                                    try {
                                        if (CollectionUtils.isNotEmpty(openIdScopes)) {
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
                                                        <i class="circle tiny icon primary consent-item-bullet"></i>
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
                                    }
                                    } catch (IdentityOAuth2ScopeException e) {
                                        // Ignore the error
                                    }

                                    // Unregistered scopes if exist, get the consent with provided scope name.
                                    if (CollectionUtils.isNotEmpty(openIdScopes)) {
                                        Map<String, List<String>> scopeMap = new TreeMap<>();
                                        for (String scope : openIdScopes) {
                                %>
                                                    <div class="item">
                                                        <i class="circle tiny icon primary consent-item-bullet"></i>
                                                        <div class="content">
                                                            <div class="header">
                                                                <%=Encode.forHtml(scope)%>
                                                            </div>
                                                        </div>
                                                    </div>
                                <%
                                        }
                                    }
                                    Set<Map.Entry<String, List<String>>> scopeEntries = scopeDetails.entrySet();
                                    if (CollectionUtils.isNotEmpty(scopeEntries)) {
                                        for (Map.Entry<String, List<String>> scopeEntry : scopeEntries) {
                                %>
                                        <div class="item mt-2">
                                            <i aria-hidden="true" class="circle tiny icon primary consent-item-bullet" id=("<%=scopeEntry.getKey()%>")></i>
                                            <div class="content mt-2">
                                                <div class="header light-font">
                                                    <%=Encode.forHtml(StringUtils.capitalize(scopeEntry.getKey()))%>
                                                </div>
                                            </div>
                                            <div class="content light-font">
                                                <div class="border-gray margin-bottom-double">
                                                    <div>
                                                        <div class="claim-list">
                                                            <% for (String permission : scopeEntry.getValue()) { %>
                                                                <div class="mt-1 pl-2">
                                                                    <div class="ui checkbox" style="display: flex">
                                                                        <i class="circle notch tiny icon primary consent-item-bullet" id=("<%=permission%>")></i>
                                                                        <span>
                                                                            <%=Encode.forHtml(permission)%>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            <% } %>
                                                        </div>
                                                    </div>
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

                        <div class="field mt-4 text-center login-portal-app-des-font">
                            <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "by.giving.consent.you.agree.to.share.data")%> <span class="break-all-words">
                                <%=Encode.forHtml(request.getParameter("application"))%></span>.
                            </p>
                        </div>

                        <div class="ui divider hidden"></div>

                    </div>
                    <div class="align-right buttons">
                        <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                            value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
                        <input type="hidden" name="consent" id="consent" value="deny"/>

                        <input class="ui large button secondary" type="reset"
                               onclick="deny(); return false;"
                               value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"deny")%>"/>
                        <input type="button" class="ui primary large button" id="approve" name="approve"
                               onclick="approved(); return false;"
                               value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"allow")%> "/>
                    </div>
                </form>
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
    </layout:main>

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

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
        <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
        <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">

        function approved() {
            var isApproveAlwaysChecked = $("#rememberApproval").is(':checked');
            document.getElementById('consent').value = "approveAlways";

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
