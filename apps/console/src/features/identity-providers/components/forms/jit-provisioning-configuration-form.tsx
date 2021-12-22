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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, HttpCodes, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { Code, ContentLoader, DocumentationLink, Hint, Link, Text, useDocumentation } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import flatten from "lodash-es/flatten";
import intersection from "lodash-es/intersection";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Icon, Message } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../extensions";
import { ApplicationInterface, SimpleUserStoreListItemInterface, getApplicationsByIds } from "../../../applications";
import { AppConstants, AppState, ConfigReducerStateInterface, history } from "../../../core";
import { getIDPConnectedApps } from "../../api";
import { IdentityProviderManagementConstants } from "../../constants";
import {
    ConnectedAppsInterface,
    IdentityProviderInterface,
    JITProvisioningResponseInterface,
    SupportedJITProvisioningSchemes
} from "../../models";

/**
 *  Just-in time provisioning configurations for the IdP.
 */
interface JITProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    idpId: string;
    onSubmit: (values: IdentityProviderInterface) => void;
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
    PROVISIONING_SCHEME_TYPE_KEY = "provisioningScheme"
}

/**
 * Just-in time Provisioning configurations form component.
 *
 * @param {JITProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const JITProvisioningConfigurationsForm: FunctionComponent<JITProvisioningConfigurationFormPropsInterface> = (
    props: JITProvisioningConfigurationFormPropsInterface
): ReactElement => {

    const {
        idpId,
        initialValues,
        onSubmit,
        useStoreList,
        isReadOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ isJITProvisioningEnabled, setIsJITProvisioningEnabled ] = useState<boolean>(false);
    const [
        cannotModifyProxyModeDueToConnectApps,
        setCannotModifyProxyModeDueToConnectApps
    ] = useState<boolean>(false);
    const [ fetchingConnectedApps, setFetchingConnectedApps ] = useState<boolean>(false);
    const [ conflictingApps, setConflictingApps ] = useState<ApplicationInterface[]>([]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
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
        const allowedOptions = [];

        if (useStoreList) {
            useStoreList?.map((userStore) => {
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
            setFetchingConnectedApps(true);
            setCannotModifyProxyModeDueToConnectApps(true);
            validateJITConfigurationState().finally(() => {
                setFetchingConnectedApps(false);
            });
        }
    }, [ initialValues ]);

    /**
     * Context
     * -------
     * Used to check this IdP's {@code idpId} connected applications and
     * check which applications has configured TOTP or Email OTP in their
     * authentication steps.
     */
    const validateJITConfigurationState = async (): Promise<void> => {

        try {

            const { count, connectedApps }: ConnectedAppsInterface = await getIDPConnectedApps(idpId);

            if (count === 0) {
                setCannotModifyProxyModeDueToConnectApps(false);

                return;
            }

            const limit = IdentityProviderManagementConstants.MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_CALLOUTS;

            // Gets all the applications concurrently.
            const responses: AxiosResponse<ApplicationInterface>[] = await getApplicationsByIds(
                new Set(connectedApps.slice(0, limit).map((app) => app.appId))
            );

            const applicationsMap: Map<string, ApplicationInterface> = new Map();

            for (const res of responses) {
                const { status, data: app } = res;

                if (HttpCodes.OK !== status) {
                    const error = (res as unknown) as AxiosError;

                    if (error?.response && error.response?.data && error.response.data?.description) {
                        dispatch(addAlert({
                            description: error.response.data.description || "Unable to get application details.",
                            level: AlertLevels.ERROR,
                            message: error?.message || "Error Occurred."
                        }));
                    }

                    continue;
                }
                applicationsMap.set(app.id, app);
            }

            // What's happening here?
            //
            // #1 - Extracting all the options associated to its authentication steps and flat it out. n^2
            // #2 - Extracting the authenticator types. n^2
            // #3 - Checking if sequence has restricted set of MFA configured. n^2
            // #4 - Finding conflicting apps. n
            // #5 - Finding the original modal of each app. 1
            //
            // takes n^2

            const mfaAuthenticators = [
                IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR
            ];

            const apps = [ ...applicationsMap.values() ]
                .map(({ id, authenticationSequence: seq }) => ({
                    id, options: flatten(seq.steps.map(({ options }) => options))
                })) // #1
                .map(({ id, options }) => ({
                    authenticators: options.map(({ authenticator: a }) => a), id
                })) // #2
                .map(({ id, authenticators }) => ({
                    hasMFAConfigured: intersection(authenticators, mfaAuthenticators)?.length > 0, id
                })) // #3
                .filter(({ hasMFAConfigured }) => hasMFAConfigured) // #4
                .map(({ id }) => applicationsMap.get(id)); // #5

            if (apps?.length) {
                setCannotModifyProxyModeDueToConnectApps(true);
                setConflictingApps(apps);

                return;
            }

            setCannotModifyProxyModeDueToConnectApps(false);

        } catch (error) {
            dispatch(addAlert({
                description: error?.description || "Unable to validate provisioning configs at this time.",
                level: AlertLevels.ERROR,
                message: error?.message || "Error Occurred."
            }));
        }

    };

    const supportedProvisioningSchemes = [ {
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

    const documentationLinkForJIT = () => {
        return (
            <Text className="mt-3 mb-0">
                You can learn more about this from our <DocumentationLink
                    link={ getLink("develop.connections.edit.advancedSettings.jit") }>
                docs</DocumentationLink>.
            </Text>
        );
    };

    const whenTheresOnly1AppConflict = () => {
        const FIRST_ENTRY = 0;
        const { name, id } = conflictingApps[ FIRST_ENTRY ];

        return (
            <div>
                <Text>
                    Make sure you know what you&apos;re doing. Because the
                    following application <Link
                        icon="linkify"
                        onClick={ () => {
                            history.push({
                                pathname: AppConstants.getPaths()
                                    .get("APPLICATION_EDIT")
                                    .replace(":id", id),
                                search: "#tab=4"
                            });
                        } }>{ name }</Link> requires Just-in-Time User Provisioning setting
                    to be enabled.
                </Text>
                <Text>
                    Its authentication sequence has Multi-Factor Authentications (MFA) configured. MFA such
                    as <Code>TOTP</Code> and <Code>Email OTP</Code> <strong>expects a provisioned
                    user account in Asgardeo</strong> to work correctly.
                    { documentationLinkForJIT() }
                </Text>
            </div>
        );
    };

    const whenTheresMultipleAppConflicts = () => {
        return (
            <>
                <Text>
                    Make sure you know what you&apos;re doing. Because
                    the following applications require Just-in-Time User Provisioning setting
                    to be enabled.
                    <ol className="mb-3">
                        { conflictingApps?.map(({ name, id }, index) => (
                            <li key={ index }>
                                <Link
                                    icon="linkify"
                                    onClick={ () => {
                                        history.push({
                                            pathname: AppConstants.getPaths()
                                                .get("APPLICATION_EDIT")
                                                .replace(":id", id),
                                            search: "#tab=4"
                                        });
                                    } }>{ name }</Link>
                            </li>
                        )) }
                    </ol>
                    The above-listed applications&apos; authentication sequences have Multi-Factor
                    Authentications (MFA) configured. MFA such
                    as <Code>TOTP</Code> and <Code>Email OTP</Code> <strong>expects a provisioned
                    user account in Asgardeo</strong> to work correctly.
                </Text>
                { documentationLinkForJIT() }
            </>
        );
    };

    const ProxyModeConflictMessage = (
        <Message
            data-componentid="proxy-mode-conflict-warning-message"
            data-testid="proxy-mode-conflict-warning-message"
            warning
            // Semantic hides warning messages inside <form> by default
            // Overriding the behaviour here to make sure it renders properly.
            className="warning visible"
            header={
                (
                    <Fragment>
                        <Icon name="exclamation triangle" className="mr-2"/>
                        Warning
                    </Fragment>
                )
            }
            content={
                (
                    <div className="mt-3 mb-2">
                        { fetchingConnectedApps && <ContentLoader/> }
                        { conflictingApps?.length === 1 ? whenTheresOnly1AppConflict() : null }
                        { conflictingApps?.length > 1 ? whenTheresMultipleAppConflicts() : null }
                    </div>
                )
            }
        />
    );

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                {
                    identityProviderConfig?.jitProvisioningSettings?.enableJitProvisioningField?.show
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                    <Field
                                        loading={ fetchingConnectedApps }
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
                                        listen={ (values) => {
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
                                        Specify if users federated from this Identity Provider needs to be
                                        locally provisioned in { config.ui.productName }.
                                    </Hint>
                                    { cannotModifyProxyModeDueToConnectApps
                                        ? ProxyModeConflictMessage
                                        : <Fragment/>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : <Fragment/>
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
                        : <Fragment/>
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
                        : <Fragment/>
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
