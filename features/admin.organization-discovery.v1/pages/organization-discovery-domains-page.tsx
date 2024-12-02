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

import Alert from "@oxygen-ui/react/Alert";
import { useRequiredScopes } from "@wso2is/access-control";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    history
} from "@wso2is/admin.core.v1";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment, Link, PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Checkbox,
    CheckboxProps,
    Divider
} from "semantic-ui-react";
import { ConnectorPropertyInterface } from "../../admin.connections.v1";
import {
    ServerConfigurationsConstants,
    UpdateGovernanceConnectorConfigPropertyInterface,
    useGetGovernanceConnectorById
} from "../../admin.server-configurations.v1";
import updateOrganizationDiscoveryConfig from "../api/update-organization-discovery-config";
import useGetOrganizationDiscovery from "../api/use-get-organization-discovery";
import useGetOrganizationDiscoveryConfig from "../api/use-get-organization-discovery-config";
import DiscoverableOrganizationsListLayout from "../components/discoverable-organizations-list-layout";
import { OrganizationDiscoveryConfigConstants } from "../constants/organization-discovery-config-constants";
import { OrganizationDiscoveryConstants } from "../constants/organization-discovery-constants";
import { OrganizationDiscoveryConfigInterface } from "../models/organization-discovery";

/**
 * Props interface of {@link OrganizationDiscoveryDomainsPage}
 */
type OrganizationDiscoveryDomainsPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const OrganizationDiscoveryDomainsPage: FunctionComponent<OrganizationDiscoveryDomainsPageInterface> = (
    props: OrganizationDiscoveryDomainsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const isEmailDomainDiscoveryForSelfRegFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig?.organizationDiscovery,
        OrganizationDiscoveryConstants.FEATURE_DICTIONARY.get("ORGANIZATION_DISCOVERY_EMAIL_DOMAIN_FOR_SELF_REG"));
    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.organizationDiscovery?.scopes?.update);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);

    const filterQuery: string = useMemo(() => {
        let filterQuery: string = "";

        filterQuery = searchQuery;

        return filterQuery;
    }, [ searchQuery ]);

    const {
        data: organizationDiscoveryConfig,
        error: organizationDiscoveryConfigFetchRequestError,
        mutate: mutateOrganizationDiscoveryConfigFetchRequest
    } = useGetOrganizationDiscoveryConfig();

    const {
        data: discoverableOrganizations,
        error: discoverableOrganizationsFetchRequestError,
        isLoading: isDiscoverableOrganizationsFetchRequestLoading
    } = useGetOrganizationDiscovery(true, filterQuery, listOffset, listItemLimit);

    const {
        data: selfRegistrationConnectorDetetails
    } = useGetGovernanceConnectorById(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID);

    const { isOrganizationDiscoveryEnabled, isEmailDomainBasedSelfRegistrationEnabled } = organizationDiscoveryConfig;
    const [ isSelfRegEnabled, setIsSelfRegEnabled ] = useState<boolean>(false);

    useEffect(() => {
        const selfRegEnabledProperty: UpdateGovernanceConnectorConfigPropertyInterface =
            selfRegistrationConnectorDetetails?.properties?.find((property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
            );

        setIsSelfRegEnabled(selfRegEnabledProperty?.value === "true");
    }, [ selfRegistrationConnectorDetetails ]);

    const handleEmailDomainBasedSelfRegistration = (value: boolean): void => {
        const updateData: OrganizationDiscoveryConfigInterface = {
            properties: []
        };

        updateData.properties.push({
            key: OrganizationDiscoveryConfigConstants.EMAIL_DOMAIN_DISCOVERY_PROPERTY_KEY,
            value: isOrganizationDiscoveryEnabled.toString()
        });

        updateData.properties.push({
            key: OrganizationDiscoveryConfigConstants.EMAIL_DOMAIN_DISCOVERY_SELF_REG_PROPERTY_KEY,
            value: value.toString()
        });

        updateOrganizationDiscoveryConfig(updateData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: value ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainBasedSelfRegistration.success.description"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainBasedSelfRegistration.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: value ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainBasedSelfRegistration.success.message"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainBasedSelfRegistration.success.message"
                        )
                    })
                );

                mutateOrganizationDiscoveryConfigFetchRequest();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: value ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainBasedSelfRegistration.error.description"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainBasedSelfRegistration.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: value ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainBasedSelfRegistration.error.message"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainBasedSelfRegistration.error.message"
                        )
                    })
                );
            });
    };

    /**
     * Handle error scenarios of the organization discovery config fetch request.
     */
    useEffect(() => {
        if (!organizationDiscoveryConfigFetchRequestError) {
            return;
        }

        if (organizationDiscoveryConfigFetchRequestError.response?.status === 404) {
            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "organizationDiscovery:notifications." +
                            "getEmailDomainDiscovery.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "organizationDiscovery:notifications." +
                            "getEmailDomainDiscovery.error.message"
                )
            })
        );
    }, [ organizationDiscoveryConfigFetchRequestError ]);

    /**
     * Handle error scenarios of the discoverable organizations fetch request.
     */
    useEffect(() => {
        if (!discoverableOrganizationsFetchRequestError) {
            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "organizationDiscovery:notifications." +
                    "getOrganizationListWithDiscovery.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "organizationDiscovery:notifications." +
                "getOrganizationListWithDiscovery.error.message"
                )
            })
        );
    }, [ discoverableOrganizationsFetchRequestError ]);

    /**
     * This is called when the enable toggle changes.
     *
     * @param e - Event object
     * @param data -  The data object.
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps): void => {
        const updateData: OrganizationDiscoveryConfigInterface = {
            properties: []
        };

        if (data.checked === true) {
            updateData.properties.push({
                key: OrganizationDiscoveryConfigConstants.EMAIL_DOMAIN_DISCOVERY_PROPERTY_KEY,
                value: "true"
            });
        } else {
            updateData.properties.push({
                key: OrganizationDiscoveryConfigConstants.EMAIL_DOMAIN_DISCOVERY_PROPERTY_KEY,
                value: "false"
            });

            updateData.properties.push({
                key: OrganizationDiscoveryConfigConstants.EMAIL_DOMAIN_DISCOVERY_SELF_REG_PROPERTY_KEY,
                value: "false"
            });
        }

        updateOrganizationDiscoveryConfig(updateData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: data.checked ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainDiscovery.success.description"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainDiscovery.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: data.checked ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainDiscovery.success.message"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainDiscovery.success.message"
                        )
                    })
                );

                mutateOrganizationDiscoveryConfigFetchRequest();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: data.checked ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainDiscovery.error.description"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainDiscovery.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: data.checked ? t(
                            "organizationDiscovery:notifications." +
                            "enableEmailDomainDiscovery.error.message"
                        ) : t(
                            "organizationDiscovery:notifications." +
                            "disableEmailDomainDiscovery.error.message"
                        )
                    })
                );
            });
    };

    /**
     * This renders the enable toggle.
     */
    const discoveryToggle = (): ReactElement => {
        return (
            <Checkbox
                label={ t("organizationDiscovery:" +
                    "emailDomains.actions.enable") }
                toggle
                onChange={ handleToggle }
                checked={ isOrganizationDiscoveryEnabled }
                data-testId={ `${ testId }-enable-toggle` }
                readOnly={ isReadOnly }
            />
        );
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    return (
        <PageLayout
            pageTitle={ t("pages:emailDomainDiscovery.title") }
            title={ t("pages:emailDomainDiscovery.title") }
            description={ t("pages:emailDomainDiscovery.subTitle") }
            data-componentid={ `${ testId }-page-layout` }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
        >
            { discoveryToggle() }
            <Divider hidden />
            <Alert severity="info">
                { t("organizationDiscovery:message") }
            </Alert>
            <Divider hidden />
            { isOrganizationDiscoveryEnabled && (
                <>
                    { isEmailDomainDiscoveryForSelfRegFeatureEnabled && (
                        <EmphasizedSegment
                            padded={ true }
                        >
                            <Form>
                                <Field.Checkbox
                                    ariaLabel="emailDomainBasedSelfRegistration"
                                    name="emailDomainBasedSelfRegistration"
                                    label={ t("organizationDiscovery:selfRegistration.label") }
                                    listen={ (value: boolean) => handleEmailDomainBasedSelfRegistration(value) }
                                    checked={ isEmailDomainBasedSelfRegistrationEnabled }
                                    disabled={ !isSelfRegEnabled }
                                    width={ 16 }
                                    data-testid={ `${testId}-notify-account-confirmation` }
                                    hint={ isSelfRegEnabled && t("organizationDiscovery:selfRegistration.labelHint") }
                                />
                                { !isSelfRegEnabled && (
                                    <Alert severity="info">
                                        <Trans
                                            i18nKey={ "organizationDiscovery:selfRegistration.message" }
                                        >
                                            Enable
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths().get(
                                                            "GOVERNANCE_CONNECTOR_EDIT").replace(
                                                            ":categoryId",
                                                            ServerConfigurationsConstants.
                                                                USER_ONBOARDING_CONNECTOR_ID
                                                        ).replace(
                                                            ":connectorId",
                                                            ServerConfigurationsConstants.
                                                                SELF_SIGN_UP_CONNECTOR_ID
                                                        )
                                                    );
                                                } }
                                            >self-registration
                                            </Link>
                                            to allow domain discovery for self-registration.
                                        </Trans>
                                    </Alert>
                                ) }
                            </Form>
                        </EmphasizedSegment>
                    ) }
                    <DiscoverableOrganizationsListLayout
                        discoverableOrganizations={ discoverableOrganizations }
                        listItemLimit = { listItemLimit }
                        isDiscoverableOrganizationsFetchRequestLoading = {
                            isDiscoverableOrganizationsFetchRequestLoading }
                        featureConfig = { featureConfig }
                        onListItemLimitChange={ setListItemLimit }
                        onListOffsetChange={ setListOffset }
                        searchQuery= { searchQuery }
                        onSearchQueryChange={ setSearchQuery }
                    />
                </>
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OrganizationDiscoveryDomainsPage.defaultProps = {
    "data-componentid": "organization-discovery-domains-page"
};

export default OrganizationDiscoveryDomainsPage;
