<%--
  ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="ui modal tiny notify" id="asg-modal-0">
    <div class="animated-icon text-center">
        <div class="svg-box" data-testid="session-timeout-modal-warning-animated-icon">
            <svg class="circular warning-stroke">
                <circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="2" stroke-miterlimit="10">
                </circle>
            </svg>
            <svg class="warning-icon warning-stroke">
                <g transform="matrix(1,0,0,1,-615.516,-257.346)">
                    <g transform="matrix(0.56541,-0.56541,0.56541,0.56541,93.7153,495.69)">
                        <path class="line" d="M634.087,300.805L673.361,261.53" fill="none"></path>
                    </g>
                    <g transform="matrix(2.27612,-2.46519e-32,0,2.27612,-792.339,-404.147)">
                        <circle class="dot" cx="621.52" cy="316.126" r="1.318"></circle>
                    </g>
                </g>
            </svg>
        </div>
    </div>
    <div class="content text-center">
        <div class="description">
            <div class="ui header" id="asg-modal-0-title">
                <b>${param.title}</b>
            </div>
            <p id="asg-modal-0-description">
                ${param.description}
            </p>
        </div>
    </div>
    <div class="actions">
        <div class="ui deny button" id="asg-modal-0-dismiss-button">
            ${param.cancel_button_text}
        </div>
        <c:if test="${not empty param.action_button_text}">
            <div class="ui primary button" id="asg-modal-0-action-button">
                ${param.action_button_text}
            </div>
        </c:if>
    </div>
</div>

<script>

    function ModalRef(onAction = ModalRef.noop, onCancel = ModalRef.noop) {
        try {
            this.onAction = onAction;
            this.onCancel = onCancel;
            this.modal = $("#asg-modal-0");
            this.desc = $("#asg-modal-0-description");
            this.cancelBtn = $("#asg-modal-0-dismiss-button");
            this.actionBtn = $("#asg-modal-0-action-button");
            this.init();
        } catch (e) {
            // Ignore any exceptions.
        }
    }

    ModalRef.prototype.init = function () {
        if (this.cancelBtn) {
            this.cancelBtn.click(this.onCancel);
        }
        if (this.actionBtn) {
            this.actionBtn.click(this.onAction);
        }
    };

    ModalRef.prototype.isActive = function () {
        return this.modal.hasClass("active");
    };

    ModalRef.prototype.show = function () {
        if (this.isActive()) return;
        this.modal.modal({
            detachable: false,
            closable: false
        }).modal("show");
    };

    ModalRef.prototype.hide = function () {
        this.modal.modal("hide");
    };

    ModalRef.prototype.changeDescription = function (desc) {
        this.desc.text(desc);
    };

    ModalRef.prototype.changeDescriptionAsHTML = function (html) {
        this.desc.html(html);
    };

    ModalRef.prototype.hideDismissButton = function () {
        this.cancelBtn.hide();
    };

    ModalRef.prototype.showDismissButton = function () {
        this.cancelBtn.show();
    };

    ModalRef.prototype.dispose = function () {
        this.hide();
        this.actionBtn.unbind("click");
        this.cancelBtn.unbind("click");
        this.onAction = null;
        this.onCancel = null;
        this.modal = null;
        this.desc = null;
        this.cancelBtn = null;
        this.actionBtn = null;
    };

    ModalRef.noop = function () {
        // No operations
    };

</script>
