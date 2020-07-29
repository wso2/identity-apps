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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { Divider, Icon, Modal, ModalProps } from "semantic-ui-react";

interface ModalWithSidePanelSubComponentsInterface {
    MainPanel: typeof ModalWithSidePanelMainPanel;
    SidePanel: typeof ModalWithSidePanelSidePanel;
}

interface ModalPanelSubComponentsInterface {
    Header: typeof ModalWithSidePanelHeader;
    Content: typeof ModalWithSidePanelContent;
    Actions: typeof ModalWithSidePanelActions;
}

interface ComponentsPropsInterface {
    className?: string;
}
export const ModalWithSidePanel: FunctionComponent<ModalProps & ComponentsPropsInterface> &
    ModalWithSidePanelSubComponentsInterface &
    ModalPanelSubComponentsInterface = (props: ModalProps & ComponentsPropsInterface): ReactElement => {
        return (
            <Modal { ...props } className={ `modal-with-side-panel ${ props.className ?? "" }` }>
                <div className="panels">{ props?.children }</div>
            </Modal>
        );
    };

export const ModalWithSidePanelHeader: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return (
        <>
            <div className={ `header ${ props?.className ?? "" }` }>{ props?.children }</div>
            <Divider className="divider" />
        </>
    );
};

export const ModalWithSidePanelContent: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return <div className={ `content ${ props?.className ?? "" }` }>{ props?.children }</div>;
};

export const ModalWithSidePanelActions: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return (
        <>
            <Divider className="divider" />
            <div className={ `actions ${ props?.className ?? "" }` }>{ props?.children }</div>
        </>
    );
};

export const ModalWithSidePanelMainPanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return <div className={ `main-panel ${ props?.className ?? "" }` }>{ props?.children }</div>;
};

export const ModalWithSidePanelSidePanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    const [ sidePanelOpen, setSidePanelOpen ] = useState(true);

    return (
        <div className={ `side-panel ${ props?.className ?? "" } ${ !sidePanelOpen && "closed" }` }>
            <div className="toggle-button-column">
                <div
                    className="toggle-button"
                    onClick={ () => {
                        setSidePanelOpen(!sidePanelOpen);
                    } }
                >
                    <Icon name={ sidePanelOpen ? "chevron right" : "chevron left" } />
                </div>
            </div>
            <div className={ `side-panel-content ${ sidePanelOpen ? "visible" : "hidden" }` }>{ props?.children }</div>
        </div>
    );
};

ModalWithSidePanel.MainPanel = ModalWithSidePanelMainPanel;
ModalWithSidePanel.SidePanel = ModalWithSidePanelSidePanel;
ModalWithSidePanel.Header = ModalWithSidePanelHeader;
ModalWithSidePanel.Content = ModalWithSidePanelContent;
ModalWithSidePanel.Actions = ModalWithSidePanelActions;
