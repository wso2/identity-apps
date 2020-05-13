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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";

/**
 * Interface to capture role basics props.
 */
interface AddEmailTemplateTypePropsInterface extends TestableComponentInterface {
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
}

/**
 * Form component to capture template type data.
 *
 * @param {AddEmailTemplateTypePropsInterface} props - props required for template type form component
 *
 * @return {React.ReactElement}
 */
export const AddEmailTemplateType: FunctionComponent<AddEmailTemplateTypePropsInterface> = (
    props: AddEmailTemplateTypePropsInterface
): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Util method to collect form data for processing.
     * 
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): any => {
        return {
            templateType: values.get("templatetype").toString()
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
             <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="templatetype"
                            label="Template Type Name"
                            placeholder="Enter a template type name"
                            required={ true }
                            requiredErrorMessage="Template type name is required to proceed."
                            data-testid={ `${ testId }-type-input` }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
};

/**
 * Default props for the component.
 */
AddEmailTemplateType.defaultProps = {
    "data-testid": "add-email-template-type-form"
};
