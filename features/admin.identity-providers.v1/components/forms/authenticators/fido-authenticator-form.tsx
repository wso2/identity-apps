/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { DocumentationLink, Message, URLInput, useDocumentation } from "@wso2is/react-components";
import classNames from "classnames";
import { updateFidoConfigs, useFIDOConnectorConfigs } from "features/admin.identity-providers.v1/api/fido-configs";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useGetCurrentOrganizationType } from "../../../../admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    FIDOAuthenticatorFormFieldsInterface,
    FIDOAuthenticatorFormInitialValuesInterface,
    FIDOAuthenticatorFormPropsInterface,
    FIDOConfigsInterface,
    FIDOConnectorConfigsAttributeInterface
} from "../../../models";

const FORM_ID: string = "fido-authenticator-form";

/**
 * FIDO Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const FIDOAuthenticatorForm: FunctionComponent<FIDOAuthenticatorFormPropsInterface> = (
    props: FIDOAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const { getLink } = useDocumentation();
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ initialValues, setInitialValues ] = useState<FIDOAuthenticatorFormInitialValuesInterface>(undefined);
    const [
        isPasskeyProgressiveEnrollmentEnabled,
        setIsPasskeyProgressiveEnrollmentEnabled
    ] = useState<boolean>(undefined);
    const [ isReadOnly ] = useState<boolean>(isSubOrganization() || readOnly);
    const [ isFIDOConfigsSubmitting, setIsFIDOConfigsSubmitting ] = useState<boolean>(false);
    const [ FIDOTrustedOrigins, setFIDOTrustedOrigins ] = useState<string>("");

    const {
        data: fidoConnectorConfigs,
        isLoading: fidoConnectorConfigFetchRequestIsLoading,
        error: fidoConnectorConfigFetchError,
        mutate: mutateFIDOConnectorConfigs
    } = useFIDOConnectorConfigs();

    console.log(FIDOTrustedOrigins);

    /**
     * Retrieve the list of FIDO trusted origins from the FIDO connector configuration response.
     */
    const initialFIDOTrustedOriginsList: string = useMemo(() => {
        if (fidoConnectorConfigFetchRequestIsLoading) {
            return "";
        }

        if (fidoConnectorConfigs?.attributes
            && Array.isArray(fidoConnectorConfigs?.attributes)
            && fidoConnectorConfigs?.attributes.length > 0) {
            const trustedOriginsAttribute: FIDOConnectorConfigsAttributeInterface = fidoConnectorConfigs?.attributes
                ?.find(
                    (attribute: FIDOConnectorConfigsAttributeInterface) =>
                        attribute?.key === IdentityProviderManagementConstants.FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY
                );

            if (trustedOriginsAttribute) {
                setFIDOTrustedOrigins(trustedOriginsAttribute?.value);

                return trustedOriginsAttribute?.value;
            }
        }

        return "";
    }, [ fidoConnectorConfigs ]);

    /**
     * Handle errors that occur during the FIDO connector config fetch request.
     */
    useEffect(() => {
        if (!fidoConnectorConfigFetchError) {
            return;
        }

        if (fidoConnectorConfigFetchError?.response?.data?.code ===
            IdentityProviderManagementConstants.FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE) {
            return;
        }

        if (fidoConnectorConfigFetchError?.response?.data?.description) {
            dispatch(addAlert({
                description: fidoConnectorConfigFetchError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications.getFIDOConnectorConfigs.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("authenticationProvider:notifications." +
                "getFIDOConnectorConfigs.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("authenticationProvider:notifications." +
                "getFIDOConnectorConfigs.genericError.message")
        }));
    }, [ fidoConnectorConfigFetchError ]);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: FIDOAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: FIDOAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues?.properties?.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonAuthenticatorFormFieldMetaInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            resolvedFormFields = {
                ...resolvedFormFields,
                [moderatedName]: {
                    meta,
                    value: value?.value === "true"
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [moderatedName]: ( value.value === "true" || value.value === "false" )
                    ? JSON.parse(value.value)
                    : value.value
            };

        });

        setInitialValues(resolvedInitialValues);
        setIsPasskeyProgressiveEnrollmentEnabled(resolvedInitialValues.FIDO_EnablePasskeyProgressiveEnrollment);
    }, [ originalInitialValues ]);

    /**
     * Update FIDO connector configs.
     */
    const updateFIDOConnectorConfigs = () => {
        setIsFIDOConfigsSubmitting(true);

        const payload: FIDOConfigsInterface = {
            attributes: [
                {
                    key: IdentityProviderManagementConstants.FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY,
                    value: FIDOTrustedOrigins
                }
            ],
            name: IdentityProviderManagementConstants.FIDO_CONNECTOR_CONFIG_NAME
        };

        updateFidoConfigs(payload)
            .then(() => {
                addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOConnectorConfigs." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "updateFIDOConnectorConfigs.success.message")
                });

                mutateFIDOConnectorConfigs();
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    addAlert({
                        description: t("authenticationProvider:" +
                            "notifications.updateFIDOConnectorConfigs." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "updateFIDOConnectorConfigs.error.message")
                    });

                    return;
                }

                addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateFIDOConnectorConfigs." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:" +
                        "notifications.updateFIDOConnectorConfigs." +
                        "genericError.message")
                });
            })
            .finally(() => setIsFIDOConfigsSubmitting(false));
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: FIDOAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        if (initialFIDOTrustedOriginsList !== FIDOTrustedOrigins) {
            updateFIDOConnectorConfigs();
        }

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name) {
                if (name === IdentityProviderManagementConstants.FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY) {
                    continue;
                }

                const moderatedName: string = name.replace(/_/g, ".");

                properties.push({
                    name: moderatedName,
                    value: isBoolean(value) ? value.toString() : value
                });
            }
        }

        return {
            ...originalInitialValues,
            properties
        };
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: FIDOAuthenticatorFormInitialValuesInterface) => {
                onSubmit(getUpdatedConfigurations(values as FIDOAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
        >
            {
                isPasskeyProgressiveEnrollmentEnabled ? (
                    <div
                        style={ { animationDuration: "350ms" } }
                        className={ classNames("ui image warning scale transition", {
                            "hidden animating out": !isPasskeyProgressiveEnrollmentEnabled,
                            "visible animating in": isPasskeyProgressiveEnrollmentEnabled
                        }) }
                    >
                        <Message
                            type="info"
                            content={
                                (<>
                                    {
                                        t("applications:edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder." +
                                        "types.passkey.info.progressiveEnrollmentEnabled")
                                    }
                                    <p>
                                        <Trans
                                            i18nKey={
                                                t("applications:edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.passkey." +
                                                "info.progressiveEnrollmentEnabledCheckbox")
                                            }
                                        >
                                            <strong>Note : </strong> When setting the Passkey in the <strong>first
                                            step</strong>, users need to add an adaptive script. Use the <strong>
                                            Passkeys Progressive Enrollment</strong> template in the <strong>
                                            Sign-In-Method</strong> tab of the application.
                                        </Trans>
                                        <DocumentationLink
                                            link={ getLink("develop.applications.editApplication.signInMethod.fido") }
                                            showEmptyLink={ false }
                                        >
                                            { t("common:learnMore") }
                                        </DocumentationLink>
                                    </p>
                                </>)
                            }
                        />
                    </div>
                ): null
            }
            <Field.Checkbox
                ariaLabel="Allow passkey progressive enrollment"
                name="FIDO_EnablePasskeyProgressiveEnrollment"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".fido2.allowProgressiveEnrollment.label")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".fido2.allowProgressiveEnrollment.hint")
                }
                readOnly={ isReadOnly }
                width={ 12 }
                data-testid={ `${ testId }-enable-passkey-progressive-enrollment` }
                listen={ (value: boolean) => setIsPasskeyProgressiveEnrollmentEnabled(value) }
            />
            <Field.Checkbox
                ariaLabel="Allow passkey usernameless authentication"
                name="FIDO_EnableUsernamelessAuthentication"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".fido2.allowUsernamelessAuthentication.label")
                }
                hint={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".fido2.allowUsernamelessAuthentication.hint")
                }
                readOnly={ isReadOnly }
                width={ 12 }
                data-testid={ `${ testId }-enable-passkey-usernameless-authentication` }
            />
            <URLInput
                urlState={ FIDOTrustedOrigins }
                setURLState={ (urls: string) => {
                    if (urls !== undefined) {
                        setFIDOTrustedOrigins(urls);
                    }
                } }
                labelName={
                    t("applications:forms." +
                            "spaProtocolSettingsWizard.fields.callBackUrls.label")
                }
                placeholder={
                    t("applications:forms.inboundOIDC." +
                            "fields.callBackUrls.placeholder")
                }
                validationErrorMsg={
                    t("applications:forms." +
                            "spaProtocolSettingsWizard.fields.callBackUrls.validations.invalid")
                }
                emptyErrorMessage={
                    t("applications:forms." +
                        "spaProtocolSettingsWizard.fields.callBackUrls.validations.empty")
                }
                computerWidth={ 10 }
                hint={
                    t("applications:" +
                        "forms.inboundOIDC.fields.callBackUrls.hint")
                }
                addURLTooltip={ t("common:addURL") }
                duplicateURLErrorMessage={ t("common:duplicateURLError") }
                data-testid={ `${ testId }-fido-trusted-origin-input` }
                required = { false }
                showPredictions={ false }
                isAllowEnabled={ false }
                validation={ (value: string) => {
                    if (!(URLUtils.isURLValid(value, true)
                        && (URLUtils.isHttpUrl(value)
                        || URLUtils.isHttpsUrl(value)))) {
                        return false;
                    }

                    return true;
                } }
            />
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="FIDO authenticator update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting || isFIDOConfigsSubmitting }
                loading={ isSubmitting || isFIDOConfigsSubmitting }
                label={ t("common:update") }
                hidden={ isReadOnly }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
FIDOAuthenticatorForm.defaultProps = {
    "data-componentid": "fido-authenticator-form",
    enableSubmitButton: true
};
