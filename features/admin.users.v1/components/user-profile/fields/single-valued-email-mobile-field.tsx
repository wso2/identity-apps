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

import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { Popup } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { SingleValuedEmailMobileFieldPropsInterface } from "../../../models/ui";

/**
 * User profile single-valued email/mobile field component.
 */
const SingleValuedEmailMobileField: FunctionComponent<SingleValuedEmailMobileFieldPropsInterface> = (
    {
        schema,
        fieldName,
        fieldLabel,
        initialValue,
        pendingValue,
        isVerificationEnabled,
        isUpdating,
        isReadOnly,
        isRequired,
        maxLength,
        validator,
        ["data-componentid"]: componentId = "single-valued-email-mobile-field"
    }: SingleValuedEmailMobileFieldPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    const renderVerificationStatus = (): ReactElement => {
        return (
            <div
                className="verified-icon"
                data-componentid={
                    `${componentId}-profile-form-${
                        schema.name}-pending-verification`
                }
            >
                <Popup
                    name="pending-verification-popup"
                    size="tiny"
                    trigger={ <Icon name="info circle" color="yellow" /> }
                    header={ t("user:profile.tooltips.confirmationPending") }
                    inverted
                />
            </div>
        );
    };

    let fieldValue: string = initialValue;

    if (isVerificationEnabled && !isEmpty(pendingValue)) {
        fieldValue = pendingValue;
    }

    const isPending: boolean = !isEmpty(pendingValue);

    return (
        <FinalFormField
            component={ TextFieldAdapter }
            initialValue={ fieldValue }
            ariaLabel={ fieldLabel }
            name={ fieldName ?? schema.name }
            type="text"
            label={ fieldLabel }
            placeholder={ t("user:profile.forms.generic.inputs.placeholder",
                { fieldName: fieldLabel })
            }
            validate={ (value: string) => validator ? validator(value) : undefined }
            maxLength={ maxLength }
            readOnly={ isReadOnly || isUpdating }
            required={ isRequired }
            InputProps={ {
                endAdornment: isVerificationEnabled && isPending && renderVerificationStatus()
            } }
            data-componentid={ `${componentId}-input` }
            data-testid={ `${componentId}-input` }
        />
    );
};

export default SingleValuedEmailMobileField;
