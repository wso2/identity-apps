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

import React, { FunctionComponent, ReactElement } from "react";
import { Forms, Field } from "@wso2is/forms";
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import { CreateRoleFormData } from "../../../../src/models";

/**
 * Interface to capture role basics props.
 */
interface RoleBasicProps {
    dummyProp?: string;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Component to capture basic details of a new role.
 * 
 * @param props Role Basic prop types
 */
export const RoleBasics: FunctionComponent<RoleBasicProps> = (props: RoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit
    } = props;

    /**
     * Contains domains needed for role creation.
     * 
     * Note : Since primary domain is available all time, 
     *        hardcoded in the dropdown elements.
     * 
     * TODO : Discuss and add or remove the Hybrid domains 
     *        to the dropdown.
    */
    const roleDomains = [{
        key: 'p', text: 'Primary', value: 'primary',
    }];

    /**
     * Util method to collect form data for processing.
     * 
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateRoleFormData => {
        return {
            domain: values.get("domain").toString(),
            roleName: values.get("rolename").toString()
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
                            type="dropdown"
                            label="Domain"
                            name="domain"
                            children={ roleDomains }
                            placeholder="Domain"
                            requiredErrorMessage="Select Domain"
                            required={ true }
                            element={ <div></div> }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="rolename"
                            label="Role Name"
                            placeholder="Enter Role Name"
                            required={ true }
                            requiredErrorMessage="Role Name is required to proceed."
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
}
