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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateIdentityProviderDetails } from "../../api";
import { IdentityProviderAdvanceInterface, IdentityProviderInterface } from "../../models";
import { AdvanceConfigurationsForm } from "../forms";
import { handleIDPUpdateError } from "../utils";

/**
 * Proptypes for the advance settings component.
 */
interface AdvanceSettingsPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: IdentityProviderAdvanceInterface;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 *  Advance settings component.
 *
 * @param {AdvanceSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdvanceSettings: FunctionComponent<AdvanceSettingsPropsInterface> = (
    props: AdvanceSettingsPropsInterface
): ReactElement => {

    const {
        editingIDP,
        advancedConfigurations,
        onUpdate,
        isReadOnly,
        isLoading,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * Handles the advanced config form submit action.
     *
     * @param values - Form values.
     */
    const handleAdvancedConfigFormSubmit = (values: any): void => {
        setIsSubmitting(true);

        updateIdentityProviderDetails({ id: editingIDP.id, ...values })
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateIDP.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error) => {
                handleIDPUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment className="advanced-configuration-section">
            <AdvanceConfigurationsForm
                config={ advancedConfigurations }
                onSubmit={ handleAdvancedConfigFormSubmit }
                data-testid={ testId }
                isReadOnly={ isReadOnly }
                isSubmitting={ isSubmitting }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP advance settings component.
 */
AdvanceSettings.defaultProps = {
    "data-testid": "idp-edit-advance-settings"
};
