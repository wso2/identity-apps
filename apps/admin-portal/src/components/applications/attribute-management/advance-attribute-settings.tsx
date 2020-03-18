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
import { Field, Forms } from "@wso2is/forms";
import { Divider, Grid } from "semantic-ui-react";
import { Heading, Hint } from "@wso2is/react-components";
import { AdvanceSettingsSubmissionInterface } from "./attribute-settings";
import { RoleConfigInterface, SubjectConfigInterface } from "../../../models";

interface AdvanceAttributeSettingsPropsInterface {
    dropDownOptions: any;
    setSubmissionValues: any;
    triggerSubmission: boolean;
    initialSubject: SubjectConfigInterface;
    initialRole: RoleConfigInterface;
}

export const AdvanceAttributeSettings: FunctionComponent<AdvanceAttributeSettingsPropsInterface> = (
    props
): ReactElement => {

    const {
        dropDownOptions,
        setSubmissionValues,
        triggerSubmission,
        initialSubject,
        initialRole
    } = props;

    const submitValues = (values) => {
        const settingValues: AdvanceSettingsSubmissionInterface = {
            subject: {
                claim: values.get("subjectAttribute"),
                includeTenantDomain: values.get("subjectIncludeTenantDomain").includes("includeTenantDomain"),
                includeUserDomain: values.get("subjectIncludeUserDomain").includes("includeUserDomain"),
                useMappedLocalSubject: values.get("subjectUseMappedLocalSubject").includes("useMappedLocalSubject")
            },
            role: {
                claim: values.get("roleAttribute"),
                includeUserDomain: values.get("role").includes("includeUserDomain"),
                mappings: []
            }
        };
        setSubmissionValues(settingValues);
    };

    return (
        initialRole && initialSubject &&
        <Forms
            onSubmit={ (values) => {
                submitValues(values);
            } }
            submitState={ triggerSubmission }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Divider/>
                        <Divider hidden/>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Subject</Heading>
                        <Hint>Subject related configurations</Hint>
                        <Divider hidden/>
                        <Field
                            name="subjectAttribute"
                            label="Subject Attribute"
                            required={ false }
                            requiredErrorMessage="this is needed"
                            type="dropdown"
                            value={ initialSubject?.claim?.uri }
                            placeholder="select the attribute"
                            children={ dropDownOptions }
                        />
                        <Hint>
                            Choose the attribute
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="subjectIncludeUserDomain"
                            label=""
                            type="checkbox"
                            required={ false }
                            value={ initialSubject?.includeUserDomain ? ["includeUserDomain"] : [] }
                            requiredErrorMessage="This is needed"
                            children={
                                [
                                    {
                                        label: "Include UserDomain",
                                        value: "includeUserDomain"
                                    }
                                ]
                            }
                        />
                        <Hint>This option will append the user store domain that the user resides in
                            the local subject identifier</Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="subjectIncludeTenantDomain"
                            label=""
                            type="checkbox"
                            required={ false }
                            value={ initialSubject?.includeTenantDomain ? ["includeTenantDomain"] : [] }
                            requiredErrorMessage="This is needed"
                            children={
                                [
                                    {
                                        label: "Include TenantDomain",
                                        value: "includeTenantDomain"
                                    }
                                ]
                            }
                        />
                        <Hint>
                            This option will append the tenant domain to the local subject identifier
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="subjectUseMappedLocalSubject"
                            label=""
                            type="checkbox"
                            required={ false }
                            value={ initialSubject?.useMappedLocalSubject ? ["useMappedLocalSubject"] : [] }
                            requiredErrorMessage="This is needed"
                            children={
                                [
                                    {
                                        label: "Use Mapped Local Subject",
                                        value: "useMappedLocalSubject"
                                    }
                                ]
                            }
                        />
                        <Hint>
                            This option will use the local subject identifier when asserting the identity
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Divider/>
                        <Divider hidden/>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Role</Heading>
                        <Hint>Role related configurations</Hint>
                        <Divider hidden/>
                        <Field
                            name="roleAttribute"
                            label="Role Attribute"
                            required={ false }
                            requiredErrorMessage="this is needed"
                            type="dropdown"
                            value={ initialRole?.claim?.uri }
                            placeholder="select the attribute"
                            children={ dropDownOptions }
                        />
                        <Hint>
                            Choose the attribute
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="role"
                            label=""
                            type="checkbox"
                            required={ false }
                            value={ initialRole?.includeUserDomain ? ["includeUserDomain"] : [] }
                            requiredErrorMessage="This is needed"
                            children={
                                [
                                    {
                                        label: "Include UserDomain",
                                        value: "includeUserDomain"
                                    }
                                ]
                            }
                        />
                        <Hint>This option will append the user store domain that the user resides to role</Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
