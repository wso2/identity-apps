/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityProviderManagementConstants } from "@wso2is/admin.identity-providers.v1/constants";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { Dispatch, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateIdentityProviderDetails, updateImplicitAssociationConfig } from "../../../api/connections";
import {
    ConnectionAdvanceInterface,
    ConnectionInterface,
    ImplicitAssociaionConfigInterface
} from "../../../models/connection";
import { handleConnectionUpdateError } from "../../../utils/connection-utils";
import { AdvanceConfigurationsForm, TrustedTokenIssuerAdvanceConfigurationsForm } from "../forms";

/**
 * Proptypes for the advance settings component.
 */
interface AdvanceSettingsPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: ConnectionInterface;
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: ConnectionAdvanceInterface;
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
    /**
     * Type of the template
     */
    templateType: string;
    /**
     * Implicit association configuration of the connection.
     */
    implicitAssociationConfig: ImplicitAssociaionConfigInterface;
}

/**
 *  Advance settings component.
 *
 * @param props - Props injected to the component.
 * @returns Advance settings component.
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
        [ "data-testid" ]: testId,
        templateType,
        implicitAssociationConfig

    } = props;

    const dispatch: Dispatch<any> = useDispatch();

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
                    description: t("authenticationProvider:notifications." +
                        "updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "updateIDP.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error: AxiosError) => {
                handleConnectionUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleImplicitAssociationConfigFormSubmit = (values: any): void => {
        setIsSubmitting(true);

        updateImplicitAssociationConfig(editingIDP.id, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications." +
                        "updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "updateIDP.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error: AxiosError) => {
                handleConnectionUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment padded="very" className="advanced-configuration-section">
            { templateType === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER ?
                (<TrustedTokenIssuerAdvanceConfigurationsForm
                    config={ implicitAssociationConfig }
                    onSubmit={ handleImplicitAssociationConfigFormSubmit }
                    isSubmitting={ isSubmitting }

                />) :
                (<AdvanceConfigurationsForm
                    config={ advancedConfigurations }
                    onSubmit={ handleAdvancedConfigFormSubmit }
                    data-testid={ testId }
                    isReadOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }/>) }
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP advance settings component.
 */
AdvanceSettings.defaultProps = {
    "data-testid": "idp-edit-advance-settings"
};
