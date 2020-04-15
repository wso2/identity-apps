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

import React, { ReactElement, FunctionComponent } from "react";
import { Forms, Field } from "@wso2is/forms";
import { Grid, GridRow, GridColumn } from "semantic-ui-react";

/**
 * Interface to capture role basics props.
 */
interface AddEmailTemplateTypeProps {
    onSubmit: (values: any) => void;
}

export const AddEmailTemplateType: FunctionComponent<AddEmailTemplateTypeProps> = (
    props: AddEmailTemplateTypeProps
): ReactElement => {

    const {
        onSubmit
    } = props;

    /**
     * Util method to collect form data for processing.
     * 
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): any => {
        return {
            templateType: values.get("templatetype").toString(),
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
        >
             <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="templatetype"
                            label="Email Template Type"
                            placeholder="Enter Template Type"
                            required={ true }
                            requiredErrorMessage="Template Type is required to proceed."
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
}
