<%--
 ~
 ~ Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="org.wso2.carbon.core.SameSiteCookie" %>
<%@ page import="org.wso2.carbon.identity.core.model.CookieBuilder" %>
<%@ page import="org.wso2.carbon.identity.core.model.IdentityCookieConfig" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>

<%!
    public void setCookie(HttpServletRequest req, HttpServletResponse resp, String cookieName, String value,
                                 Integer age, SameSiteCookie setSameSite, String path, String domain) {

        CookieBuilder cookieBuilder = new CookieBuilder(cookieName, value);
        IdentityCookieConfig cookieConfig = IdentityUtil.getIdentityCookieConfig(cookieName);
        if (cookieConfig != null) {
            updateCookieConfig(cookieBuilder, cookieConfig, age, path);
        } else {
            cookieBuilder.setSecure(true);
            cookieBuilder.setHttpOnly(true);
            cookieBuilder.setPath(StringUtils.isNotBlank(path) ? path : "/");
            cookieBuilder.setDomain(domain);
            cookieBuilder.setSameSite(setSameSite);
            if (age != null) {
                cookieBuilder.setMaxAge(age);
            }
        }
        resp.addCookie(cookieBuilder.build());
    }

    private void updateCookieConfig(CookieBuilder cookieBuilder, IdentityCookieConfig
                cookieConfig, Integer age, String path) {

        if (StringUtils.isNotBlank(cookieConfig.getDomain())) {
            cookieBuilder.setDomain(cookieConfig.getDomain());
        }

        if (StringUtils.isNotBlank(cookieConfig.getPath())) {
            cookieBuilder.setPath(cookieConfig.getPath());
        } else if (StringUtils.isNotBlank(path)) {
            cookieBuilder.setPath(path);
        }

        if (StringUtils.isNotBlank(cookieConfig.getComment())) {
            cookieBuilder.setComment(cookieConfig.getComment());
        }

        if (cookieConfig.getMaxAge() > 0) {
            cookieBuilder.setMaxAge(cookieConfig.getMaxAge());
        } else if (age != null) {
            cookieBuilder.setMaxAge(age);
        }

        if (cookieConfig.getVersion() > 0) {
            cookieBuilder.setVersion(cookieConfig.getVersion());
        }

        if (cookieConfig.getSameSite() != null) {
            cookieBuilder.setSameSite(cookieConfig.getSameSite());
        }

        cookieBuilder.setHttpOnly(cookieConfig.isHttpOnly());

        cookieBuilder.setSecure(cookieConfig.isSecure());
    }
%>
