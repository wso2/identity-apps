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
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { DropdownOptionsInterface } from "./attribute-settings";
import { RoleConfigInterface, SubjectConfigInterface } from "../../../../models";

interface AdvanceAttributeSettingsPropsInterface extends TestableComponentInterface {
    dropDownOptions: any;
    setSubmissionValues: any;
    triggerSubmission: boolean;
    initialSubject: SubjectConfigInterface;
    initialRole: RoleConfigInterface;
    claimMappingOn: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Advanced attribute settings component.
 *
 * @param {AdvanceAttributeSettingsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdvanceAttributeSettings: FunctionComponent<AdvanceAttributeSettingsPropsInterface> = (
    props: AdvanceAttributeSettingsPropsInterface
): ReactElement => {

    const {
        dropDownOptions,
        setSubmissionValues,
        triggerSubmission,
        initialSubject,
        initialRole,
        claimMappingOn,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Check whether initial value is exist in dropdown list.
     */
    const getDefaultDropDownValue = ((options, checkValue): string => {
        const dropDownOptions: DropdownOptionsInterface[] = options as DropdownOptionsInterface[];
        let claimURI = "";
        dropDownOptions.map((option) => {
            if (option.value === checkValue) {
                claimURI = checkValue
            }
        });
        return claimURI;
    });

    const submitValues = (values) => {
        const settingValues = {
            role: {
                claim: getDefaultDropDownValue(dropDownOptions, values.get("roleAttribute")),
                includeUserDomain: values.get("role").includes("includeUserDomain"),
                mappings: []
            },
            subject: {
                claim: getDefaultDropDownValue(dropDownOptions, values.get("subjectAttribute")),
                includeTenantDomain: values.get("subjectIncludeTenantDomain").includes("includeTenantDomain"),
                includeUserDomain: values.get("subjectIncludeUserDomain").includes("includeUserDomain"),
                useMappedLocalSubject: values.get("subjectUseMappedLocalSubject").includes("useMappedLocalSubject")
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
                        <Divider hidden/>
                        <Field
                            name="subjectAttribute"
                            label="Subject attribute"
                            required={ claimMappingOn }
                            requiredErrorMessage="Select the subject attribute"
                            type="dropdown"
                            value={ initialSubject?.claim?.uri || dropDownOptions[0]?.value }
                            children={ dropDownOptions }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-subject-attribute-dropdown` }
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
                                        label: "Include userDomain",
                                        value: "includeUserDomain"
                                    }
                                ]
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-subject-iInclude-user-domain-checkbox` }
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
                                        label: "Include tenantDomain",
                                        value: "includeTenantDomain"
                                    }
                                ]
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-subject-include-tenant-domain-checkbox` }
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
                                        label: "Use mapped local subject",
                                        value: "useMappedLocalSubject"
                                    }
                                ]
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-subject-use-mapped-local-subject-checkbox` }
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
                        <Divider hidden/>
                        <Field
                            name="roleAttribute"
                            label="Role attribute"
                            required={ claimMappingOn }
                            requiredErrorMessage="Select the role attribute"
                            type="dropdown"
                            value={ initialRole?.claim?.uri }
                            children={ dropDownOptions }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-role-attribute-dropdown` }
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
                                        label: "Include userDomain",
                                        value: "includeUserDomain"
                                    }
                                ]
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-role-checkbox` }
                        />
                        <Hint>This option will append the user store domain that the user resides to role</Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};

/**
 * Default props for the application advanced attribute settings component.
 */
AdvanceAttributeSettings.defaultProps = {
    "data-testid": "application-advanced-attribute-settings-form"
};
