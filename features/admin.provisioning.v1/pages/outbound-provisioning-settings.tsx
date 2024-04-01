/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { getEmptyPlaceholderIllustrations } from "@wso2is/common/src/configs/ui";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AccordionTitleProps, Divider, Icon, Segment } from "semantic-ui-react";
import { OutboundProvisioningConfigurationInterface } from "../../admin.applications.v1/models/application";
import { OutboundProvisioningConnectorInterface } from "../../admin.connections.v1/models/connection";
import {
    AppConstants,
    AppState,
    AuthenticatorAccordion,
    FeatureConfigInterface,
    history
} from "../../admin.core.v1";
import { useIdentityProviderList } from "../../admin.identity-providers.v1/api/identity-provider";
import { IdentityProviderInterface } from "../../admin.identity-providers.v1/models/identity-provider";
import { updateResidentApplicationOutboundProvisioningList } from "../api/outbound-provisioning";
import {
    useGetResidentApplicationOutboundProvisioningConnectors
} from "../api/use-get-resident-outbound-provisioning-connectors";
import { OutboundProvisioningConnectorDeleteWizard } from "../components/outbound-provisioning-connector-delete-wizard";
import { OutboundProvisioningConnectorSetupForm } from "../components/outbound-provisioning-connector-setup-form";
import { OutboundProvisioningConnectorSetupWizard } from "../components/outbound-provisioning-connector-setup-wizard";

/**
 * Props interface of {@link OutboundProvisioningSettingsPage}
 */
type OutboundProvisioningSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Outbound provisioning settings page.
 *
 * @param props - Props injected to the component.
 * @returns Outbound provisioning settings page.
 */
