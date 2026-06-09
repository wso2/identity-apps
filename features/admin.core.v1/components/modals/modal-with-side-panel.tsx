/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { FunctionComponent, ReactElement } from "react";
import { Modal, ModalProps } from "semantic-ui-react";
import { ModalWithSidePanelActions } from "./modal-with-side-panel-actions";
import { ModalWithSidePanelContent } from "./modal-with-side-panel-content";
import { ModalWithSidePanelHeader } from "./modal-with-side-panel-header";
import { ModalWithSidePanelMainPanel } from "./modal-with-side-panel-main-panel";
import { ModalWithSidePanelSidePanel } from "./modal-with-side-panel-side-panel";

import { ComponentsPropsInterface } from "./modal-with-side-panel-types";

interface ModalWithSidePanelSubComponentsInterface {
    MainPanel: typeof ModalWithSidePanelMainPanel;
    SidePanel: typeof ModalWithSidePanelSidePanel;
    Header: typeof ModalWithSidePanelHeader;
    Content: typeof ModalWithSidePanelContent;
    Actions: typeof ModalWithSidePanelActions;
}

/**
 * The root component that encapsulates all the sub components.
 *
 * @param {ModalProps & ComponentsPropsInterface} props - Props to be injected into the component.
 * @return {ReactElement} A modal with a side panel.
 */
export const ModalWithSidePanel: FunctionComponent<ModalProps & ComponentsPropsInterface> &
    ModalWithSidePanelSubComponentsInterface = (
        props: ModalProps & ComponentsPropsInterface
    ): ReactElement => {
        return (
            <Modal { ...props } className={ `modal-with-side-panel ${ props.className ?? "" }` }>
                <div className="panels">{ props?.children }</div>
            </Modal>
        );
    };

ModalWithSidePanel.MainPanel = ModalWithSidePanelMainPanel;
ModalWithSidePanel.SidePanel = ModalWithSidePanelSidePanel;
ModalWithSidePanel.Header = ModalWithSidePanelHeader;
ModalWithSidePanel.Content = ModalWithSidePanelContent;
ModalWithSidePanel.Actions = ModalWithSidePanelActions;