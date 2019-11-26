<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ tag description="Login Wrapper" pageEncoding="UTF-8"%>
    
<%@ attribute name="footerContent" fragment="true" required="false" %>

<div class="login-form">
    <div class="ui center aligned middle aligned grid" style="height: 100%;">
        <div class="column" style="max-width: 450px;">
            <div class="ui segment">
                <jsp:doBody />  
            </div>
        </div>
    </div>
    
    <jsp:invoke fragment="footerContent" />
</div>
