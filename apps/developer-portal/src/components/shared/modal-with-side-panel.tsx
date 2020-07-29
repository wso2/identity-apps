/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement
} from "react";
import { Modal, ModalProps } from "semantic-ui-react";

interface ModalWithSidePanelSubComponentsInterface {
    MainPanel: typeof ModalWithSidePanelMainPanel;
    SidePanel: typeof ModalWithSidePanelSidePanel;
}

interface ModalPanelSubComponentsInterface {
    Header: typeof ModalWithSidePanelHeader;
    Content: typeof ModalWithSidePanelContent;
    Actions: typeof ModalWithSidePanelActions;
}

export const ModalWithSidePanel: FunctionComponent<ModalProps> &
    ModalWithSidePanelSubComponentsInterface &
    ModalPanelSubComponentsInterface = (props: ModalProps): ReactElement => {
        return <Modal { ...props }>{ props?.children }</Modal>;
    };

export const ModalWithSidePanelHeader: FunctionComponent<PropsWithChildren<any>> = (
    props: PropsWithChildren<any>
): ReactElement => {
    return <div>{ props?.children }</div>;
};

export const ModalWithSidePanelContent: FunctionComponent<PropsWithChildren<any>> = (
    props: PropsWithChildren<any>
): ReactElement => {
    return <div>{ props?.children }</div>;
};

export const ModalWithSidePanelActions: FunctionComponent<PropsWithChildren<any>> = (
    props: PropsWithChildren<any>
): ReactElement => {
    return <div>{ props?.children }</div>;
};

export const ModalWithSidePanelMainPanel: FunctionComponent<PropsWithChildren<any>> = (
    props: PropsWithChildren<any>
): ReactElement => {
    return <div>{ props?.children }</div>;
};

export const ModalWithSidePanelSidePanel: FunctionComponent<PropsWithChildren<any>> = (
    props: PropsWithChildren<any>
): ReactElement => {
    return <div>{ props?.children }</div>;
};

ModalWithSidePanel.MainPanel = ModalWithSidePanelMainPanel;
ModalWithSidePanel.SidePanel = ModalWithSidePanelSidePanel;
ModalWithSidePanel.Header = ModalWithSidePanelHeader;
ModalWithSidePanel.Content = ModalWithSidePanelContent;
ModalWithSidePanel.Actions = ModalWithSidePanelActions;
