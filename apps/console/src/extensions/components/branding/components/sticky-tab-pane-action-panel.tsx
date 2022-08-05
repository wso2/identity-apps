/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FormPropsInterface } from "@wso2is/form";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, MutableRefObject, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ButtonProps, Segment } from "semantic-ui-react";

/**
* Proptypes for the Branding preference tabs pane action panel component.
*/
interface StickyTabPaneActionPanelInterface extends IdentifiableComponentInterface {

    /**
     * Form ref.
     */
    formRef: MutableRefObject<FormPropsInterface>;
    /**
     * Save Button
     */
    saveButton: StickyTabPaneActionPanelButtonInterface;
}

interface StickyTabPaneActionPanelButtonInterface extends IdentifiableComponentInterface, ButtonProps {

   /**
    * Should the button show the loader.
    */
    isLoading: boolean;
    /**
    * Should the button render as disabled.
    */
     isDisabled: boolean;
    /**
    * Is Read only?
    */
    readOnly: boolean;
}

/**
* Branding preference tabs pane action panel component.
*
* @param {StickyTabPaneActionPanelInterface} props - Props injected to the component.
*
* @return {React.ReactElement}
*/
export const StickyTabPaneActionPanel: FunctionComponent<StickyTabPaneActionPanelInterface> = (
    props: StickyTabPaneActionPanelInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        formRef,
        saveButton
    } = props;

    const {
        ["data-componentid"]: saveButtonComponentId,
        isDisabled: isSaveButtonDisabled,
        isLoading: isSaveButtonLoading,
        readOnly: isSaveButtonReadOnly,
        onClick: onSaveButtonClick
    } = saveButton;

    const { t } = useTranslation();

    if (isSaveButtonReadOnly) {
        return null;
    }

    return (
        <Segment
            className="sticky-action-container"
            attached="bottom"
            padded="very"
            data-componentid={ componentId }
        >
            <PrimaryButton
                size="small"
                loading={ isSaveButtonLoading }   
                disabled={ isSaveButtonDisabled }
                onClick={ (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
                    formRef?.current?.triggerSubmit();
                    onSaveButtonClick && typeof onSaveButtonClick === "function" && onSaveButtonClick(e, data);
                } }
                ariaLabel="Branding preference form save button"
                data-componentid={ saveButtonComponentId }
            >
                { t("common:save") }
            </PrimaryButton>
        </Segment>
    );
};

/**
* Default props for the component.
*/
StickyTabPaneActionPanel.defaultProps = {
    "data-componentid": "sticky-tab-pane-action-panel"
};
