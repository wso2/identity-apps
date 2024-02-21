/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { Code, Heading, Hint, Text } from "@wso2is/react-components";
import useUIConfig from "modules/common/src/hooks/use-ui-configs";
import React, { Dispatch, FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Checkbox, CheckboxProps, Divider } from "semantic-ui-react";
import { DropdownOptionsInterface } from "./attribute-settings";
import { applicationConfig } from "../../../../../extensions";
import { ApplicationManagementConstants } from "../../../constants";
import {
    AdvanceAttributeSettingsErrorValidationInterface,
    ClaimConfigurationInterface,
    InboundProtocolListItemInterface,
    OIDCDataInterface,
    RoleConfigInterface,
    RoleInterface,
    SubjectConfigInterface,
    SubjectInterface,
    SubjectTypes
} from "../../../models";

interface AdvanceAttributeSettingsPropsInterface extends TestableComponentInterface {
    claimConfigurations: ClaimConfigurationInterface;
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
    onlyOIDCConfigured?: boolean;
    oidcInitialValues?: OIDCDataInterface;
}

export const SubjectAttributeFieldName: string = "subjectAttribute";

const FORM_ID: string = "application-attributes-advance-settings-form";

/**
 * Advanced attribute settings component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AdvanceAttributeSettings: FunctionComponent<AdvanceAttributeSettingsPropsInterface> = (
    props: AdvanceAttributeSettingsPropsInterface
): ReactElement => {

    const {
        applicationTemplateId,
        claimConfigurations,
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
        oidcInitialValues,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const dispatch: Dispatch<any> = useDispatch();

    const [ selectedSubjectValue, setSelectedSubjectValue ] = useState<string>();
    const [ selectedSubjectValueLocalClaim, setSelectedSubjectValueLocalClaim ] =
        useState<string>();
    const [ selectedSubjectType, setSelectedSubjectType ] = useState(oidcInitialValues?.subject ?
        oidcInitialValues.subject.subjectType : SubjectTypes.PUBLIC);
    const [ showSubjectAttribute, setShowSubjectAttribute ] = useState<boolean>(false);

    useEffect(() => {
        if (claimMappingOn && dropDownOptions && dropDownOptions.length > 0) {
            if (selectedSubjectValueLocalClaim) {
                const index: number = dropDownOptions.findIndex(
                    (option: DropdownOptionsInterface) => option?.key === selectedSubjectValueLocalClaim
                );

                if (index > -1) {
                    setSelectedSubjectValue(dropDownOptions[ index ]?.value);
                } else {
                    const defaultSubjectClaimIndex: number =
                        dropDownOptions.findIndex(
                            (option: DropdownOptionsInterface) => option?.key === defaultSubjectAttribute
                        );

                    setSelectedSubjectValue(
                        defaultSubjectClaimIndex > -1
                            ? dropDownOptions[ defaultSubjectClaimIndex ]?.value
                            : dropDownOptions[ 0 ]?.value
                    );
                }
            } else if (selectedSubjectValue) {
                const subjectValueLocalMapping: string =
                    dropDownOptions.find(
                        (option: DropdownOptionsInterface) => option?.value === selectedSubjectValue
                    )?.key;

                if (subjectValueLocalMapping) {
                    setSelectedSubjectValueLocalClaim(subjectValueLocalMapping);
                    setSelectedSubjectValue(selectedSubjectValue);
                }
            } else {
                setSelectedSubjectValue(initialSubject?.claim?.uri || dropDownOptions[ 0 ]?.value);
            }
        } else if (selectedSubjectValue) {
            if (dropDownOptions && dropDownOptions.length > 0 &&
                dropDownOptions.findIndex(
                    (option: DropdownOptionsInterface) => option?.value === selectedSubjectValue
                ) < 0) {
                setSelectedSubjectValue(defaultSubjectAttribute);
            }
        } else {
            setSelectedSubjectValue(initialSubject?.claim?.uri || dropDownOptions[ 0 ]?.value);
        }
    }, [ dropDownOptions ]);

    useEffect(() => {
        if (!selectedSubjectType) {
            setSelectedSubjectType(SubjectTypes.PUBLIC);
        }
    }, []);

    useEffect(() => {
        if(selectedSubjectValue) {
            setSelectedValue(selectedSubjectValue);
            setShowSubjectAttribute(selectedSubjectValue !== defaultSubjectAttribute);
        }
    }, [ selectedSubjectValue ]);

    useEffect(() => {
        if (selectedSubjectValue && dropDownOptions) {
            const subjectValueLocalMapping: string =
                dropDownOptions.find(
                    (option: DropdownOptionsInterface) => option?.value === selectedSubjectValue
                )?.key;

            setSelectedSubjectValueLocalClaim(subjectValueLocalMapping);
        }
    }, [ selectedSubjectValue ]);

    /**
     * Check whether initial value is exist in dropdown list.
     */
    const getDefaultDropDownValue = ((
        options: DropdownOptionsInterface[],
        checkValue: string
    ): string => {
        const dropDownOptions: DropdownOptionsInterface[] = options as DropdownOptionsInterface[];
        let claimURI: string = "";

        dropDownOptions.map((option: DropdownOptionsInterface) => {
            if (option.value === checkValue) {
                claimURI = checkValue;
            }
        });

        return claimURI;
    });

    const validateForm = (values: Record<string, string>): AdvanceAttributeSettingsErrorValidationInterface => {

        const errors: AdvanceAttributeSettingsErrorValidationInterface = {
            sectorIdentifierURI: undefined
        };

        if (values?.sectorIdentifierURI && !URLUtils.isHttpsUrl(values.sectorIdentifierURI)) {
            errors.sectorIdentifierURI= t("console:develop.features.applications.forms.advancedAttributeSettings" +
                ".sections.subject.fields.sectorIdentifierURI.validations.invalid");
        }

        return errors;
    };

    const submitValues = (values: Record<string, any>) => {

        if (!!values.mandateLinkedLocalAccount && !values.validateLinkedLocalAccount) {
            dispatch(addAlert({
                description: t("console:develop.features.applications.forms.advancedAttributeSettings." +
                "sections.linkedAccounts.errorAlert.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.applications.forms.advancedAttributeSettings." +
                "sections.linkedAccounts.errorAlert.message")
            }));

            return;
        }
        const settingValues: {
            role: RoleInterface;
            subject: SubjectInterface
            oidc: OIDCDataInterface
        } = {
            oidc: {
                ...oidcInitialValues,
                subject: {
                    sectorIdentifierUri: values.sectorIdentifierURI,
                    subjectType: selectedSubjectType
                }
            },
            role: {
                claim: getDefaultDropDownValue(dropDownOptions, values.roleAttribute),
                includeUserDomain: !!values.role,
                mappings: []
            },
            subject: {
                claim: getDefaultDropDownValue(dropDownOptions, values.subjectAttribute),
                includeTenantDomain: !!values.subjectIncludeTenantDomain,
                includeUserDomain: !!values.subjectIncludeUserDomain,
                mappedLocalSubjectMandatory: !!values.mandateLinkedLocalAccount,
                useMappedLocalSubject: !!values.validateLinkedLocalAccount
            }
        };

        const config: {
            showIncludeTenantDomain: boolean;
            showIncludeUserstoreDomainRole: boolean;
            showIncludeUserstoreDomainSubject: boolean;
            showMandateLinkedLocalAccount: boolean;
            showRoleAttribute: boolean;
            showRoleMapping: boolean;
            showValidateLinkedLocalAccount: boolean;
            showSubjectAttribute: boolean;
        } = applicationConfig.attributeSettings.advancedAttributeSettings;

        !config.showIncludeUserstoreDomainSubject && delete settingValues.subject.includeUserDomain;
        !config.showIncludeTenantDomain && delete settingValues.subject.includeTenantDomain;
        !config.showValidateLinkedLocalAccount && delete settingValues.subject.useMappedLocalSubject;
        !config.showMandateLinkedLocalAccount && delete settingValues.subject.mappedLocalSubjectMandatory;

        !config.showRoleMapping && delete settingValues.role.mappings;
        !config.showIncludeUserstoreDomainRole && settingValues.role.includeUserDomain;
        !config.showRoleAttribute && delete settingValues.role.claim;

        // Assign default subject attribute, if the subject attribute property from the payload is undefined or empty,
        // as sending an empty value for subject results in issues.
        // Ref: https://github.com/wso2/product-is/issues/19054
        if (!settingValues?.subject?.claim || settingValues?.subject?.claim === "") {
            settingValues.subject.claim = claimConfigurations.subject.claim.uri;
        }

        setSubmissionValues(settingValues);
    };

    const subjectAttributeChangeListener = (subjectAttributeFieldName: string): void => {
        if(subjectAttributeFieldName) {
            setSelectedSubjectValue(subjectAttributeFieldName?.toString());
        } else {
            setSelectedSubjectValue(subjectAttributeFieldName);
        }
    };

    /**
     * This function resolves the hidden status of the subject attribute section.
     * @returns The hidden status.
     */
    const resolveSubjectAttributeHiddenStatus = (): boolean => {
        return (
            !applicationConfig.attributeSettings.advancedAttributeSettings.showSubjectAttribute ||
            (onlyOIDCConfigured && !UIConfig?.legacyMode?.applicationOIDCSubjectIdentifier) ||
            (onlyOIDCConfigured && !showSubjectAttribute)
        );
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
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    initialValues={
                        !onlyOIDCConfigured &&
                        {
                            oidcInitialValues: oidcInitialValues,
                            subjectAttribute: selectedSubjectValue
                        }
                    }
                    validate={ validateForm }
                    onSubmit={ (values: Record<string, any>) => {
                        submitValues(values);
                    } }
                    triggerSubmit={ (submitFunction: FormEvent<HTMLFormElement>) => triggerSubmission(submitFunction) }
                >
                    <Divider />
                    <Heading
                        hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                            .showSubjectAttribute }
                        as="h4"
                    >
                        { t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.subject.heading") }
                    </Heading>
                    { onlyOIDCConfigured && (
                        <>
                            <Checkbox
                                ariaLabel={ t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                    "sections.subject.fields.alternateSubjectAttribute.label") }
                                data-componentid={ `${ testId }-reassign-subject-attribute-checkbox` }
                                checked={ showSubjectAttribute }
                                label={ t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                    "sections.subject.fields.alternateSubjectAttribute.label") }
                                onClick={ (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
                                    setShowSubjectAttribute(data?.checked) }
                                disabled={ readOnly }
                            />
                            <Hint>
                                <Trans
                                    i18nKey={ t("console:develop.features.applications.forms." +
                                        "advancedAttributeSettings.sections.subject.fields.alternateSubjectAttribute." +
                                        "hint") }
                                >
                                    This option will allow to use an alternate attribute as the subject identifier
                                    instead of the <Code withBackground>userid</Code>.
                                </Trans>
                            </Hint>
                        </>
                    ) }
                    <Field.Dropdown
                        ariaLabel="Subject attribute"
                        name="subjectAttribute"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.subjectAttribute.label")
                        }
                        required={ claimMappingOn }
                        value={ selectedSubjectValue }
                        options={ dropDownOptions }
                        hidden={ resolveSubjectAttributeHiddenStatus() }
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
                        hidden={ resolveSubjectAttributeHiddenStatus() }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.subjectIncludeUserDomain.hint")
                        }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Subject include tenant domain"
                        name="subjectIncludeTenantDomain"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.subjectIncludeTenantDomain.label")
                        }
                        required={ false }
                        value={ initialSubject?.includeTenantDomain ? [ "includeTenantDomain" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-subject-include-tenant-domain-checkbox` }
                        hidden={ resolveSubjectAttributeHiddenStatus() }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.subjectIncludeTenantDomain.hint")
                        }
                    />
                    <Divider hidden />
                    { onlyOIDCConfigured && (
                        <div>
                            <Text>
                                {
                                    t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                        ".sections.subject.fields.subjectType.label")
                                }
                            </Text>
                            {
                                Object.keys(SubjectTypes)
                                    .map((subjectTypeKey: SubjectTypes, index: number) => {
                                        const subjectType: SubjectTypes
                                            = SubjectTypes[subjectTypeKey];

                                        return (
                                            <>
                                                <Field.Radio
                                                    key={ index }
                                                    ariaLabel={ `Subject type ${subjectType}` }
                                                    name={ "subjectType" }
                                                    value={ subjectType }
                                                    label={ t("console:develop.features.applications.forms" +
                                                        ".advancedAttributeSettings.sections.subject.fields" +
                                                        ".subjectType." + subjectType + ".label") }
                                                    hint={ subjectType === SubjectTypes.PAIRWISE &&
                                                            t("console:develop.features.applications.forms" +
                                                        ".advancedAttributeSettings.sections.subject.fields" +
                                                        ".subjectType." + subjectType + ".hint") }
                                                    checked={ selectedSubjectType === subjectType }
                                                    listen={ () => {
                                                        setSelectedSubjectType(subjectType);
                                                    } }
                                                    readOnly={ readOnly }
                                                />
                                            </>
                                        );
                                    })
                            }
                        </div>
                    ) }
                    { selectedSubjectType === SubjectTypes.PAIRWISE && (
                        <Field.Input
                            ariaLabel="Sector Identifier URI"
                            inputType="url"
                            name="sectorIdentifierURI"
                            label={ t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.sectorIdentifierURI.label")
                            }
                            required={ false }
                            placeholder={
                                t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                    ".sections.subject.fields.sectorIdentifierURI.placeholder")
                            }
                            hint={ t("console:develop.features.applications.forms.advancedAttributeSettings" +
                                ".sections.subject.fields.sectorIdentifierURI.hint") }
                            readOnly={ readOnly }
                            maxLength={ 200 }
                            minLength={ 3 }
                            width={ 16 }
                            initialValue={ oidcInitialValues?.subject?.sectorIdentifierUri }
                        />
                    )
                    }
                    { applicationConfig.attributeSettings.advancedAttributeSettings
                        .isLinkedAccountsEnabled(applicationTemplateId) &&
                        (<>
                            <Divider />
                            <Heading
                                as="h4"
                            >
                                { t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                    "sections.linkedAccounts.heading") }
                            </Heading>
                        </>)
                    }
                    { !applicationConfig.attributeSettings.advancedAttributeSettings.showMandateLinkedLocalAccount ?
                        (<Field.CheckboxLegacy
                            ariaLabel="Validate linked local account"
                            name="validateLinkedLocalAccount"
                            label={
                                t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                "sections.linkedAccounts.fields.validateLocalAccount.label")
                            }
                            required={ false }
                            value={
                                initialSubject?.useMappedLocalSubject
                                    ? [ "useMappedLocalSubject" ]
                                    : []
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-validate-linked-local-account-checkbox` }
                            hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                                .isLinkedAccountsEnabled(applicationTemplateId) ||
                                !applicationConfig.attributeSettings.advancedAttributeSettings
                                    .showValidateLinkedLocalAccount
                            }
                            hint={ t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.linkedAccounts.fields.validateLocalAccount.hint") }
                        />):
                        (<Field.CheckboxLegacy
                            ariaLabel="Validate linked local account"
                            name="validateLinkedLocalAccount"
                            label={
                                t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                "sections.linkedAccounts.fields.validateLocalAccount.label")
                            }
                            required={ false }
                            value={
                                initialSubject?.useMappedLocalSubject
                                    ? [ "useMappedLocalSubject" ]
                                    : []
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-validate-linked-local-account-checkbox` }
                            hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                                .isLinkedAccountsEnabled(applicationTemplateId) ||
                                !applicationConfig.attributeSettings.advancedAttributeSettings
                                    .showValidateLinkedLocalAccount
                            }
                        />)
                    }
                    <Field.CheckboxLegacy
                        ariaLabel="Mandate linked local account"
                        name="mandateLinkedLocalAccount"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings." +
                            "sections.linkedAccounts.fields.mandateLocalAccount.label")
                        }
                        required={ false }
                        value={
                            initialSubject?.mappedLocalSubjectMandatory
                                ? [ "mappedLocalSubjectMandatory" ]
                                : []
                        }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-mandate-linked-local-account-checkbox` }
                        hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                            .isLinkedAccountsEnabled(applicationTemplateId) ||
                            !applicationConfig.attributeSettings.advancedAttributeSettings
                                .showMandateLinkedLocalAccount
                        }
                        hint={ t("console:develop.features.applications.forms.advancedAttributeSettings." +
                        "sections.linkedAccounts.fields.mandateLocalAccount.hint") }
                    />
                    <Divider
                        hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                            .showRoleAttribute || !UIConfig?.legacyMode?.roleMapping }
                    />
                    {
                        applicationConfig.attributeSettings.advancedAttributeSettings.showRoleAttribute &&
                        UIConfig?.legacyMode?.roleMapping && (
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
                        options={ dropDownOptions }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-role-attribute-dropdown` }
                        hidden={  !applicationConfig.attributeSettings.advancedAttributeSettings
                            .showRoleAttribute || !UIConfig?.legacyMode?.roleMapping }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                "sections.role.fields.roleAttribute.hint")
                        }
                    />
                    <Field.CheckboxLegacy
                        ariaLabel="Role"
                        name="role"
                        label={
                            t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                "sections.role.fields.role.label")
                        }
                        required={ false }
                        value={ initialRole?.includeUserDomain ? [ "includeUserDomain" ] : [] }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-role-checkbox` }
                        hidden={ !applicationConfig.attributeSettings.advancedAttributeSettings
                            .showIncludeUserstoreDomainRole ||
                            !UIConfig?.legacyMode?.roleMapping }
                        hint={
                            t("console:develop.features.applications.forms.advancedAttributeSettings." +
                                "sections.role.fields.role.hint")
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
