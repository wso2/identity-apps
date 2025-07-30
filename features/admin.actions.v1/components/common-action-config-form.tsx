/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { FinalFormField, TextFieldAdapter } from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ActionEndpointConfigForm from "./action-endpoint-config-form";
import { ActionConfigFormPropertyInterface, AuthenticationType } from "../models/actions";
import "./common-action-config-form.scss";

interface CommonActionConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Action's initial values.
     */
    initialValues: ActionConfigFormPropertyInterface;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Callback function triggered when the authentication type is changed.
     *
     * @param updatedValue - The new authentication type selected.
     * @param change - Indicates whether the change is detected.
     */
    onAuthenticationTypeChange: (updatedValue: AuthenticationType, change: boolean) => void;
}

const CommonActionConfigForm: FunctionComponent<CommonActionConfigFormInterface> = ({
    initialValues,
    isCreateFormState,
    isReadOnly,
    onAuthenticationTypeChange,
    ["data-componentid"]: _componentId = "common-action-config-form"
}: CommonActionConfigFormInterface): ReactElement => {
    const { t } = useTranslation();

    return (
        <div className="common-action-config-form">
            <div className="form-field-wrapper">
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
                    helperText={
                        (<Hint className="hint" compact>
                            { t("actions:fields.name.hint") }
                        </Hint>)
                    }
                    component={ TextFieldAdapter }
                    maxLength={ 100 }
                    minLength={ 0 }
                    disabled={ isReadOnly }
                />
            </div>
            <ActionEndpointConfigForm
                initialValues={ initialValues }
                isCreateFormState={ isCreateFormState }
                onAuthenticationTypeChange={ onAuthenticationTypeChange }
                isReadOnly={ isReadOnly }
            />
        </div>
    );
};

export default CommonActionConfigForm;
