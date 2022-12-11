<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="java.util.ResourceBundle" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EncodedControl" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page contentType="text/html; charset=UTF-8"%>

<%
    String lang = "en_US"; // Default lang is en_US
    String COOKIE_NAME = "ui_lang";
    Locale userLocale = null;
    Locale browserLocale = request.getLocale();
    String uiLocaleFromURL = request.getParameter("ui_locales");
    String localeFromCookie = null;

    // Check cookie for the user selected language first
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(COOKIE_NAME)) {
                localeFromCookie = cookie.getValue();
            }
        }
    }

    // Set lang from the priority order
    if (localeFromCookie != null) {
        lang = localeFromCookie;
    } else if (uiLocaleFromURL != null) {
        lang = uiLocaleFromURL.split(" ")[0];
    }

    if (!lang.trim().equals("")) {
        try {
            // In case cookie have a language defined
            String langStr = lang.split("_")[0];
            String langLocale = lang.split("_")[1];

            // Creating a new locale using the cookie value
            Locale cookieLocale = new Locale(langStr, langLocale);
            userLocale = cookieLocale;
        } catch (Exception e) {
            // In case the language is defined but not in the correct format
            userLocale = browserLocale;
        }
    } else {
        userLocale = browserLocale;
    }

    String BUNDLE = "org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources";

    ResourceBundle resourceBundle = ResourceBundle.getBundle(BUNDLE, userLocale, new
        EncodedControl(StandardCharsets.UTF_8.toString()));
%>
