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
import { Field, Forms, FormValue } from "@wso2is/forms";
import { Divider, Grid } from "semantic-ui-react";
import { Heading, Hint } from "@wso2is/react-components";
import { IdentityProviderClaimInterface } from "../../../../models";

interface AdvanceAttributeSettingsPropsInterface {
    dropDownOptions: any;
    initialSubject: IdentityProviderClaimInterface;
    initialRole: IdentityProviderClaimInterface;
    claimMappingOn: boolean;
    updateRole: (roleUri: string) => void;
    updateSubject: (subjectUri: string) => void;
}

export const AdvanceAttributeSettings: FunctionComponent<AdvanceAttributeSettingsPropsInterface> = (
    props
): ReactElement => {

    const {
        dropDownOptions,
        initialSubject,
        initialRole,
        claimMappingOn,
        updateRole,
        updateSubject
    } = props;

    return (
        <Forms>
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Divider/>
                        <Divider hidden/>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Subject</Heading>
                        <Divider hidden/>
                        <Field
                            name="subjectAttribute"
                            label="Subject attribute"
                            required={ claimMappingOn }
                            requiredErrorMessage="Select the subject attribute"
                            type="dropdown"
                            value={ initialSubject?.uri || dropDownOptions[0]?.value }
                            children={ dropDownOptions }
                            listen={
                                (values) => {
                                    updateSubject(values.get("subjectAttribute").toString())
                                }
                            }
                        />
                        <Hint>
                            Specifies the attribute that identifies the user at the identity provider
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    claimMappingOn &&
                    <Grid.Row columns={ 2 } >
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Divider/>
                            <Divider hidden/>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Heading as="h5">Role</Heading>
                            <Divider hidden/>
                            <Field
                                name="roleAttribute"
                                label="Role attribute"
                                required={ claimMappingOn }
                                requiredErrorMessage="Select the role attribute"
                                type="dropdown"
                                value={ initialRole?.uri || dropDownOptions[0]?.value }
                                children={ dropDownOptions }
                                listen={
                                    (values) => {
                                        updateRole(values.get("roleAttribute").toString())
                                    }
                                }
                            />
                            <Hint>
                                Specifies the attribute that identifies the Roles at the Identity Provider
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Forms>
    )
};
