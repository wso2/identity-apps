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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Code, DocumentationLink, Hint, Message, useDocumentation } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DropdownItemProps, Grid } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../extensions";
import { SimpleUserStoreListItemInterface } from "../../../../applications/models";
import { useGetCurrentOrganizationType } from "../../../../organizations/hooks/use-get-organization-type";
import {
    ConnectionInterface,
    JITProvisioningResponseInterface,
    SupportedJITProvisioningSchemes
} from "../../../models/connection";

/**
 *  Just-in time provisioning configurations for the IdP.
 */
interface JITProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    idpId: string;
    onSubmit: (values: ConnectionInterface) => void;
    initialValues: JITProvisioningResponseInterface;
    useStoreList: SimpleUserStoreListItemInterface[];
    isReadOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

enum JITProvisioningConstants {
    ENABLE_JIT_PROVISIONING_KEY = "enableJITProvisioning",
    PROVISIONING_USER_STORE_DOMAIN_KEY = "provisioningUserstoreDomain",
    PROVISIONING_SCHEME_TYPE_KEY = "provisioningScheme",
    ASSOCIATE_LOCAL_USER = "associateLocalUser",
    ATTRIBUTE_SYNC_METHOD ="attributeSyncMethod"
}

/**
 * Just-in time Provisioning configurations form component.
 *
 * @param props - Props injected to the component.
 * @returns
 */
