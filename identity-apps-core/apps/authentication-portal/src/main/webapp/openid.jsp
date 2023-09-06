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

<%@ page import="org.owasp.encoder.Encode" %>

<form action="<%=commonauthURL%>" method="post" id="loginForm" class="segment-form">
    <%
        loginFailed = request.getParameter("loginFailed");
        if (loginFailed != null) {

    %>
    <div class="ui visible negative message">
         <%=AuthenticationEndpointUtil.i18nBase64(resourceBundle,request.getParameter("errorMessage"))%>
    </div>
    <% } %>

    <div class="field">
        <input type="text" id="claimed_id" name="claimed_id" size='30'
               placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "openid")%>"/>
        <input type="hidden" name="sessionDataKey"
               value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
    </div>

    <div class="field">
        <div class="ui checkbox">
            <input type="checkbox" id="chkRemember" name="chkRemember">
            <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.me")%></label>
        </div>
    </div>

    <div class="buttons right aligned">
        <button
            class="ui primary large button"
            type="submit">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login")%>
        </button>
    </div>
</form>

<script>

    // Handle form submission preventing double submission.
    $(document).ready(function(){
        $.fn.preventDoubleSubmission = function() {
            $(this).on('submit',function(e){
                var $form = $(this);
                if ($form.data('submitted') === true) {
                    // Previously submitted - don't submit again.
                    e.preventDefault();
                    console.warn("Prevented a possible double submit event");
                } else {
                    // Mark it so that the next submit can be ignored.
                    $form.data('submitted', true);
                }
            });

            return this;
        };
        $('#loginForm').preventDoubleSubmission();
    });

</script>
