/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { identityProviderConfig, userstoresConfig } from "@wso2is/admin.extensions.v1";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { AlertLevels, Claim, TestableComponentInterface, UniquenessScope } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Code, DocumentationLink, Hint, Link, Message, Text, useDocumentation } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, DropdownItemProps, Grid, Header, Segment } from "semantic-ui-react";
import {
    ConnectionInterface,
    JITProvisioningAccountLookupAttributeMappingInterface,
    JITProvisioningResponseInterface,
    SupportedJITProvisioningSchemes
} from "../../../models/connection";
import "./jit-provisioning-configuration-form.scss";

/**
 *  Just-in time provisioning configurations for the IdP.
 */
interface JITProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    idpId: string;
    onSubmit: (values: ConnectionInterface) => void;
    initialValues: JITProvisioningResponseInterface;
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
    ATTRIBUTE_SYNC_METHOD = "attributeSyncMethod",
    SKIP_JIT_FOR_LOOKUP_FAILURE = "skipJITForLookupFailure",
    PRIMARY_FEDERATED_ATTRIBUTE = "primaryFederatedAttribute",
    PRIMARY_LOCAL_ATTRIBUTE = "primaryLocalAttribute",
    SECONDARY_FEDERATED_ATTRIBUTE = "secondaryFederatedAttribute",
    SECONDARY_LOCAL_ATTRIBUTE = "secondaryLocalAttribute"
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
        isReadOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();
    const enableIdentityClaims: boolean = useSelector((state: AppState) => state?.config?.ui?.enableIdentityClaims);
    const {
        isLoading: isUserStoreListFetchRequestLoading,
        isUserStoreReadOnly,
        mutateUserStoreList,
        userStoresList
    } = useUserStores();

    const {
        data: localClaims,
        isLoading: isLocalClaimsLoading,
        error: localClaimsError
    } = useGetAllLocalClaims({
        "exclude-identity-claims": !enableIdentityClaims,
        filter: null,
        limit: null,
        offset: null,
        sort: null
    });

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName ?? userstoresConfig.primaryUserstoreName);

    const [ isJITProvisioningEnabled, setIsJITProvisioningEnabled ] = useState<boolean>(false);
    const [ isAssociateLocalUserEnabled, setIsAssociateLocalUserEnabled ] = useState<boolean>(false);

    const userStoreOptions: DropdownItemProps[] = useMemo(() => {
        const storeOptions: DropdownItemProps[] = [
            {
                key: -1,
                text: primaryUserStoreDomainName,
                value: primaryUserStoreDomainName
            }
        ];

        if (!isUserStoreListFetchRequestLoading && userStoresList?.length > 0) {
            userStoresList.forEach((store: UserStoreListItem, index: number) => {
                const isReadOnly: boolean = isUserStoreReadOnly(store.name);
                const isEnabled: boolean = store.enabled;

                if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName && !isReadOnly && isEnabled) {
                    const storeOption: DropdownItemProps = {
                        key: index,
                        text: store.name,
                        value: store.name
                    };

                    storeOptions.push(storeOption);
                }
            });
        }

        return storeOptions;
    }, [ isUserStoreListFetchRequestLoading, userStoresList ]);

    /**
     * Build the dropdown options for lookup attribute mappings.
     */
    const localClaimsOptions: DropdownItemProps[] = useMemo(() => {
        if (!localClaims) {
            return [];
        }

        const options: DropdownItemProps[] = [
            {
                content: (
                    <div className="jit-provisioning-local-claim-dropdown-option">
                        <Text className="primary-text">
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.accountLookupAttributeMappings.noneOption.label") }
                        </Text>
                        <Text className="secondary-text" muted>
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.accountLookupAttributeMappings.noneOption.description") }
                        </Text>
                    </div>
                ),
                key: "none",
                text: t("authenticationProvider:" +
                    "forms.jitProvisioning.accountLookupAttributeMappings.noneOption.label"),
                value: ""
            }
        ];

        const claimOptions: DropdownItemProps[] = localClaims.map((claim: Claim) => {
            if ((!claim.uniquenessScope || claim.uniquenessScope === UniquenessScope.NONE) &&
                claim.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI) {
                return null;
            }

            return {
                content: (
                    <div className="jit-provisioning-local-claim-dropdown-option">
                        <Text className="primary-text">{ claim.displayName }</Text>
                        <Text className="secondary-text" muted>{ claim.claimURI }</Text>
                    </div>
                ),
                key: claim.claimURI,
                text: claim.claimURI,
                value: claim.claimURI
            };
        }).filter((option: DropdownItemProps) => option !== null);

        return options.concat(claimOptions);
    }, [ localClaims ]);

    useEffect(() => {
        mutateUserStoreList();
    }, []);

    useEffect(() => {
        if (initialValues?.isEnabled) {
            setIsJITProvisioningEnabled(initialValues?.isEnabled);
        }
        if (initialValues?.associateLocalUser) {
            setIsAssociateLocalUserEnabled(initialValues?.associateLocalUser);
        }
    }, [ initialValues ]);

    /**
     * Error handling for local claims fetch.
     */
    useEffect(() => {
        if (localClaimsError) {
            dispatch(addAlert({
                description: t("authenticationProvider:notifications.getLocalClaims.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications.getLocalClaims.genericError.message")
            }));
        }
    }, [ localClaimsError, dispatch ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns
     */
    const updateConfiguration = (values: any): any => {
        const accountLookupAttributeMappings: JITProvisioningAccountLookupAttributeMappingInterface[] = [];

        const primaryFederatedAttr: string = values.get(JITProvisioningConstants.PRIMARY_FEDERATED_ATTRIBUTE);
        const primaryLocalAttr: string = values.get(JITProvisioningConstants.PRIMARY_LOCAL_ATTRIBUTE);

        if (primaryFederatedAttr && primaryLocalAttr) {
            accountLookupAttributeMappings.push({
                federatedAttribute: primaryFederatedAttr,
                localAttribute: primaryLocalAttr
            });
        }

        const secondaryFederatedAttr: string = values.get(JITProvisioningConstants.SECONDARY_FEDERATED_ATTRIBUTE);
        const secondaryLocalAttr: string = values.get(JITProvisioningConstants.SECONDARY_LOCAL_ATTRIBUTE);

        if (secondaryFederatedAttr && secondaryLocalAttr) {
            accountLookupAttributeMappings.push({
                federatedAttribute: secondaryFederatedAttr,
                localAttribute: secondaryLocalAttr
            });
        }

        return {
            accountLookupAttributeMappings: accountLookupAttributeMappings.length > 0
                ? accountLookupAttributeMappings
                : initialValues?.accountLookupAttributeMappings || [],
            associateLocalUser: values.get(JITProvisioningConstants.ASSOCIATE_LOCAL_USER)
                ?.includes(JITProvisioningConstants.ASSOCIATE_LOCAL_USER) ?? initialValues?.associateLocalUser,
            attributeSyncMethod: values?.get(
                JITProvisioningConstants.ATTRIBUTE_SYNC_METHOD
            ) ?? initialValues?.attributeSyncMethod,
            isEnabled: values.get(
                JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY
            ).includes(JITProvisioningConstants.ENABLE_JIT_PROVISIONING_KEY) ?? initialValues?.isEnabled,
            // isSkipJITForLookupFailure: values.get(JITProvisioningConstants.SKIP_JIT_FOR_LOOKUP_FAILURE)
            //     ?.includes(JITProvisioningConstants.SKIP_JIT_FOR_LOOKUP_FAILURE)
            //     ?? initialValues?.isSkipJITForLookupFailure,
            scheme: values.get(
                JITProvisioningConstants.PROVISIONING_SCHEME_TYPE_KEY
            ) ?? initialValues?.scheme,
            userstore: values.get(
                JITProvisioningConstants.PROVISIONING_USER_STORE_DOMAIN_KEY
            ) ?? initialValues.userstore
        } as JITProvisioningResponseInterface;
    };

    const supportedProvisioningSchemes: {
        label: string;
        value: SupportedJITProvisioningSchemes;
    }[] = [ {
        label: t("authenticationProvider:" +
            "forms.jitProvisioning.provisioningScheme.children.0"),
        value: SupportedJITProvisioningSchemes.PROMPT_USERNAME_PASSWORD_CONSENT
    }, {
        label: t("authenticationProvider:" +
            "forms.jitProvisioning.provisioningScheme.children.1"),
        value: SupportedJITProvisioningSchemes.PROMPT_PASSWORD_CONSENT
    }, {
        label: t("authenticationProvider:" +
            "forms.jitProvisioning.provisioningScheme.children.2"),
        value: SupportedJITProvisioningSchemes.PROMPT_CONSENT
    }, {
        label: t("authenticationProvider:" +
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

    /**
     * Handles the navigation to the local attributes section.
     */
    const handleLocalAttributeSectionNavigation = () => {
        history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
    };

    return (
        <Forms onSubmit={ (values: Map<string, FormValue>) => onSubmit(updateConfiguration(values)) }>
            <Grid className="jit-provisioning-configuration-form">
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
                                        label: t("authenticationProvider:" +
                                            "forms.jitProvisioning.enableJITProvisioning.label"),
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
                    identityProviderConfig?.jitProvisioningSettings?.userstoreDomainField?.show
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                                    <Field
                                        name={ JITProvisioningConstants.PROVISIONING_USER_STORE_DOMAIN_KEY }
                                        label={
                                            t("authenticationProvider:" +
                                                "forms.jitProvisioning.provisioningUserStoreDomain.label")
                                        }
                                        required={ false }
                                        requiredErrorMessage=""
                                        type="dropdown"
                                        default={ userStoreOptions[0]?.name }
                                        value={ initialValues?.userstore }
                                        children={ userStoreOptions }
                                        disabled={ !isJITProvisioningEnabled }
                                        data-testid={ `${ testId }-user-store-domain` }
                                        readOnly={ isReadOnly }
                                    />
                                    <Hint>
                                        {
                                            t("authenticationProvider:" +
                                                "forms.jitProvisioning.provisioningUserStoreDomain.hint")
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
                                            label={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.provisioningScheme.label") }
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
                                            { t("authenticationProvider:" +
                                                "forms.jitProvisioning.provisioningScheme.hint") }
                                        </Hint>
                                    </Fragment>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : <Fragment />
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                        <Field
                            name={ JITProvisioningConstants.ASSOCIATE_LOCAL_USER }
                            required={ false }
                            disabled={ !isJITProvisioningEnabled }
                            value={
                                initialValues?.associateLocalUser
                                    ? [ JITProvisioningConstants.ASSOCIATE_LOCAL_USER ]
                                    : []
                            }
                            type="checkbox"
                            listen={ (values: Map<string, FormValue>) => {
                                setIsAssociateLocalUserEnabled(
                                    values
                                        .get(JITProvisioningConstants.ASSOCIATE_LOCAL_USER)
                                        ?.includes(JITProvisioningConstants.ASSOCIATE_LOCAL_USER) || false
                                );
                            } }
                            children={ [ {
                                label: t("authenticationProvider:" +
                                    "forms.jitProvisioning.associateLocalUser.label"),
                                value: JITProvisioningConstants.ASSOCIATE_LOCAL_USER
                            } ] }
                            data-componentid={ `${ testId }-associate-local-user` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.associateLocalUser.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Header as="h5">
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.accountLookupAttributeMappings.heading") }
                        </Header>
                        <Hint>
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.accountLookupAttributeMappings.hint") }
                        </Hint>
                        {
                            isJITProvisioningEnabled && isAssociateLocalUserEnabled
                                ? (
                                    <Message
                                        type="info"
                                        content={ (
                                            <Trans
                                                i18nKey={ "authenticationProvider:forms.jitProvisioning." +
                                                    "accountLookupAttributeMappings.infoNotification" }
                                            >
                                                The local attribute dropdown displays attributes that have uniqueness
                                                constraints enabled. To configure additional attributes for lookup,
                                                configure uniqueness settings in the <Link
                                                    onClick={ handleLocalAttributeSectionNavigation }
                                                    external={ false }
                                                >
                                                    local attributes
                                                </Link> section.
                                            </Trans>
                                        ) }
                                        size="small"
                                    />
                                )
                                : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Segment padded>
                            <Header as="h6">
                                { t("authenticationProvider:" +
                                    "forms.jitProvisioning.accountLookupAttributeMappings." +
                                    "primary.heading") }
                            </Header>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column>
                                        <Field
                                            name={ JITProvisioningConstants.PRIMARY_FEDERATED_ATTRIBUTE }
                                            label={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "primary.federatedAttribute.label") }
                                            required={ false }
                                            type="text"
                                            placeholder={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "primary.federatedAttribute.placeholder") }
                                            value={
                                                initialValues?.accountLookupAttributeMappings?.[0]
                                                    ?.federatedAttribute || ""
                                            }
                                            data-componentid={ `${ testId }-primary-federated-attribute` }
                                            readOnly={ isReadOnly }
                                            disabled={ !isJITProvisioningEnabled || !isAssociateLocalUserEnabled }
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Field
                                            name={ JITProvisioningConstants.PRIMARY_LOCAL_ATTRIBUTE }
                                            label={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "primary.localAttribute.label") }
                                            required={ false }
                                            type="dropdown"
                                            placeholder={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "primary.localAttribute.placeholder") }
                                            value={
                                                initialValues?.accountLookupAttributeMappings?.[0]
                                                    ?.localAttribute || ""
                                            }
                                            children={ localClaimsOptions }
                                            loading={ isLocalClaimsLoading }
                                            data-componentid={ `${ testId }-primary-local-attribute` }
                                            readOnly={ isReadOnly }
                                            disabled={ !isJITProvisioningEnabled || !isAssociateLocalUserEnabled }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Segment padded>
                            <Header as="h6">
                                { t("authenticationProvider:" +
                                    "forms.jitProvisioning.accountLookupAttributeMappings." +
                                    "secondary.heading") }
                            </Header>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column>
                                        <Field
                                            name={ JITProvisioningConstants.SECONDARY_FEDERATED_ATTRIBUTE }
                                            label={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "secondary.federatedAttribute.label") }
                                            required={ false }
                                            type="text"
                                            placeholder={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "secondary.federatedAttribute.placeholder") }
                                            value={
                                                initialValues?.accountLookupAttributeMappings?.[1]
                                                    ?.federatedAttribute || ""
                                            }
                                            data-componentid={ `${ testId }-secondary-federated-attribute` }
                                            readOnly={ isReadOnly }
                                            disabled={ !isJITProvisioningEnabled || !isAssociateLocalUserEnabled }
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Field
                                            name={ JITProvisioningConstants.SECONDARY_LOCAL_ATTRIBUTE }
                                            label={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "secondary.localAttribute.label") }
                                            required={ false }
                                            type="dropdown"
                                            placeholder={ t("authenticationProvider:" +
                                                "forms.jitProvisioning.accountLookupAttributeMappings." +
                                                "secondary.localAttribute.placeholder") }
                                            value={
                                                initialValues?.accountLookupAttributeMappings?.[1]
                                                    ?.localAttribute || ""
                                            }
                                            children={ localClaimsOptions }
                                            loading={ isLocalClaimsLoading }
                                            data-componentid={ `${ testId }-secondary-local-attribute` }
                                            readOnly={ isReadOnly }
                                            disabled={ !isJITProvisioningEnabled || !isAssociateLocalUserEnabled }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                        <Field
                            name={ JITProvisioningConstants.SKIP_JIT_FOR_LOOKUP_FAILURE }
                            required={ false }
                            value={
                                initialValues?.isSkipJITForLookupFailure
                                    ? [ JITProvisioningConstants.SKIP_JIT_FOR_LOOKUP_FAILURE ]
                                    : []
                            }
                            type="checkbox"
                            children={ [ {
                                label: t("authenticationProvider:" +
                                    "forms.jitProvisioning.skipJITForLookupFailure.label"),
                                value: JITProvisioningConstants.SKIP_JIT_FOR_LOOKUP_FAILURE
                            } ] }
                            data-componentid={ `${ testId }-skip-jit-for-lookup-failure` }
                            readOnly={ isReadOnly }
                            disabled={ !isJITProvisioningEnabled || !isAssociateLocalUserEnabled }
                        />
                        <Hint>
                            { t("authenticationProvider:" +
                                "forms.jitProvisioning.skipJITForLookupFailure.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 7 }>
                        <Show when={ featureConfig?.identityProviders?.scopes?.update }>
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