const OutboundProvisioningSettingsPage: FunctionComponent<OutboundProvisioningSettingsPageInterface> = (
    props: OutboundProvisioningSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    /**
     * Check if the user has the required scopes to update the resident outbound provisioning configurations.
     */
    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    const [ isShowCreateWizard, setIsShowCreateWizard ] = useState(false);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);
    const [ filteredIdpList, setFilteredIdpList ] = useState<IdentityProviderInterface[]>([]);
    const [ deletingIdp, setDeletingIdp ] = useState<OutboundProvisioningConfigurationInterface>(null);
    const [ isShowDeleteConfirmationModal, setIsShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: residentProvisioningConfiguration,
        error: residentProvisioningConfigurationFetchError,
        isLoading: isLoadingResidentProvisioningConfiguration,
        mutate: mutateResidentProvisioningConfiguration
    } = useGetResidentApplicationOutboundProvisioningConnectors();

    const {
        data: identityProviderList,
        isLoading: isIdentityProviderListFetching,
        error: identityProviderFetchError
    } = useIdentityProviderList(null, null, null, "provisioning");

    /**
     * Filter the IDP list based on the configured, enabled outbound provisioning connectors count.
     */
    useEffect(() => {
        if (!isIdentityProviderListFetching && !identityProviderFetchError) {
            const filteredList: IdentityProviderInterface[] = identityProviderList?.identityProviders?.
                filter((idp: IdentityProviderInterface) => {
                    return idp.provisioning?.outboundConnectors?.connectors?.
                        some((connector: OutboundProvisioningConnectorInterface) => {
                            return connector.isEnabled;
                        });
                });

            setFilteredIdpList(filteredList);
        }
    }, [ isIdentityProviderListFetching, identityProviderFetchError, identityProviderList ]);

    /**
     * Show error if something went wrong while fetching resident provisioning configuration.
     */
    useEffect(() => {
        if (!isLoadingResidentProvisioningConfiguration && residentProvisioningConfigurationFetchError) {
            dispatch(addAlert({
                description: t("applications:resident.provisioning.outbound." +
                    "notifications.fetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("applications:resident.provisioning.outbound." +
                    "notifications.fetch.genericError.message")
            }));
        }
    }, [ residentProvisioningConfigurationFetchError ]);

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * Handles Outbound provisioning connector add/update.
     * @param configuration - Outbound provisioning connector to be added/updated.
     * @param isUpdating - Flag to determine whether the connector is being updated.
     */
    const onConnectorAdded = async (configuration: OutboundProvisioningConfigurationInterface, isUpdating: boolean) => {
        setIsSubmitting(true);

        const isConnectorExists: boolean = residentProvisioningConfiguration?.
            provisioningConfigurations?.outboundProvisioningIdps?.
            some((idp: OutboundProvisioningConfigurationInterface) => {
                return idp.idp === configuration.idp && idp.connector === configuration.connector;
            });

        // Block the user from adding the same connector twice.
        if (!isUpdating && isConnectorExists) {
            setIsSubmitting(false);
            setIsShowCreateWizard(false);

            dispatch(addAlert({
                description: t("applications:resident.provisioning.outbound." +
                    "notifications.create.error.description"),
                level: AlertLevels.ERROR,
                message: t("applications:resident.provisioning.outbound." +
                    "notifications.create.error.message")
            }));

            return;
        }

        const updatedOutboundProvisioningIdps: OutboundProvisioningConfigurationInterface[] = [
            ...residentProvisioningConfiguration?.provisioningConfigurations?.outboundProvisioningIdps
        ];

        const connectionExistsIndex: number = residentProvisioningConfiguration?.
            provisioningConfigurations?.outboundProvisioningIdps?.
            findIndex((idp: OutboundProvisioningConfigurationInterface) => {
                return idp.idp === configuration.idp;
            });

        if (connectionExistsIndex > -1) {
            // Delete the existing outbound provisioning IDP.
            updatedOutboundProvisioningIdps.splice(connectionExistsIndex, 1);
        }
        // Append the new outbound provisioning IDP.
        updatedOutboundProvisioningIdps.push(configuration);

        try {
            await updateResidentApplicationOutboundProvisioningList(updatedOutboundProvisioningIdps);
            setIsShowCreateWizard(false);
            if (isUpdating) {
                dispatch(addAlert({
                    description: t("applications:resident.provisioning.outbound." +
                        "notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:resident.provisioning.outbound." +
                        "notifications.update.success.message")
                }));
            } else {
                dispatch(addAlert({
                    description: t("applications:resident.provisioning.outbound." +
                        "notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:resident.provisioning.outbound." +
                        "notifications.create.success.message")
                }));
            }
            mutateResidentProvisioningConfiguration();
        } catch (error) {
            if (isUpdating) {
                dispatch(addAlert({
                    description: t("applications:resident.provisioning.outbound." +
                        "notifications.update.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:resident.provisioning.outbound." +
                        "notifications.update.genericError.message")
                }));
            } else {
                dispatch(addAlert({
                    description: t("applications:resident.provisioning.outbound." +
                        "notifications.create.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:resident.provisioning.outbound." +
                        "notifications.create.genericError.message")
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles Outbound provisioning connector delete.
     * @param configuration - Outbound provisioning connector to be deleted.
     */
    const onConnectorDeleted = async (configuration: OutboundProvisioningConfigurationInterface) => {
        const updatedOutboundProvisioningIdps: OutboundProvisioningConfigurationInterface[] = [
            ...residentProvisioningConfiguration?.provisioningConfigurations?.outboundProvisioningIdps
        ];

        const connectionExistsIndex: number = residentProvisioningConfiguration?.
            provisioningConfigurations?.outboundProvisioningIdps?.
            findIndex((idp: OutboundProvisioningConfigurationInterface) => {
                return idp.idp === configuration.idp;
            });

        if (connectionExistsIndex > -1) {
            // Delete the existing outbound provisioning IDP.
            updatedOutboundProvisioningIdps.splice(connectionExistsIndex, 1);
        }

        try {
            await updateResidentApplicationOutboundProvisioningList(updatedOutboundProvisioningIdps);
            setIsShowDeleteConfirmationModal(false);
            dispatch(addAlert({
                description: t("applications:resident.provisioning.outbound." +
                    "notifications.delete.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("applications:resident.provisioning.outbound." +
                    "notifications.delete.success.message")
            }));
            mutateResidentProvisioningConfiguration();
        } catch (error) {
            dispatch(addAlert({
                description: t("applications:resident.provisioning.outbound." +
                    "notifications.delete.genericError.description"),
                level: AlertLevels.SUCCESS,
                message: t("applications:resident.provisioning.outbound." +
                    "notifications.delete.genericError.message")
            }));
        }
    };

    /**
     * Handles accordion title click.
     *
     * @param e - Click event.
     * @param SegmentedAuthenticatedAccordion - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>,
        SegmentedAuthenticatedAccordion: AccordionTitleProps): void => {
        if (!SegmentedAuthenticatedAccordion) {
            return;
        }
        const newIndexes: number[] = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(SegmentedAuthenticatedAccordion.accordionIndex)) {
            const removingIndex: number = newIndexes.indexOf(SegmentedAuthenticatedAccordion.accordionIndex);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(SegmentedAuthenticatedAccordion.accordionIndex);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    return (
        <PageLayout
            pageTitle={ t("applications:resident.provisioning.outbound.heading") }
            title={ t("applications:resident.provisioning.outbound.heading") }
            description={ t("applications:resident.provisioning.outbound.subHeading") }
            data-componentid={ `${ componentId }-layout` }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            action={ residentProvisioningConfiguration?.
                provisioningConfigurations?.outboundProvisioningIdps?.length > 0
                && ( !isReadOnly
                    && (
                        <PrimaryButton
                            onClick={ () => setIsShowCreateWizard(true) }
                            data-componentid={ `${ componentId }-add-button` }
                        >
                            <Icon name="add"/>
                            { t("applications:resident." +
                                "provisioning.outbound.emptyPlaceholder.action") }
                        </PrimaryButton>
                    )
                ) }
        >
            <Divider hidden />
            <>
                { residentProvisioningConfiguration?.provisioningConfigurations?.outboundProvisioningIdps?.length > 0
                    ? (
                        <>
                            {
                                residentProvisioningConfiguration?.
                                    provisioningConfigurations?.outboundProvisioningIdps?.map(
                                        (provisioningIdp: OutboundProvisioningConfigurationInterface,
                                            index: number) => {
                                            return (
                                                <AuthenticatorAccordion
                                                    key={ provisioningIdp.idp }
                                                    globalActions={ [
                                                        !isReadOnly && {
                                                            icon: "trash alternate",
                                                            onClick: (): void => {
                                                                setIsShowDeleteConfirmationModal(true);
                                                                setDeletingIdp(provisioningIdp);
                                                            },
                                                            type: "icon"
                                                        }
                                                    ] }
                                                    authenticators={
                                                        [
                                                            {
                                                                content: (
                                                                    <OutboundProvisioningConnectorSetupForm
                                                                        initialValues={ provisioningIdp }
                                                                        triggerSubmit={ null }
                                                                        onSubmit={ (
                                                                            // eslint-disable-next-line max-len
                                                                            values: OutboundProvisioningConfigurationInterface
                                                                        ) => onConnectorAdded(values, true) }
                                                                        idpList={ filteredIdpList }
                                                                        // eslint-disable-next-line max-len
                                                                        data-componentid={ `${ componentId }-${provisioningIdp.idp}-form` }
                                                                        isSubmitting={ isSubmitting }
                                                                        isReadOnly={ isReadOnly }
                                                                        isEdit
                                                                    />
                                                                ),
                                                                id: provisioningIdp?.idp,
                                                                title: provisioningIdp?.idp
                                                            }
                                                        ]
                                                    }
                                                    accordionActiveIndexes = { accordionActiveIndexes }
                                                    accordionIndex = { index }
                                                    handleAccordionOnClick = { handleAccordionOnClick }
                                                    data-componentid={
                                                        `${ componentId }-${provisioningIdp.idp}-
                                                            outbound-connector-accordion`
                                                    }
                                                />
                                            );
                                        })
                            }
                        </>
                    ) : (
                        <Segment>
                            <EmptyPlaceholder
                                title={
                                    t("applications:resident." +
                                        "provisioning.outbound.emptyPlaceholder.title")
                                }
                                image={ getEmptyPlaceholderIllustrations().emptyList }
                                subtitle={ [
                                    t("applications:resident." +
                                        "provisioning.outbound.emptyPlaceholder.subtitles")
                                ] }
                                imageSize="tiny"
                                action={ (
                                    <PrimaryButton
                                        onClick={ () => setIsShowCreateWizard(true) }
                                        data-componentid={ `${ componentId }-add-button` }
                                    >
                                        <Icon name="add"/>
                                        { t("applications:resident." +
                                            "provisioning.outbound.emptyPlaceholder.action") }
                                    </PrimaryButton>
                                ) }
                            />
                        </Segment>
                    )
                }
            </>

            { isShowCreateWizard && (
                <OutboundProvisioningConnectorSetupWizard
                    closeWizard={ () => setIsShowCreateWizard(false) }
                    onUpdate={ (
                        values: OutboundProvisioningConfigurationInterface
                    ) => onConnectorAdded(values , false) }
                    isSubmitting={ isSubmitting }
                    availableIdpList={ filteredIdpList }
                />
            ) }

            { isShowDeleteConfirmationModal && (
                <OutboundProvisioningConnectorDeleteWizard
                    isOpen={ isShowDeleteConfirmationModal }
                    onClose={ () => setIsShowDeleteConfirmationModal(false) }
                    deletingIdp={ deletingIdp }
                    onConfirm={ onConnectorDeleted }
                />
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OutboundProvisioningSettingsPage.defaultProps = {
    "data-componentid": "outbound-provisioning-settings-page"
};

export default OutboundProvisioningSettingsPage;
