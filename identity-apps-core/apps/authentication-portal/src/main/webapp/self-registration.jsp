<%--
  ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.nio.file.Files, java.nio.file.Paths, java.io.IOException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.SelfRegistrationMgtClient" %>

<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<%@include file="includes/init-url.jsp" %>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>


<%
    String local = "en-US";
    String jsonFilePath = application.getRealPath("/i18n/translations/" + local + ".json");
    String translationsJson = "{}";
    
    try {
        byte[] jsonData = Files.readAllBytes(Paths.get(jsonFilePath));
        translationsJson = new String(jsonData, "UTF-8");
    } catch (IOException e) {
        e.printStackTrace();
    }
%>

<!DOCTYPE html>
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

    <link rel="preload" href="${pageContext.request.contextPath}/libs/react/react.production.min.js" as="script" />
    <link rel="preload" href="${pageContext.request.contextPath}/libs/react/react-dom.production.min.js" as="script" />
    <link rel="preload" href="${pageContext.request.contextPath}/js/react-ui-core.min.js" as="script" />
</head>
<body class="login-portal layout authentication-portal-layout">
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
          <div class="ui segment left aligned">
              <div id="react-root">
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

    <script src="${pageContext.request.contextPath}/libs/react/react.production.min.js"></script>
    <script src="${pageContext.request.contextPath}/libs/react/react-dom.production.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/react-ui-core.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof React === 'undefined') {
                console.error("React library is required for React components build.");
            } else if (typeof ReactDOM === 'undefined') {
                console.error("ReactDOM library is required for rendering components.");
            } else {
                const { createElement, Fragment, useEffect, useState } = React;
                const { DynamicContent, I18nProvider } = ReactUICore;

                const apiUrl = "${pageContext.request.contextPath}/util/self-registration-api.jsp";
                const locale = "en-US";
                const translations = <%= translationsJson %>;

                // Content component definition
                const Content = () => {
                    const [data, setData] = useState(null);
                    const [blocks, setBlocks] = useState([]);
                    const [elements, setElements] = useState([]);
                    const [loading, setLoading] = useState(true);
                    const [error, setError] = useState(null);
                    const [postBody, setPostBody] = useState(null);
                    const [formState, setFormState] = useState({});

                    // Define the action handler
                    const actionHandler = (action, formData) => {
                        setPostBody({
                            "flowId": data.flowId,
                            "action": action,
                            "userData": [
                                {
                                    "inputs": formData
                                }
                            ]
                        });
                    };

                    const formStateHandler = (name, value) => {
                        setFormState(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    };

                    useEffect(() => {
                        if (!postBody) {
                            setPostBody({
                                "applicationId": ""
                            });
                        }

                        fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(postBody)
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then((data) => {
                                setData(data);
                                setLoading(false);
                            })
                            .catch((error) => {
                                setError(error);
                                setLoading(false);
                            });
                    }, [postBody]);

                    useEffect(() => {
                        if (data) {
                            setBlocks(data.blocks || []);
                            setElements(data.elements || []);
                        }
                    }, [data]);

                    if (loading) {
                        return createElement('div', null, 'Loading...');
                    }

                    if (error) {
                        return createElement('div', null, `Error: ${error.message}`);
                    }

                    if (!elements || elements.length === 0) {
                        return createElement('div', null, 'No elements to render.');
                    }
        
                    return createElement(
                        Fragment,
                        null,
                        createElement(
                            DynamicContent,
                            {
                                content: {
                                    elements: elements,
                                    blocks: blocks,
                                },
                                handleRequestBody: actionHandler,
                            }
                        )
                    ); 
                };
                
                // Rendering the Content component into the DOM
                ReactDOM.render(
                    createElement(
                        I18nProvider,
                        { locale: locale, translationsObject: translations },
                        createElement(Content)
                    ),
                    document.getElementById('react-root')
                );
            }
        });
    </script>
</body>
</html>