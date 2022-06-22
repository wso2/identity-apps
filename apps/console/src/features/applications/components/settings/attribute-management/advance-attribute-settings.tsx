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
import { Field, Form } from "@wso2is/form";
import { Code, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { DropdownOptionsInterface } from "./attribute-settings";
import { applicationConfig } from "../../../../../extensions";
import { ApplicationManagementConstants } from "../../../constants";
import {
    InboundProtocolListItemInterface,
    RoleConfigInterface,
    RoleInterface,
    SubjectConfigInterface,
    SubjectInterface
} from "../../../models";

interface AdvanceAttributeSettingsPropsInterface extends TestableComponentInterface {
    dropDownOptions: any;
    setSubmissionValues: any;
    setSelectedValue: any;
    defaultSubjectAttribute: string;
    triggerSubmission: any;
    initialSubject: SubjectConfigInterface;
    initialRole: RoleConfigInterface;
    claimMappingOn: boolean;
    technology: InboundProtocolListItemInterface[];
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    applicationTemplateId?: string;
    onlyOIDCConfigured?:boolean;
}

export const SubjectAttributeFieldName = "subjectAttribute";

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
        applicationTemplateId,
        dropDownOptions,
        setSubmissionValues,
        setSelectedValue,
        defaultSubjectAttribute,
        triggerSubmission,
        initialSubject,
        initialRole,
        claimMappingOn,
        readOnly,
        technology,
        onlyOIDCConfigured,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ selectedSubjectValue, setSelectedSubjectValue ] = useState<string>();
    const [ selectedSubjectValueLocalClaim, setSelectedSubjectValueLocalClaim ] =
        useState<string>();

    useEffect(() => {
        if (claimMappingOn && dropDownOptions && dropDownOptions.length > 0) {
            if (selectedSubjectValueLocalClaim) {
                const index = dropDownOptions.findIndex(option => option?.key === selectedSubjectValueLocalClaim);

                if (index > -1) {
                    setSelectedSubjectValue(dropDownOptions[ index ]?.value);
                } else {
                    const defaultSubjectClaimIndex =
                        dropDownOptions.findIndex(option => option?.key === defaultSubjectAttribute);

                    setSelectedSubjectValue(
                        defaultSubjectClaimIndex > -1
                            ? dropDownOptions[ defaultSubjectClaimIndex ]?.value
                            : dropDownOptions[ 0 ]?.value
                    );
                }
            } else if (selectedSubjectValue) {
                const subjectValueLocalMapping =
                    dropDownOptions.find(option => option?.value === selectedSubjectValue)?.key;

                if (subjectValueLocalMapping) {
                    setSelectedSubjectValueLocalClaim(subjectValueLocalMapping);
                    setSelectedSubjectValue(selectedSubjectValue);
                }
            } else {
                setSelectedSubjectValue(initialSubject?.claim?.uri || dropDownOptions[ 0 ]?.value);
            }
        } else if (selectedSubjectValue) {
            if (dropDownOptions && dropDownOptions.length > 0 &&
                dropDownOptions.findIndex(option => option?.value === selectedSubjectValue) < 0) {
                setSelectedSubjectValue(defaultSubjectAttribute);
            }
        } else {
            setSelectedSubjectValue(initialSubject?.claim?.uri || dropDownOptions[ 0 ]?.value);
        }
    }, [ dropDownOptions ]);

    useEffect(() => {
        if(selectedSubjectValue) {
            setSelectedValue(selectedSubjectValue);
        }
    }, [ selectedSubjectValue ]);

    useEffect(() => {
        if (selectedSubjectValue && dropDownOptions) {
            const subjectValueLocalMapping =
                dropDownOptions.find(option => option?.value === selectedSubjectValue)?.key;

            setSelectedSubjectValueLocalClaim(subjectValueLocalMapping);
        }
    }, [ selectedSubjectValue ]);

    /**
     * Check whether initial value is exist in dropdown list.
     */
    const getDefaultDropDownValue = ((options, checkValue): string => {
        const dropDownOptions: DropdownOptionsInterface[] = options as DropdownOptionsInterface[];
        let claimURI = "";

        dropDownOptions.map((option) => {
            if (option.value === checkValue) {
                claimURI = checkValue;
            }
        });

        return claimURI;
    });

    const submitValues = (values) => {

        const settingValues: {
            role: RoleInterface;
            subject: SubjectInterface
        } = {
            role: {
                claim: getDefaultDropDownValue(dropDownOptions, values.roleAttribute),
                includeUserDomain: !!values.role,
                mappings: []
            },
            subject: {
                claim: getDefaultDropDownValue(dropDownOptions, values.subjectAttribute),
                includeTenantDomain: !!values.subjectIncludeTenantDomain,
                includeUserDomain: !!values.subjectIncludeUserDomain,
                useMappedLocalSubject: !!values.subjectUseMappedLocalSubject
            }
        };

        const config = applicationConfig.attributeSettings.advancedAttributeSettings;

        !config.showIncludeUserstoreDomainSubject && delete settingValues.subject.includeUserDomain;
        !config.showIncludeTenantDomain && delete settingValues.subject.includeTenantDomain;
        !config.showUseMappedLocalSubject && delete settingValues.subject.useMappedLocalSubject;

        !config.showRoleMapping && delete settingValues.role.mappings;
        !config.showIncludeUserstoreDomainRole && settingValues.role.includeUserDomain;
        !config.showRoleAttribute && delete settingValues.role.claim;

        setSubmissionValues(settingValues);
    };

    const subjectAttributeChangeListener = (subjectAttributeFieldName: string): void => {
        if(subjectAttributeFieldName) {
            setSelectedSubjectValue(subjectAttributeFieldName?.toString());
        } else {
            setSelectedSubjectValue(subjectAttributeFieldName);
        }
    };

    const resolveSubjectAttributeHint = (): ReactElement => {
        if (
            technology.length === 1
            || applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            || applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
        ) {
            if (
                technology[0]?.type === "oauth2"
                || applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            ) {

                return (
                    <Hint compact>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                                ".subject.fields.subjectAttribute.hintOIDC"
                            }
                        >
                            Select which of the shared attributes you want to use as the subject identifier of the
                            user. This represents the <Code withBackground>sub</Code> claim of the
                            <Code withBackground>id_token</Code>.
                        </Trans>
                    </Hint>
                );
            } else if (technology[0]?.type === "samlsso"
                || applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML)
                return (
                    <Hint compact>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                                ".subject.fields.subjectAttribute.hintSAML"
                            }
                        >
                            Select which of the shared attributes you want to use as the subject identifier of the
                            user. This represents the <Code withBackground>subject</Code> element of the SAML
                            assertion.
                        </Trans>
                    </Hint>
                );
        } else {

            return (
                <Hint compact>
                    { t("console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                        ".subject.fields.subjectAttribute.hint") }
                </Hint>
            );
        }

        return (
            <Hint compact>
                { t("console:develop.features.applications.forms.advancedAttributeSettings.sections" +
                    ".subject.fields.subjectAttribute.hint") }
            </Hint>
        );
    };

    return (
        (initialRole && initialSubject)
            ? (
                <Form
                    uncontrolledForm={ false }
                    initialValues={
                        !onlyOIDCConfigured &&
                        { subjectAttribute: selectedSubjectValue }
                    }
                    onSubmit={ (values) => {
                        submitValues(values);
                    } }
                    triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                >
                    <Heading
                        hidden={
                            onlyOIDCConfigured &&
                            !applicationConfig.attributeSettings.advancedAttributeSettings.showSubjectAttribute
                        }
                        as="h4"
                    >
                        { t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.subject.heading") }
                    </Heading>
                    <Divider hidden/>
                    <Field.Dropdown
                        ariaLabel="Subject attribute"
                        name="subjectAttribute"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.subjectAttribute.label")
                        }
                        required={ claimMappingOn }
                        value={ selectedSubjectValue }
                        children={ dropDownOptions }
                        hidden={
                            onlyOIDCConfigured &&
                            !applicationConfig.attributeSettings.advancedAttributeSettings.showSubjectAttribute
                        }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-subject-attribute-dropdown` }
                        listen={ subjectAttributeChangeListener }
                        enableReinitialize={ true }
                        hint={ resolveSubjectAttributeHint() }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Subject include user domain"
                        name="subjectIncludeUserDomain"
                        label={ t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.subject.fields.subjectIncludeUserDomain.label") }
                        required={ false }
                        value={ initialSubject?.includeUserDomain ? [ "includeUserDomain" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-subject-iInclude-user-domain-checkbox` }
                        hidden={
                            !applicationConfig.attributeSettings.advancedAttributeSettings.
                                showIncludeUserstoreDomainSubject
                        }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "subject.fields.subjectIncludeUserDomain.hint")
                        }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Subject include tenant domain"
                        name="subjectIncludeTenantDomain"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "subject.fields.subjectIncludeTenantDomain.label")
                        }
                        required={ false }
                        value={ initialSubject?.includeTenantDomain ? [ "includeTenantDomain" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-subject-include-tenant-domain-checkbox` }
                        hidden={
                            !applicationConfig.attributeSettings.advancedAttributeSettings.showIncludeTenantDomain
                        }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                            "subject.fields.subjectIncludeTenantDomain.hint")
                        }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Subject use mapped local subject"
                        name="subjectUseMappedLocalSubject"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "subject.fields.subjectUseMappedLocalSubject.label")
                        }
                        required={ false }
                        value={
                            initialSubject?.useMappedLocalSubject
                                ? [ "useMappedLocalSubject" ]
                                : []
                        }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-subject-use-mapped-local-subject-checkbox` }
                        hidden={
                            !applicationConfig.attributeSettings.advancedAttributeSettings.showUseMappedLocalSubject
                        }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.subject.fields.subjectUseMappedLocalSubject.hint")
                        }
                    />
                    {
                        applicationConfig.attributeSettings.advancedAttributeSettings.showRoleAttribute && (
                            <>
                                <Heading as="h4">
                                    { t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                        ".sections.role.heading") }
                                </Heading>
                            </>
                        )
                    }
                    <Field.Dropdown
                        ariaLabel="Role attribute"
                        name="roleAttribute"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.role.fields.roleAttribute.label")
                        }
                        required={ claimMappingOn }
                        value={ initialRole?.claim?.uri }
                        children={ dropDownOptions }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-role-attribute-dropdown` }
                        hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings.showRoleAttribute }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "role.fields.roleAttribute.hint")
                        }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Role"
                        name="role"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "role.fields.role.label")
                        }
                        required={ false }
                        value={ initialRole?.includeUserDomain ? [ "includeUserDomain" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-role-checkbox` }
                        hidden={
                            !applicationConfig.attributeSettings.advancedAttributeSettings
                                .showIncludeUserstoreDomainRole
                        }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings.sections." +
                                "role.fields.role.hint")
                        }
                    />
                </Form>
            ) : null
    );
};

/**
 * Default props for the application advanced attribute settings component.
 */
AdvanceAttributeSettings.defaultProps = {
    "data-testid": "application-advanced-attribute-settings-form"
};