export const JITProvisioningConfigurationsForm: FunctionComponent<JITProvisioningConfigurationFormPropsInterface> = (
    props: JITProvisioningConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        useStoreList,
        isReadOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ isJITProvisioningEnabled, setIsJITProvisioningEnabled ] = useState<boolean>(false);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns
     */
    const updateConfiguration = (values: any): any => {
        return {
            associateLocalUser: values.get(JITProvisioningConstants.ASSOCIATE_LOCAL_USER)
                ?.includes(JITProvisioningConstants.ASSOCIATE_LOCAL_USER) ?? initialValues?.associateLocalUser,
            attributeSyncMethod: values?.get(
                JITProvisioningConstants.ATTRIBUTE_SYNC_METHOD
            ) ?? initialValues?.attributeSyncMethod,
            isEnabled: values.get(
                JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY
            ).includes(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY) ?? initialValues?.isEnabled,
            scheme: values.get(
                JITProvisioningConstants.PROVISIONING_SCHEME_TYPE_KEY
            ) ?? initialValues?.scheme,
            userstore: values.get(
                JITProvisioningConstants.PROVISIONING_USER_STORE_DOMAIN_KEY
            ) ?? initialValues.userstore
        } as JITProvisioningResponseInterface;
    };

    /**
     * Create user store options.
     */
    const getUserStoreOption = () => {
        const allowedOptions: DropdownItemProps[] = [];

        if (useStoreList) {
            useStoreList?.map((userStore: SimpleUserStoreListItemInterface) => {
                allowedOptions.push({
                    key: useStoreList.indexOf(userStore),
                    text: userStore?.name,
                    value: userStore?.name
                });
            });
        }

        return allowedOptions;
    };

    useEffect(() => {
        if (initialValues?.isEnabled) {
            setIsJITProvisioningEnabled(initialValues?.isEnabled);
        }
    }, [ initialValues ]);

    const supportedProvisioningSchemes: {
        label: string;
        value: SupportedJITProvisioningSchemes;
    }[] = [ {
        label: t("console:develop.features.authenticationProvider" +
            ".forms.jitProvisioning.provisioningScheme.children.0"),
        value: SupportedJITProvisioningSchemes.PROMPT_USERNAME_PASSWORD_CONSENT
    }, {
        label: t("console:develop.features.authenticationProvider" +
            ".forms.jitProvisioning.provisioningScheme.children.1"),
        value: SupportedJITProvisioningSchemes.PROMPT_PASSWORD_CONSENT
    }, {
        label: t("console:develop.features.authenticationProvider" +
            ".forms.jitProvisioning.provisioningScheme.children.2"),
        value: SupportedJITProvisioningSchemes.PROMPT_CONSENT
    }, {
        label: t("console:develop.features.authenticationProvider." +
            "forms.jitProvisioning.provisioningScheme.children.3"),
        value: SupportedJITProvisioningSchemes.PROVISION_SILENTLY
    } ];

    const ProxyModeConflictMessage: ReactElement = (
        <div
            style={ { animationDuration: "350ms" } }
            className={ classNames("ui image warning scale transition", {
                "hidden animating out": isJITProvisioningEnabled,
                "visible animating in": !isJITProvisioningEnabled
            }) }>
            <Message
                data-componentid="proxy-mode-conflict-warning-message"
                data-testid="proxy-mode-conflict-warning-message"
                type="warning"
                // Semantic hides warning messages inside <form> by default
                // Overriding the behaviour here to make sure it renders properly.
                header="Warning"
                content={
                    (
                        <>
                            JIT user provisioning should be enabled for external identity providers
                            (connections) when there are MFA mechanisms
                            such as <Code>TOTP</Code> and <Code>Email OTP</Code> configured
                            in an application&apos;s login flow.
                            <DocumentationLink link={ getLink("develop.connections.edit.advancedSettings.jit") }>
                                Learn More
                            </DocumentationLink>
                        </>
                    )
                }
            />
        </div>
    );

    return (
        <Forms onSubmit={ (values: Map<string, FormValue>) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                {
                    identityProviderConfig?.jitProvisioningSettings?.enableJitProvisioningField?.show
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                <Field
                                    name={ JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY }
                                    label=""
                                    required={ false }
                                    requiredErrorMessage=""
                                    value={
                                        initialValues?.isEnabled
                                            ? [ JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY ]
                                            : []
                                    }
                                    type="checkbox"
                                    listen={ (values: Map<string, FormValue>) => {
                                        setIsJITProvisioningEnabled(
                                            values
                                                .get(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY)
                                                .includes(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY)
                                        );
                                    } }
                                    children={ [ {
                                        label: t("console:develop.features.authenticationProvider.forms." +
                                            "jitProvisioning.enableJITProvisioning.label"),
                                        value: JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY
                                    } ] }
                                    data-testid={ `${ testId }-is-enable` }
                                    readOnly={ isReadOnly }
                                />
                                <Hint>
                                    When enabled, users who log in with this identity provider will be
                                    provisioned to your organization.
                                </Hint>
                                { !isJITProvisioningEnabled
                                    ? ProxyModeConflictMessage
                                    : <Fragment />
                                }
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    isSubOrganization()
                    && identityProviderConfig?.jitProvisioningSettings?.enableAssociateLocalUserField?.show
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                <Field
                                    name={ JITProvisioningConstants.ASSOCIATE_LOCAL_USER }
                                    label=""
                                    required={ false }
                                    disabled={ !isJITProvisioningEnabled }
                                    requiredErrorMessage=""
                                    value={
                                        initialValues?.associateLocalUser
                                            ? [ JITProvisioningConstants.ASSOCIATE_LOCAL_USER ]
                                            : []
                                    }
                                    type="checkbox"
                                    children={ [ {
                                        label: t("console:develop.features.authenticationProvider.forms." +
                                            "jitProvisioning.associateLocalUser.label"),
                                        value: JITProvisioningConstants.ASSOCIATE_LOCAL_USER
                                    } ] }
                                    data-testid={ `${ testId }-is-enable` }
                                    readOnly={ isReadOnly }
                                />
                                <Hint>
                                    { t("console:develop.features.authenticationProvider.forms." +
                                        "jitProvisioning.associateLocalUser.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    identityProviderConfig?.jitProvisioningSettings?.userstoreDomainField?.show
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                    <Field
                                        name={ JITProvisioningConstants.PROVISIONING_USER_STORE_DOMAIN_KEY }
                                        label={
                                            t("console:develop.features.authenticationProvider" +
                                                ".forms.jitProvisioning.provisioningUserStoreDomain.label")
                                        }
                                        required={ false }
                                        requiredErrorMessage=""
                                        type="dropdown"
                                        default={ useStoreList && useStoreList.length > 0 && useStoreList[ 0 ].name }
                                        value={ initialValues?.userstore }
                                        children={ getUserStoreOption() }
                                        disabled={ !isJITProvisioningEnabled }
                                        data-testid={ `${ testId }-user-store-domain` }
                                        readOnly={ isReadOnly }
                                    />
                                    <Hint>
                                        {
                                            t("console:develop.features.authenticationProvider" +
                                                ".forms.jitProvisioning.provisioningUserStoreDomain.hint")
                                        }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : <Fragment />
                }
                {
                    identityProviderConfig?.jitProvisioningSettings?.provisioningSchemeField?.show
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                    <Fragment>
                                        <Field
                                            required={ false }
                                            requiredErrorMessage=""
                                            label={ t("console:develop.features.authenticationProvider" +
                                                ".forms.jitProvisioning.provisioningScheme.label") }
                                            name={ JITProvisioningConstants.PROVISIONING_SCHEME_TYPE_KEY }
                                            default={
                                                initialValues?.scheme
                                                    ? initialValues?.scheme
                                                    : SupportedJITProvisioningSchemes.PROMPT_USERNAME_PASSWORD_CONSENT
                                            }
                                            type="radio"
                                            children={ supportedProvisioningSchemes }
                                            disabled={ !isJITProvisioningEnabled }
                                            data-testid={ `${ testId }-scheme` }
                                            readOnly={ isReadOnly }
                                        />
                                        <Hint>
                                            { t("console:develop.features.authenticationProvider" +
                                                ".forms.jitProvisioning.provisioningScheme.hint") }
                                        </Hint>
                                    </Fragment>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : <Fragment />
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                        <Show when={ AccessControlConstants.IDP_EDIT }>
                            <Button
                                primary
                                type="submit"
                                size="small"
                                className="form-button"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                data-testid={ `${ testId }-update-button` }
                            >
                                { t("common:update") }
                            </Button>
                        </Show>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );

};

/**
 * Default proptypes for the IDP JIT provisioning form component.
 */
JITProvisioningConfigurationsForm.defaultProps = {
    "data-testid": "idp-edit-jit-provisioning-settings"
};
