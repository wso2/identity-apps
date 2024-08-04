/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import Link from "@oxygen-ui/react/Link";
import { PaletteIcon } from "@oxygen-ui/react-icons";
import { AppConstants, AppState, UIConfigInterface, history } from "@wso2is/admin.core.v1";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Hint,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { useMyAccountStatus } from "../../api";
import { ApplicationManagementConstants } from "../../constants";
import { ApplicationInterface } from "../../models";

/**
 * Proptypes for the applications general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Currently editing application id.
     */
    appId?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverability?: boolean;
    /**
     * Set of hidden fields.
     */
    hiddenFields?: string[];
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Specifies a Management Application
     */
    isManagementApp?: boolean;
    /**
     * Specifies whether having edit-permissions
     */
    hasRequiredScope?: boolean;
    /**
     * Application
     */
    application?: ApplicationInterface;
    /**
     * Is the Branding Section Hidden?
     */
    isBrandingSectionHidden?: boolean;
}

/**
 * Form values interface.
 */
export interface GeneralDetailsFormValuesInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverableByEndUsers?: boolean;
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
}

/**
 * Proptypes for the applications general details form error messages.
 */
export interface GeneralDetailsFormErrorValidationsInterface {
    /**
     *  Error message for the Application access URL.
     */
    accessUrl?: string;
}

const FORM_ID: string = "application-general-details";

