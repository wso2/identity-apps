<%--
  ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page import="java.io.File" %>

<%
    File typingdnaRecorder = new File(getServletContext().getRealPath("js/typingdna.js"));
    if (typingdnaRecorder.exists()) {
%>
	<script src="${pageContext.request.contextPath}/js/typingdna.js"></script>
<% } else {
%>
	<script src="https://www.typingdna.com/scripts/typingdna.js"></script>
<% } %>

<script>
    var typingdna = new TypingDNA();
    typingdna.addTarget("username");
    typingdna.addTarget("password");

    $(document).ready(function(){
        document.getElementById("loginForm").addEventListener("submit",getTypingPatterns);
        document.getElementById("username").setAttribute("autocomplete", "off");
    });

    function getTypingPatterns() {

        var typingPatternValue = typingdna.getTypingPattern({type:1});
        // Adding a new field to login form.
        var typingPattern = document.createElement("input");
        typingPattern.setAttribute("type", "hidden");
        typingPattern.setAttribute("name", "typingPattern");
        typingPattern.setAttribute("id", "typingPattern");
        typingPattern.setAttribute("value", typingPatternValue);
        document.getElementById("loginForm").append(typingPattern);

        return true;
    }
</script>
