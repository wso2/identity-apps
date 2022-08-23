<%--
  ~ Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
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

<!-- localize.jsp MUST already be included in the calling script -->

<!-- page content -->
<div class="ui grid">
    <div class="two column row"></div>
        <div class="four wide computer four wide tablet column">
            <div id="toc" class="ui segment toc"></div>
        </div>
        <div class="twelve wide computer twelve wide tablet column">
            <!-- content -->
            <div>
                <div>
                    <h1>
                        <jsp:directive.include file="product-name.jsp"/> - Cookie Policy
                    </h1>
                </div>
                <div>
                    <%-- Customizable content. Due to this nature, i18n is not implemented for this section --%>
                    <div id="cookiePolicy">
                        <div class="ui divider hidden"></div>
                        <h4><a href="https://wso2.com/ciam-suite/private-ciam-cloud/b2b-ciam/">About <jsp:directive.include file="product-name.jsp"/></a></h4>
                        <p><jsp:directive.include file="product-name.jsp"/> (&ldquo;WSO2 PCC&ldquo;) is a dedicated cloud offering owned by WSO2 and licensed to you under the WSO2 subscription agreement or if applicable, any other license specified at the time of accessing the software. </p>

                        <p><strong>Scope: </strong>This cookie policy is applicable only for the cookies used by the Management Console of WSO2 PCC and its IS functionalities.</p>
                        
                        <h2 id="cookie-policy">Cookie Policy</h2>
                        <p>WSO2  PCC uses cookies so that it can provide the best user experience for you and identify you for security purposes. If you disable cookies, some of the services will (most probably) be inaccessible to you. </p>

                        <h2 id="how-wso2-is-5.8.0-processes-cookies">How does WSO2 PCC process cookies?</h2>
                        <p>WSO2 PCC stores and retrieves information on your browser using cookies. This information is used to provide a better experience. Some cookies serve the primary purposes of allowing a user to log in to the system, maintaining sessions, and keeping track of activities you do within the login session.</p>
                        <p>The primary purpose of some cookies used in WSO2 PCC is to personally identify you as this is the main function of the <jsp:directive.include file="product-name.jsp"/>. However the cookie lifetime ends once your session ends i.e., after you log-out, or after the session expiry time has elapsed.</p>
                        <p>Some cookies are simply used to give you a more personalized web experience and these cookies can not be used to personally identify you or your activities.</p>
                        <p>This cookie policy is part of the <a href="privacy_policy.do"> WSO2 PCC Privacy Policy.</a></p>

                        <h2 id="what-is-a-cookie">What is a cookie?</h2>
                        <p>A browser cookie is a small piece of data that is stored on your device to help websites and mobile apps remember things about you. Other technologies, including web storage and identifiers associated with your device, may be used for similar purposes. In this policy, we use the term &ldquo;cookies&rdquo; to discuss all of these technologies.</p>

                        <h2 id="what-does-wso2-is-5.8.0-use-cookies-for">What does WSO2 PCC use cookies for?</h2>
                        <p>Cookies are used for two purposes in WSO2 PCC.</p>
                        <ol>
                            <li>To identify you and provide security (as this is the main function of WSO2 PCC).</li>
                            <li>To provide a satisfying user experience.</li>
                        </ol>

                        <p>These are explained in more detail below.</p>

                        <h3 id="preferences">Preferences</h3>
                        <p>WSO2 PCC uses these cookies to remember your settings and preferences, and to auto-fill the form fields to make your interactions with the site easier.</p>
                        <p>These cookies can not be used to personally identify you.</p>
                        <h3 id="security">Security</h3>
                        <ul>
                            <li>WSO2 PCC uses selected cookies to identify and prevent security risks.
                                For example, WSO2 PCC may use these cookies to store your session information in order
                                to prevent others from changing your password without your username and password.<br><br>
                            </li>
                            <li>WSO2 PCC uses session cookies to maintain your active session.<br><br></li>
                            <li>WSO2 PCC may use temporary cookies when performing multi-factor authentication 
                                and federated authentication.<br><br>
                            </li>
                            <li>WSO2 PCC may use permanent cookies to detect that you have previously used the same
                                device to log in. This is to to calculate the &ldquo;risk level&rdquo; associated
                                with your current login attempt. This is primarily to protect you and your account
                                from possible attack.
                            </li>
                        </ul>
                        <h3 id="performance">Performance</h3>
                        <p>WSO2 PCC may use cookies to allow &ldquo;Remember Me&rdquo; functionalities.</p>

                        <h3 id="analytics">Analytics</h3>
                        <p>WSO2 PCC as a product does not use cookies for analytical purposes.</p>

                        <h3 id="third-party-cookies">Third party cookies</h3>
                        <p>WSO2 PCC does not set third party cookies by default.</p>
                        <p>However, if you federate WSO2 PCC with a 3rd party identity provider of your preference, it may set some third-party cookies. WSO2 PCC has no control over how these third party cookies are operated. WSO2 strongly advises you to refer to the respective cookie policy of such service providers carefully.</p>

                        <h2 id="what-type-of-cookies-does-5.8.0-use">What type of cookies does WSO2 PCC use?</h2>
                        <p>WSO2 PCC uses persistent cookies and session cookies.</p>
                        <p>A persistent cookie helps WSO2 PCC to recognize you as an existing user so that it is easier to return to WSO2 or interact with WSO2 PCC without signing in again. After you sign in, a persistent cookie stays in your browser and will be read by WSO2 PCC when you return to WSO2 PCC.</p>
                        <p>A session cookie is a cookie that is erased when the user closes the web browser. The session cookie is stored in temporary memory and is not retained after the browser is closed. Session cookies do not collect information from the user's computer.</p>

                        <h2 id="how-do-i-control-my-cookies">How do I control my cookies?</h2>
                        <p>Most browsers allow you to control cookies through their settings preferences. However, if you limit the given ability for websites to set cookies, you may worsen your overall user experience since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.</p>
                        <p>Most likely, disabling cookies will make you unable to use authentication and authorization functionalities offered by WSO2 PCC.</p>

                        <h2 id="what-are-the-cookies-used">What are the cookies used?</h2>
                        <table class="ui celled table">
                            <thead>
                                <tr>
                                    <th>
                                        <p>Cookie Name</p>
                                    </th>
                                    <th>
                                        <p>Purpose</p>
                                    </th>
                                    <th>
                                        <p>Retention</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>JSESSIONID</p>
                                    </td>
                                    <td>
                                        <p>To keep your session data in order to give you a good user experience.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>MSGnnnnnnnnnn</p>
                                    </td>
                                    <td>
                                        <p>To keep some messages that are shown to you in order to give you a good user experience.</p>
                                        <p>The &ldquo;nnnnnnnnnn&rdquo; reference in this cookie represents a random number e.g., MSG324935932.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>requestedURI</p>
                                    </td>
                                    <td>
                                        <p>The URI you are accessing.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>current-breadcrumb</p>
                                    </td>
                                    <td>
                                        <p>To keep your active page in session in order to give you a good user experience.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>atbv</p>
                                    </td>
                                    <td>
                                        <p>Used in cookie based token binding that is used to improve the security of SPAs (Single Page Applications)</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>commonAuthId</p>
                                    </td>
                                    <td>
                                        <p>To keep your SSO session data in order to give you a smooth seamless user experience.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Opbs</p>
                                    </td>
                                    <td>
                                        <p>Used OIDC session management to support seamless logout user experience.</p>
                                    </td>
                                    <td>
                                        <p>Session</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h2 id="disclaimer">Disclaimer</h2>
                        <p>This cookie policy reflects the default settings of the software. The content in the policy is technically correct at the time of the product shipment. The organization which runs this WSO2 PCC instance may personalize and  has full authority and responsibility with regard to the effective Cookie Policy presented to its end users.</p>
                        <p>As between WSO2 and the entity or individual running the software, WSO2 is a service provider and a processor ( or sub-processor, as the case may be) for end user data stored in the product. All cookie data, including personal data is controlled by the entity or individual running WSO2 PCC. WSO2 does not provide any warranties or undertake any responsibility or liability in connection with the lawfulness or the manner and purposes for which WSO2 PCC is used by such entities or persons.</p>
                    </div>
                    <%-- /Costomizable content --%>
                </div>
            </div>
            <!-- /content -->
        </div>
    </div>
</div>