/**
 * Form to edit general details of the application.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface
): ReactElement => {

    const {
        appId,
        name,
        description,
        discoverability,
        hiddenFields,
        imageUrl,
        accessUrl,
        onSubmit,
        readOnly,
        hasRequiredScope,
        isSubmitting,
        isManagementApp,
        application,
        isBrandingSectionHidden,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);

    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    const [ isM2MApplication, setM2MApplication ] = useState<boolean>(false);

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;
    const orgType: OrganizationType = useSelector((state: AppState) => state?.organization?.organizationType);
    const isSubOrganizationType: boolean = orgType === OrganizationType.SUBORGANIZATION;

    const {
        data: myAccountStatus,
        isLoading: isMyAccountStatusLoading
    } = useMyAccountStatus(!isSubOrg && applicationConfig?.advancedConfigurations?.showMyAccountStatus);

    /**
     * Build the pattern for the access URL placeholders.
     */
    const accessUrlPlaceholdersPattern: RegExp = useMemo(() => {
        let placeholdersPattern: string = "";

        ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.ACCESS_URL_ALLOWED_PLACEHOLDERS.forEach(
            (placeholder: string, index: number) => {
                if (index == 0) {
                    placeholdersPattern += placeholder;
                } else {
                    placeholdersPattern += `|${placeholder}`;
                }
            }
        );

        return new RegExp(placeholdersPattern, "g");
    }, []);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: GeneralDetailsFormValuesInterface) => {
        onSubmit({
            accessUrl: values.accessUrl?.toString(),
            advancedConfigurations: {
                discoverableByEndUsers: values.discoverableByEndUsers
            },
            description: values.description?.toString().trim(),
            id: appId,
            name: values.name?.toString(),
            ...!hiddenFields?.includes("imageUrl") && { imageUrl: values.imageUrl?.toString() }
        });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: GeneralDetailsFormValuesInterface):
        GeneralDetailsFormErrorValidationsInterface => {

        const errors: GeneralDetailsFormErrorValidationsInterface = {
            accessUrl: undefined
        };

        if (isDiscoverable && !values.accessUrl) {
            errors.accessUrl = t("applications:forms.generalDetails.fields.accessUrl" +
                ".validations.empty");
        }

        return errors;
    };

    /**
     * Application Name validation.
     *
     * @param name - Application Name.
     * @returns Name validation.
     */
    const validateName = (name: string): string | void => {

        const isValid: boolean = name && !!name.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    /**
     * Application Description validation.
     *
     * @param description - Application Description.
     * @returns Description validation.
     */
    const validateDescription = (description: string): string | void => {

        const isValid: boolean = description && !!description.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_DESCRIPTION_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    /**
     * Access URL may have placeholders like `${UserTenantHint}`, or `${organizationIdHint}`.
     * This function validates the Access URL after removing those placeholders.
     *
     * @param value - Access URL to be validated.
     * @returns Error message.
     */
    const validateAccessURL = (value: string): string => {
        /**
         * Use a regex to replace `${UserTenantHint}`, and `${organizationIdHint}` placeholders
         * while preserving other characters
         */
        const moderatedValue: string = value?.trim()?.replace(accessUrlPlaceholdersPattern, "");
        let errorMsg: string;

        if (moderatedValue && (!URLUtils.isURLValid(moderatedValue, true) || !FormValidation.url(moderatedValue))) {
            errorMsg = t("applications:forms.generalDetails.fields.accessUrl.validations.invalid");
        }

        return errorMsg;
    };

    /**
     * Checks whether this is an M2M application.
     */
    useEffect(() => {
        setM2MApplication(application?.templateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID);
    }, [ application ]);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

        if (myAccountStatus) {
            const enableProperty: string = myAccountStatus["value"];

            if (enableProperty && enableProperty === "false") {

                status = false;
            }
        }

        setMyAccountStatus(status);
    }, [ isMyAccountStatusLoading ]);

    if (isMyAccountStatusLoading) {
        return (
            <EmphasizedSegment padded="very">
                <ContentLoader inline="centered" active/>
            </EmphasizedSegment>
        );
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: GeneralDetailsFormValuesInterface) => {
                updateConfigurations(values);
            } }
            initialValues={ {
                accessUrl: accessUrl,
                description: description,
                name: name
            } }
            validate={ validateForm }
        >
            { getLink("develop.connections.newConnection.enterprise.saml.learnMore") === undefined
                ? null
                : <Divider hidden/>
            }
            { isManagementApp && (
                <Message
                    type="info"
                    content={ (
                        <>
                            { t("applications:forms.generalDetails.managementAppBanner") }
                            <DocumentationLink
                                link={ getLink("develop.applications.managementApplication.learnMore") }>
                                {
                                    t("common:learnMore")
                                }
                            </DocumentationLink>
                        </>
                    ) }
                />
            ) }
            { !UIConfig.systemAppsIdentifiers.includes(name) && (
                <Field.Input
                    ariaLabel="Application name"
                    inputType="name"
                    name="name"
                    label={
                        t("applications:forms.generalDetails.fields.name" +
                            ".label")
                    }
                    required={ true }
                    placeholder={
                        t("applications:forms.generalDetails.fields.name" +
                            ".placeholder")
                    }
                    value={ name }
                    hidden={ isSubOrganizationType }
                    readOnly={ readOnly || isSubOrganizationType }
                    validation ={ (value: string) => validateName(value.toString().trim()) }
                    maxLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                    minLength={ 3 }
                    data-testid={ `${ testId }-application-name-input` }
                    width={ 16 }
                />
            ) }
            {
                name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME && (
                    <Field.Textarea
                        ariaLabel="Application description"
                        name="description"
                        label={
                            t("applications:forms.generalDetails.fields.description" +
                                ".label")
                        }
                        required={ false }
                        placeholder={
                            t("applications:forms.generalDetails.fields.description" +
                                ".placeholder")
                        }
                        value={ description }
                        hidden={ isSubOrganizationType }
                        readOnly={ readOnly }
                        validation ={ (value: string) => validateDescription(value.toString().trim()) }
                        maxLength={ 300 }
                        minLength={ 3 }
                        data-testid={ `${ testId }-application-description-textarea` }
                        width={ 16 }
                    />
                )
            }
            {
                <Field.Input
                    ariaLabel="Application image URL"
                    inputType="url"
                    name="imageUrl"
                    label={
                        t("applications:forms.generalDetails" +
                            ".fields.imageUrl.label")
                    }
                    required={ false }
                    placeholder={
                        t("applications:forms.generalDetails" +
                            ".fields.imageUrl.placeholder")
                    }
                    value={ imageUrl }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-application-image-url-input` }
                    maxLength={ 200 }
                    minLength={ 3 }
                    hint={
                        t("applications:forms.generalDetails" +
                            ".fields.imageUrl.hint")
                    }
                    width={ 16 }
                    hidden={ isSubOrganizationType || hiddenFields?.includes("imageUrl") }
                />
            }
            { (
                !isM2MApplication
                && (
                    isMyAccountEnabled
                    || isSubOrg
                )
            ) ? (
                    <Field.Checkbox
                        ariaLabel="Make application discoverable by end users"
                        name="discoverableByEndUsers"
                        required={ false }
                        label={ t("applications:forms.generalDetails.fields" +
                            ".discoverable.label") }
                        initialValue={ isDiscoverable }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-application-discoverable-checkbox` }
                        listen={ (value: boolean) => setDiscoverability(value) }
                        hint={ (
                            <Trans
                                i18nKey={
                                    application.templateId === ApplicationManagementConstants.MOBILE
                                        ? "applications:forms.inboundOIDC.mobileApp" +
                                            ".discoverableHint"
                                        : "applications:forms.generalDetails.fields." +
                                            "discoverable.hint"
                                }
                                tOptions={ { myAccount: "My Account" } }
                            >
                                { " " }
                                { getLink("develop.applications.managementApplication.selfServicePortal") === undefined
                                    ? (
                                        <strong data-testid="application-name-assertion">
                                            My Account
                                        </strong>
                                    )
                                    : (
                                        <strong
                                            className="link pointing"
                                            data-testid="application-name-assertion"
                                            onClick={
                                                () => window.open(getLink("develop.applications.managementApplication"+
                                                            ".selfServicePortal"), "_blank")
                                            }
                                        >
                                            My Account
                                        </strong>
                                    )
                                }
                            </Trans>
                        ) }
                        hidden={ isSubOrganizationType }
                        width={ 16 }
                    /> ) : null
            }
            {
                !isM2MApplication && (
                    <Field.Input
                        ariaLabel={
                            t("applications:forms.generalDetails.fields.accessUrl.ariaLabel")
                        }
                        inputType="url"
                        name="accessUrl"
                        label={
                            t("applications:forms.generalDetails.fields.accessUrl.label")
                        }
                        required={ isDiscoverable }
                        placeholder={
                            t("applications:forms.generalDetails.fields.accessUrl" +
                                ".placeholder")
                        }
                        value={ accessUrl }
                        readOnly={
                            !hasRequiredScope || (
                                readOnly
                                && applicationConfig.generalSettings.getFieldReadOnlyStatus(
                                    application, "ACCESS_URL"
                                )
                            )
                        }
                        validation={ validateAccessURL }
                        hidden={ isSubOrganizationType }
                        maxLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.ACCESS_URL_MAX_LENGTH }
                        minLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.ACCESS_URL_MIN_LENGTH }
                        data-testid={ `${ testId }-application-access-url-input` }
                        hint={ t("applications:forms.generalDetails.fields.accessUrl.hint") }
                        width={ 16 }
                    />)
            }
            {
                (!isBrandingSectionHidden &&
                !isM2MApplication &&
                orgType !== OrganizationType.SUBORGANIZATION) && <Divider />
            }
            {
                (!isBrandingSectionHidden && !isM2MApplication) && (
                    <>
                        <Heading as="h5">
                            { t("applications:forms.generalDetails.sections.branding.title") }
                        </Heading>
                        <PaletteIcon fill="#ff7300" /> &nbsp;
                        <Link
                            className="application-branding-link"
                            color="primary"
                            data-componentid={ `${testId}-application-branding-link` }
                            onClick={ () => {
                                history.push({
                                    pathname: AppConstants.getPaths().get("BRANDING"),
                                    state: appId
                                });
                            } }
                        >
                            { t("applications:forms.generalDetails.brandingLink.label") }
                        </Link>
                        <Hint>{ t("applications:forms.generalDetails.brandingLink.hint") }</Hint>
                    </>
                )
            }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={
                    isSubOrganizationType ||
                    !hasRequiredScope || (
                        readOnly
                        && applicationConfig.generalSettings.getFieldReadOnlyStatus(
                            application, "ACCESS_URL"
                        )
                    )
                }
            />
        </Form>
    );
};

/**
 * Default props for the applications general settings form.
 */
GeneralDetailsForm.defaultProps = {
    "data-testid": "application-general-settings-form"
};
