
/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { Field, Forms, FormValue } from "@wso2is/forms";

import React from "react";

/**
 * Prop types of `DialectDetails` component.
 */
interface DialectDetailsPropsInterface {
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
 * @param {DialectDetailsPropsInterface} props
 * 
 * @return {React.ReactElement}
 */
export const DialectDetails = (props: DialectDetailsPropsInterface): React.ReactElement => {

    const { submitState, onSubmit, values } = props;

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
                label="Dialect URI"
                required={ true }
                requiredErrorMessage="Enter a dialect URI"
                placeholder="Enter a dialect URI"
                value={ values?.get("dialectURI")?.toString() }
            />
        </Forms >
    )
};
