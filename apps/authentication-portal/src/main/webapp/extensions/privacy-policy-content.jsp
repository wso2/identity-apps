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
                        <jsp:directive.include file="product-name.jsp"/> - Privacy Policy
                    </h1>
                </div>
                <div>
                    <%-- Customizable content. Due to this nature, i18n is not implemented for this section --%>
                    <div id="privacyPolicy" class="padding-double">
                        <div class="ui divider hidden"></div>
                        <h4><a href="https://wso2.com/ciam-suite/private-ciam-cloud/b2b-ciam/">About WSO2 PCC</a></h4>
                        <p><jsp:directive.include file="product-name.jsp"/> (&ldquo;WSO2 PCC&rdquo;) is a dedicated cloud offering managed by  WSO2. WSO2 PCC is based on the WSO2 Identity Server (&ldquo;WSO2 IS&ldquo;) and licensed to you under the WSO2 subscription license agreement.</p>

                        <h2 id="privacy-policy">Privacy Policy</h2>
                        <p>This policy describes WSO2&apos;s privacy practices when it collects or accesses personal data as a service provider to the entity or individual that has subscribed to WSO2&apos;s PCC software. WSO2&apos;s role as Data Controller</p>

                        <p>WSO2 LLC and its affiliates are a data controller of the following data:</p>
                        <ul>
                            <li>Billing and Payment data required to subscribe to WSO2 PCC</li>
                            <li>Contact data of  administrative users of the entity or individual subscribed to WSO2 PCC</li>
                        </ul>

                        <p>WSO2&apos;s role as Data Processor/sub-processor</p>
                        <p>WSO2 LLC and its affiliates acts as a data processor/sub-processor in the following scenarios:</p>

                        <ul>
                            <li>WSO2 hosts and manages the WSO2 PCC&apos;s infrastructure, deployment and services associated with the WSO2 PCC. The WSO2 Managed Services team may access the deployment and its resources in order to perform routine administrative tasks including troubleshooting, applying relevant updates/upgrades, security and product fine tunings and support purposes.</li>
                        </ul>

                        <p>As between WSO2 and the entity or individuals subscribed to or trialing this product, the entity or individual is the controller of all end user data Therefore entities,or individuals controlling the use and administration of WSO2 PCCshould create their own privacy policies setting out the manner in which end-user data is controlled or processed by them.</p>

                        <h2 id="what-is-personal-information">What is personal information?</h2>
                        <p>WSO2 PCC considers anything related to you, and by which you may be identified, as your personal information. This includes, but is not limited to:</p>
                        <ul>
                            <li>Your user name (except in cases where the user name created by your employer is under contract)</li>
                            <li>IP address used to log in</li>
                            <li>Your device ID if you use a device (e.g., phone or tablet) to log in</li>
                        </ul>
                        <p>WSO2 PCC also collects the following device information, which however cannot identify you personally.</p>
                        <ul>
                            <li>City/Country from which you originated the TCP/IP connection</li>
                            <li>Time of the day that you logged in (year, month, week, hour or minute)</li>
                            <li>Type of device that you used to log in (e.g., phone or tablet)</li>
                            <li>Operating system and generic browser information</li>
                        </ul>

                        <h2 id="collection-of-personal-information">Collection of personal information</h2>
                        <p>WSO2 PCC collects your information only to serve your access requirements or to administer our services. For example:
                        <ul>
                            <li>WSO2 PCC uses your IP address to detect any suspicious login attempts to your account.</li>
                            <li>WSO2 PCC uses attributes like your first name, last name, etc., to provide a rich and personalized user experience.</li>
                            <li>WSO2 PCC uses your security questions and answers only to allow account recovery.</li>
                        </ul>

                        <p>Additionally, WSO2 PCC allows administrators to define what type of data it collects, such data will not be required by WSO2 to administer our services.</p>

                        <h3 id="tracking-technologies">Tracking Technologies</h3>
                        <p>WSO2 PCC collects your information by:</p>
                        <ul>
                            <li>Collecting information from the user profile page where you enter your personal data.</li>
                            <li>Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.</li>
                            <li>Tracking your geographic information with the IP address.</li>
                            <li>Tracking your login history with browser cookies. Please see our <a href="cookie_policy.do">cookie policy</a> for more information.</li>
                        </ul>

                        <h2 id="user-of-personal-information">Use of personal information</h2>
                        <p>WSO2 PCC will only use your personal information for the purposes for which it was collected (or for a use identified as consistent with that purpose) such as:</p>
                        <ul>
                            <li>To provide you with a personalized user experience. WSO2 PCC uses your name and uploaded profile pictures for this purpose.</li>
                            <li>To protect your account from unauthorized access or potential hacking attempts. WSO2 PCC uses HTTP or TCP/IP Headers for this purpose.</li>
                            <ul>
                                <li>This includes:</li>
                                <ul>
                                    <li>IP address</li>
                                    <li>Browser fingerprinting</li>
                                    <li>Cookies</li>
                                </ul>
                            </ul>
                            <li>Derive statistical data for analytical purposes on system performance improvements. WSO2 PCC will not keep any personal information after statistical calculations. Therefore, the statistical report has no means of identifying an individual person.</li>
                            <ul>
                                <li>WSO2 PCC may use:</li>
                                <ul>
                                    <li>IP Address to derive geographic information</li>
                                    <li>Browser fingerprinting to determine the browser technology or/and version</li>
                                </ul>
                            </ul>
                        </ul>

                        <h2 id="disclosure-of-personal-information">Disclosure of personal information</h2>
                        <p>WSO2 PCC only discloses personal information to the relevant applications that are registered with WSO2 PCC. by the identity administrator of your entity or organization. Personal information is disclosed only for the purposes for which it was collected (or for a use identified as consistent with that purpose), as controlled by such Service Providers, unless you have consented otherwise or where it is required by law.</p>

                        <h2 id="storage-of-personal-information">Storage of personal information</h2>

                        <h3 id="where-your-personal-information-stored">Where your personal information is stored</h3>
                        <p>WSO2 PCC is hosted on Microsoft Azure. Organization administrators may choose the location of hosting. WSO2 PCC exercises proper industry accepted security measures to protect the database where your personal information is held.</p>
                        <p>WSO2 PCC may use encryption to keep your personal data with an added level of security.</p>

                        <h3 id="how-long-does-is-5.5-keep-your-personal-information">How long your personal information is retained</h3>
                        <p>WSO2 PCC retains your personal data as long as you are an active user of our software. You can update your personal data at any time using the given self-care user portals.</p>
                        <p>WSO2 PCC may keep hashed secrets to provide you with an added level of security. This includes:</p>
                        <ul>
                            <li>Current password</li>
                            <li>Previously used passwords</li>
                        </ul>

                        <h3 id="how-to-request-removal-of-your-personal-information">How to request removal of your personal information</h3>
                        <p>You can request the administrator to delete your account. The administrator is the
                            administrator of the organization you are registered under, or the super-administrator if
                            you do not use the organization feature.</p>
                        <p>Additionally, you can request to anonymize all traces of your activities that WSO2 PCC may have retained in logs, databases or analytical storage.</p>

                        <h2 id="more-information">More information</h2>

                        <h3 id="changes-to-this-policy">Changes to this policy</h3>
                        <p>Upgraded versions of WSO2 PCC may contain changes to this policy and revisions to this policy will be packaged within such upgrades. Such changes would only apply to users who choose to use upgraded versions.</p>

                        <h3 id="your-choices">Your choices</h3>
                        <p>If you are already have a user account within WSO2 PCC, you have the right to deactivate your account if you find that this privacy policy is unacceptable to you.</p>
                        <p>If you do not have an account and you do not agree with our privacy policy, you can choose not to create one.</p>

                        <h3 id="contact-us">Contact us</h3>
                        <p>Please contact WSO2 if you have any question or concerns regarding this privacy policy.</p>
                        <p><a href="https://wso2.com/contact/">https://wso2.com/contact/</a></p>

                        <h2 id="disclaimer">Disclaimer</h2>
                        <ol>
                            <li>This privacy policy reflects the default settings of the software. The content in the policy is technically correct at the time of the product shipment. The organization which runs this WSO2 PCC instance may personalize and  has full authority and responsibility with regard to the effective Privacy Policy presented to its end users.</li>
                            </br>
                            <li>As between WSO2 and the entity or individual running the software, WSO2 is a service provider and a processor ( or sub-processor, as the case may be) for end user data stored in the product. All data, including personal data is controlled by the entity or individual running WSO2 PCC. WSO2 does not provide any warranties or undertake any responsibility or liability in connection with the lawfulness or the manner and purposes for which WSO2 PCC is used by such entities or persons.</li>
                        </ol>
                    </div>
                    <%-- /Costomizable content --%>
                </div>
            </div>
            <!-- /content -->
        </div>
    </div>
</div>
