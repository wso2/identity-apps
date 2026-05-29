/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export const DEFAULT_LAYOUT_HTML_CONTENT: string = `<div class="page-wrapper layout-file" id="page-wrapper-root">
    <div class="center-segment" id="init-loader">
        <div class="content-loader">
            <div class="ui dimmer">
                <div class="ui loader"></div>
            </div>
        </div>
    </div>
    <main class="center-segment" id="page-content-section">
        <div class="ui container medium center aligned middle">
            {{{ProductHeader}}}
            {{{MainSection}}}
        </div>
        {{{ProductFooter}}}
    </main>
</div>`;

export const DEFAULT_LAYOUT_CSS_CONTENT: string =
`#page-content-section {
	display: none;
}

.login-portal.layout .page-wrapper.layout-file .center-segment>.ui.container>.ui.segment .ui.header:first-child {
	text-align: center;
}

.login-portal.layout .page-wrapper.layout-file .center-segment {
	flex-direction: column;
}

.login-portal.layout .page-wrapper.layout-file .footer {
	border-top: 0;
	padding: 0;
	width: 100%;
	margin-bottom: 50px;
}

.login-portal.layout .page-wrapper.layout-file .footer a#copyright span {
	max-width: 300px;
	overflow-wrap: break-word;
}

.login-portal.layout .page-wrapper.layout-file .footer .ui.menu {
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.login-portal.layout .page-wrapper.layout-file .footer .ui.menu:not(.vertical) .right.item,
.ui.menu:not(.vertical) .right.menu {
	margin-left: 0 !important;
	justify-content: center;
	width: 100%;
}

.login-portal.layout .page-wrapper.layout-file .center-segment>.ui.container {
	margin-bottom: 10px;
}`;

export const DEFAULT_LAYOUT_CSS_CONTENT_WITH_POLICY_PAGES: string =
`#page-content-section {
	display: none;
}

.login-portal.layout .page-wrapper.layout-file .center-segment>.ui.container>.ui.segment .ui.header:first-child {
	text-align: center;
}

.login-portal.layout .page-wrapper.layout-file .center-segment {
	flex-direction: column;
}

.login-portal.layout .page-wrapper.layout-file .footer {
	border-top: 0;
	padding: 0;
	width: 100%;
	margin-bottom: 50px;
}

.login-portal.layout .page-wrapper.layout-file .footer a#copyright span {
	max-width: 300px;
	overflow-wrap: break-word;
}

.login-portal.layout .page-wrapper.layout-file .footer .ui.menu {
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.login-portal.layout .page-wrapper.layout-file .footer .ui.menu:not(.vertical) .right.item,
.ui.menu:not(.vertical) .right.menu {
	margin-left: 0 !important;
	justify-content: center;
	width: 100%;
}

.login-portal.layout .page-wrapper.layout-file .center-segment>.ui.container {
	margin-bottom: 10px;
}

.login-portal.layout.policy-page-layout .page-wrapper.layout-file .center-segment>.ui.container.medium {
	max-width: 100% !important;
}

.login-portal.layout.policy-page-layout .page-wrapper.layout-file .center-segment>.ui.container {
	margin: 60px 0;
	margin-bottom: 50px !important;
	text-align: left;
}

.login-portal.layout.policy-page-layout .page-wrapper.layout-file .center-segment > .ui.container .product-logo {
	position: fixed;
	top: 0;
	padding: 20px 0;
	margin: 0 !important;
	width: 100%;
	text-align: left;
	background: #fbfbfb;
	z-index: 101;
}

.login-portal.layout.policy-page-layout .page-wrapper.layout-file .center-segment > .ui.container .ui.grid {
	margin-left: -10px;
}

.login-portal.layout.policy-page-layout .footer .ui.menu:not(.vertical) .right.menu {
	justify-content: end;
}`;

export const DEFAULT_LAYOUT_JS_CONTENT: string =
`const dataset = document.body.dataset;

document.addEventListener('DOMContentLoaded', function () {
    if (dataset.responseType === "success") {
        document.querySelector("#page-wrapper-root").classList.add("success-page");
    } else if (dataset.responseType === "error") {
        document.querySelector("#page-wrapper-root").classList.add("error-page");
    }
    document.getElementById("init-loader").style.display = "none";
    document.getElementById("page-content-section").style.display = "block";
});`;
