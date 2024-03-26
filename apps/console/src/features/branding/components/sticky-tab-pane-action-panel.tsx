/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FormPropsInterface } from "@wso2is/form";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, MutableRefObject, PropsWithChildren, ReactElement } from "react";
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
* @param props - Props injected to the component.
*
* @returns Sticky tab pane action panel component.
*/
export const StickyTabPaneActionPanel: FunctionComponent<PropsWithChildren<StickyTabPaneActionPanelInterface>> = (
    props: PropsWithChildren<StickyTabPaneActionPanelInterface>
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        formRef,
        saveButton,
        children
    } = props;

    const { t } = useTranslation();

    const {
        ["data-componentid"]: saveButtonComponentId,
        isDisabled: isSaveButtonDisabled,
        isLoading: isSaveButtonLoading,
        readOnly: isSaveButtonReadOnly,
        onClick: onSaveButtonClick
    } = saveButton;

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
                { t("branding:form.actions.save") }
            </PrimaryButton>
            { children }
        </Segment>
    );
};

/**
* Default props for the component.
*/
StickyTabPaneActionPanel.defaultProps = {
    "data-componentid": "sticky-tab-pane-action-panel"
};
