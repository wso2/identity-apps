/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ClaimManagementConstants } from "../../../constants";
import { resolveType } from "../../../utils/resolve-type";

/**
 * Prop types of `DialectDetails` component.
 */
interface DialectDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Triggers submit.
     */
    submitState: boolean;
    /**
     * Called to initiate update.
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * Form Values to be saved.
     */
    values: Map<string, FormValue>;
}

/**
 * This renders the dialect details step of the add dialect wizard.
 * 
 * @param props - Props injected to the component.
 * 
 * @returns DialectDetails component
 */
export const DialectDetails: FunctionComponent<DialectDetailsPropsInterface> = (
    props: DialectDetailsPropsInterface
): ReactElement => {

    const {
        submitState,
        onSubmit,
        values,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <Forms
            onSubmit={
                (values: Map<string, FormValue>) => {
                    onSubmit(values);
                }
            }

            submitState={ submitState }
        >
            <Field
                type="text"
                name="dialectURI"
                label={ 
                    t(
                        "claims:dialects.forms.dialectURI.label",
                        { type: resolveType(ClaimManagementConstants.OTHERS, true) }
                    ) 
                }
                required={ true }
                requiredErrorMessage={ t("claims:dialects." +
                    "forms.dialectURI.requiredErrorMessage") }
                placeholder={ t("claims:dialects.forms.dialectURI.placeholder") }
                value={ values?.get("dialectURI")?.toString() }
                data-testid={ `${ testId }-form-dialect-uri-input` }
            />
        </Forms >
    );
};

/**
 * Default props for the application creation wizard.
 */
DialectDetails.defaultProps = {
    "data-testid": "dialect-details"
};
