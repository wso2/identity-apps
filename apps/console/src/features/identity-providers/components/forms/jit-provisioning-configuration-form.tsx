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
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import { ContentLoader, Heading, Hint, Link, Text } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Message } from "semantic-ui-react";
import {
    ApplicationBasicInterface,
    getApplicationDetails,
    SimpleUserStoreListItemInterface
} from "../../../applications";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface,
    IdentityProviderInterface,
    JITProvisioningResponseInterface,
    SupportedJITProvisioningSchemes
} from "../../models";
import { identityProviderConfig } from "../../../../extensions";
import { getIDPConnectedApps } from "../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AppConstants, history } from "../../../core";

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

    const [ isJITProvisioningEnabled, setIsJITProvisioningEnabled ] = useState<boolean>(false);
    const [
        cannotModifyProxyModeDueToConnectApps,
        setCannotModifyProxyModeDueToConnectApps
    ] = useState<boolean>(true);
    const [ connectedApps, setConnectedApps ] = useState<{ name: string; id: string; }[]>([]);
    const [ fetchingConnectedApps, setFetchingConnectedApps ] = useState<boolean>(true);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            ...initialValues,
            isEnabled: !values.get(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY)
                .includes(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY),
            scheme: values.get(JITProvisioningConstants.PROVISIONING_SCHEME_TYPE_KEY),
            userstore: values.get(JITProvisioningConstants.PROVISIONING_USER_STORE_DOMAIN_KEY)
        } as JITProvisioningResponseInterface;
    };

    /**
     * Create user store options.
     *
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
        }
    }, [ initialValues ]);


    useEffect(() => {

        setFetchingConnectedApps(true);

        getIDPConnectedApps(idpId)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setCannotModifyProxyModeDueToConnectApps(false);
                    setFetchingConnectedApps(false);
                    return;
                }
                setCannotModifyProxyModeDueToConnectApps(true);
                const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                    return getApplicationDetails(app.appId);
                });
                const results: ApplicationBasicInterface[] = await Promise.all(
                    appRequests.map(response => response.catch(error => {
                        dispatch(addAlert({
                            description: error?.description
                                || "Error occurred while trying to retrieve connected applications.",
                            level: AlertLevels.ERROR,
                            message: error?.message || "Error Occurred."
                        }));
                    }))
                );
                setConnectedApps(results.map(({ name, id }) => ({ name, id })));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || "Error occurred while trying to retrieve connected applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setFetchingConnectedApps(false);
            });

    }, []);

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

    const ProxyModeConflictMessage = (
        <Message
            header={
                fetchingConnectedApps
                    ? undefined
                    : <Heading as="h5" className="mt-1">
                        <strong>
                            { t("console:develop.features.authenticationProvider.forms.jitProvisioning." +
                                "enableJITProvisioning.disabledMessageHeader") }
                        </strong>
                    </Heading>
            }
            warning={ true }
            content={
                <div className="mt-2">
                    <Text>
                        { fetchingConnectedApps
                            ? "Checking for conflicts with configured applications."
                            : connectedApps?.length > 1
                                ? t("console:develop.features.authenticationProvider.forms.jitProvisioning." +
                                    "enableJITProvisioning.disabledMessageContent.1")
                                : t("console:develop.features.authenticationProvider.forms.jitProvisioning." +
                                    "enableJITProvisioning.disabledMessageContent.2")
                        }
                    </Text>
                    { fetchingConnectedApps
                        ? <ContentLoader/>
                        : (
                            <ol style={ { marginBottom: 0 } }>
                                { connectedApps?.map(({ name, id }, index) => (
                                    <li key={ index }>
                                        <Link icon="linkify" onClick={ () => {
                                            history.push({
                                                pathname: AppConstants.getPaths()
                                                    .get("APPLICATION_EDIT")
                                                    .replace(":id", id),
                                                search: `#tab=4`
                                            });
                                        } }>{ name }</Link>
                                    </li>
                                )) }
                            </ol>
                        )
                    }
                </div>
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
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        loading={ fetchingConnectedApps }
                                        name={ JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY }
                                        label=""
                                        required={ false }
                                        requiredErrorMessage=""
                                        value={
                                            !initialValues?.isEnabled
                                                ? [ JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY ]
                                                : []
                                        }
                                        disabled={ cannotModifyProxyModeDueToConnectApps }
                                        type="checkbox"
                                        listen={ (values) => {
                                            setIsJITProvisioningEnabled(
                                                !values
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
                                        { t("console:develop.features.authenticationProvider.forms.jitProvisioning." +
                                            "enableJITProvisioning.hint") }
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
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Show when={ AccessControlConstants.IDP_EDIT }>
                            <Button
                                primary type="submit"
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
