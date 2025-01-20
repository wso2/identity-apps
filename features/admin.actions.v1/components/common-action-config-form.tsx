/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ActionEndpointConfigForm from "./action-endpoint-config-form";
import {
    ActionConfigFormPropertyInterface,
    AuthenticationType
} from "../models/actions";

interface CommonActionConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Action's initial values.
     */
    initialValues: ActionConfigFormPropertyInterface;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;

    onAuthenticationTypeChange:  (updatedValue: AuthenticationType, change: boolean) => void;

}

const CommonActionConfigForm: FunctionComponent<CommonActionConfigFormInterface> = ({

    initialValues,
    isCreateFormState,
    onAuthenticationTypeChange,
    [ "data-componentid" ]: _componentId = "common-action-config-form"
}: CommonActionConfigFormInterface): ReactElement => {

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.actions);
    const hasActionUpdatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.update);
    const hasActionCreatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.create);

    const { t } = useTranslation();

    const getFieldDisabledStatus = (): boolean => {
        if (isCreateFormState) {
            return !hasActionCreatePermissions;
        } else {
            return !hasActionUpdatePermissions;
        }
    };

    return (
        <>
            <FinalFormField
                key="name"
                className="text-field-container"
                width={ 16 }
                FormControlProps={ {
                    margin: "dense"
                } }
                ariaLabel="actionName"
                required={ true }
                data-componentid={ `${_componentId}-action-name` }
                name="name"
                type="text"
                label={ t("actions:fields.name.label") }
                placeholder={ t("actions:fields.name.placeholder") }
                helperText={ (
                    <Hint className="hint" compact>
                        { t("actions:fields.name.hint") }
                    </Hint>
                ) }
                component={ TextFieldAdapter }
                maxLength={ 100 }
                minLength={ 0 }
                disabled={ getFieldDisabledStatus() }
            />
            <ActionEndpointConfigForm
                initialValues={ initialValues }
                isCreateFormState={ isCreateFormState }
                onAuthenticationTypeChange={ onAuthenticationTypeChange }
            />
        </>
    );
};

export default CommonActionConfigForm;
