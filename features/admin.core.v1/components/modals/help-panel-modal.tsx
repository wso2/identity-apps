/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ContentLoader, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { Modal, ModalProps } from "semantic-ui-react";
import { ReactComponent as CaretLeftIcon } from "../../assets/icons/caret-left-icon.svg";
import { ReactComponent as CaretRightIcon } from "../../assets/icons/caret-right-icon.svg";

/**
 * Model of the sub components  of the `HelpPanelModal` component.
 */
interface HelpPanelModalSubComponentsInterface {
    MainPanel: typeof HelpPanelModalMainPanel;
    SidePanel: typeof HelpPanelModalSidePanel;
    Header: typeof HelpPanelModalHeader;
    Content: typeof HelpPanelModalContent;
    Actions: typeof HelpPanelModalActions;
}

/**
 * Proptypes of the components belonging to modal with side panel.
 */
interface ComponentsPropsInterface {
    className?: string;
    isLoading?: boolean;
}

/**
 * The root component that encapsulates all the sub components.
 *
 * @param {ModalProps & ComponentsPropsInterface} props Props to be injected into the component.
 *
 * @return {ReactElement} A modal with a side panel.
 */
export const HelpPanelModal: FunctionComponent<ModalProps & ComponentsPropsInterface> &
    HelpPanelModalSubComponentsInterface = (props: ModalProps & ComponentsPropsInterface): ReactElement => {
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
export const HelpPanelModalHeader: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {
    return (
        <>
            <div className={ `modal-header ${ props?.className ?? "" }` }>
                { !props?.isLoading ? props?.children : <ContentLoader/> }
            </div>
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
export const HelpPanelModalContent: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
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
export const HelpPanelModalActions: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
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
export const HelpPanelModalMainPanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
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
export const HelpPanelModalSidePanel: FunctionComponent<PropsWithChildren<ComponentsPropsInterface>> = (
    props: PropsWithChildren<ComponentsPropsInterface>
): ReactElement => {

    const { isLoading } = props;
    const [ sidePanelOpen, setSidePanelOpen ] = useState(true);

    return (
        <div className={ `side-panel ${ props?.className ?? "" } ${ !sidePanelOpen ? "closed" : "" }` }>
            {
                !isLoading ? (
                    <>
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
                                            ? CaretLeftIcon
                                            : CaretRightIcon
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <ContentLoader/>
                )
            }
            
        </div>
    );
};

/**
 * Attaches with sub components to the `HelpPanelModal` component.
 */
HelpPanelModal.MainPanel = HelpPanelModalMainPanel;
HelpPanelModal.SidePanel = HelpPanelModalSidePanel;
HelpPanelModal.Header = HelpPanelModalHeader;
HelpPanelModal.Content = HelpPanelModalContent;
HelpPanelModal.Actions = HelpPanelModalActions;
