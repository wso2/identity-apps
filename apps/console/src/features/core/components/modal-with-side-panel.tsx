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

import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { Modal, ModalProps } from "semantic-ui-react";
import { getHelpPanelActionIcons } from "../configs";

/**
 * Model of the sub components  of the `ModalWithSidePanel` component.
 */
interface ModalWithSidePanelSubComponentsInterface {
    MainPanel: typeof ModalWithSidePanelMainPanel;
    SidePanel: typeof ModalWithSidePanelSidePanel;
    Header: typeof ModalWithSidePanelHeader;
    Content: typeof ModalWithSidePanelContent;
    Actions: typeof ModalWithSidePanelActions;
}

/**
 * Proptypes of the components belonging to modal with side panel.
 */
interface ComponentsPropsInterface {
    className?: string;
}

/**
 * The root component that encapsulates all the sub components.
 *
 * @param {ModalProps & ComponentsPropsInterface} props Props to be injected into the component.
 *
 * @return {ReactElement} A modal with a side panel.
 */
export const ModalWithSidePanel: FunctionComponent<ModalProps & ComponentsPropsInterface> &
    ModalWithSidePanelSubComponentsInterface = (props: ModalProps & ComponentsPropsInterface): ReactElement => {
        return (
            <Modal { ...props } className={ `modal-with-side-panel ${ props.className ?? "" }` }>
                <div className="panels">{ props?.children }</div>
            </Modal>
        );
    };

/**
 * The header of a panel.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props Props to be injected into the component.
 *
 * @return {ReactElement} The header.
 */
export const ModalWithSidePanelHeader: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return (
        <>
            <div className={ `modal-header ${ props?.className ?? "" }` }>{ props?.children }</div>
        </>
    );
};

/**
 * The content of a panel.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props Props to be injected into the component.
 *
 * @return {ReactElement} The content section.
 */
export const ModalWithSidePanelContent: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return <div className={ `modal-content ${ props?.className ?? "" }` }>{ props?.children }</div>;
};

/**
 * The actions of a panel.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props Props to be injected into the component.
 *
 * @return {ReactElement} The actions section.
 */
export const ModalWithSidePanelActions: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return (
        <>
            <div className={ `modal-actions ${ props?.className ?? "" }` }>{ props?.children }</div>
        </>
    );
};

/**
 * The main panel of the modal.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props Props to be injected into the component.
 *
 * @return {ReactElement} The main panel.
 */
export const ModalWithSidePanelMainPanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return <div className={ `main-panel ${ props?.className ?? "" }` }>{ props?.children }</div>;
};

/**
 * The side panel of the modal.
 *
 * @param {PropsWithChildren<ComponentsPropsInterface>} props Props to be injected into the component.
 *
 * @return {ReactElement} The side panel.
 */
export const ModalWithSidePanelSidePanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    const [ sidePanelOpen, setSidePanelOpen ] = useState(true);

    return (
        <div className={ `side-panel ${ props?.className ?? "" } ${ !sidePanelOpen ? "closed" : "" }` }>
            <div className={ `side-panel-content ${ sidePanelOpen ? "visible" : "hidden" }` }>{ props?.children }</div>
            <div className={ `toggle-button-column ${ !sidePanelOpen ? "closed" : "" }` }>
                <div
                    className="toggle-button"
                    onClick={ () => {
                        setSidePanelOpen(!sidePanelOpen);
                    } }
                >
                    <GenericIcon
                        hoverable={ true }
                        hoverType="circular"
                        background={ false }
                        transparent={ true }
                        link={ true }
                        icon={
                            sidePanelOpen
                                ? getHelpPanelActionIcons().caretLeft
                                : getHelpPanelActionIcons().caretRight
                        }
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Attaches with sub components to the `ModalWithSidePanel` component.
 */
ModalWithSidePanel.MainPanel = ModalWithSidePanelMainPanel;
ModalWithSidePanel.SidePanel = ModalWithSidePanelSidePanel;
ModalWithSidePanel.Header = ModalWithSidePanelHeader;
ModalWithSidePanel.Content = ModalWithSidePanelContent;
ModalWithSidePanel.Actions = ModalWithSidePanelActions;
