/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState, FeatureConfigInterface } from "../../../admin.core.v1";
import { updateApplicationConfigurations } from "../../api";
import { AdvancedConfigurationsInterface, ApplicationTemplateListItemInterface } from "../../models";
import { AdvancedConfigurationsForm } from "../forms";

/**
 * Proptypes for the advance settings component.
 */
interface AdvancedSettingsPropsInterface extends SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: AdvancedConfigurationsInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
}

/**
 *  advance settings component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Advance settings component.
 */
export const AdvancedSettings: FunctionComponent<AdvancedSettingsPropsInterface> = (
    props: AdvancedSettingsPropsInterface
): ReactElement => {

    const {
        appId,
        advancedConfigurations,
        featureConfig,
        onUpdate,
        readOnly,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch  = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };
    
    /**
     * Handles the advanced config form submit action.
     *
     * @param values - Form values.
     */
    const handleAdvancedConfigFormSubmit = (values: any): void => {
        setIsSubmitting(true);

        updateApplicationConfigurations(appId, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateAdvancedConfig" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateAdvancedConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateAdvancedConfig.error" +
                            ".message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("applications:notifications.updateAdvancedConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateAdvancedConfig" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <EmphasizedSegment className="advanced-configuration-section" padded="very">
            <AdvancedConfigurationsForm
                config={ advancedConfigurations }
                onSubmit={ handleAdvancedConfigFormSubmit }
                readOnly={
                    readOnly
                    || !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update,
                        allowedScopes)
                }
                template={ template }
                onAlertFired={ handleAlerts }
                data-testid={ `${ componentId }-form` }
                isSubmitting={ isSubmitting }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application advanced settings component.
 */
AdvancedSettings.defaultProps = {
    "data-componentid": "application-advanced-settings"
};
