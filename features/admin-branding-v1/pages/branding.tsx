/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { OrganizationType } from "@wso2is/common";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    GenericIcon,
    Message,
    PageLayout,
    useDocumentation,
    useMediaContext
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import pick from "lodash-es/pick";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ExtendedFeatureConfigInterface } from "../../../extensions/configs/models";
import { EventPublisher } from "../../admin-core-v1";
import { AppState } from "../../admin-core-v1/store";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { OrganizationResponseInterface } from "../../organizations/models/organizations";
import { deleteBrandingPreference, updateBrandingPreference } from "../api";
import deleteAllCustomTextPreferences from "../api/delete-all-custom-text-preference";
import useGetBrandingPreferenceResolve from "../api/use-get-branding-preference-resolve";
import useGetCustomTextPreferenceResolve from "../api/use-get-custom-text-preference-resolve";
import { BrandingPreferenceTabs, DesignFormValuesInterface } from "../components";
import { BrandingPreferencesConstants } from "../constants";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { BrandingPreferenceMeta, LAYOUT_PROPERTY_KEYS } from "../meta";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceInterface,
    BrandingPreferenceLayoutInterface,
    BrandingPreferenceThemeInterface,
    PredefinedLayouts,
    PredefinedThemes
} from "../models";
import BrandingPreferenceProvider from "../providers/branding-preference-provider";
import { BrandingPreferenceUtils } from "../utils";

/**
 * Prop-types for the branding page component.
 */
type BrandingPageInterface = IdentifiableComponentInterface;

/**
 * Should show the org logo in the page title?
 */
const SHOW_ORGANIZATION_LOGO_IN_PAGE_TITLE: boolean = false;

/**
 * Branding page.
 *
 * @param props - Props injected to the component.
 * @returns Branding page component.
 */
const BrandingPage: FunctionComponent<BrandingPageInterface> = (
    props: BrandingPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const { isGreaterThanComputerViewport } = useMediaContext();
    const { organizationType } = useGetCurrentOrganizationType();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const productName: string = useSelector((state: AppState) => state.config.ui.productName);
    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state?.organization?.organization
    );

    const [ isBrandingConfigured, setIsBrandingConfigured ] = useState<boolean>(true);
    const [
        predefinedThemes,
        setPredefinedThemes
    ] = useState<BrandingPreferenceThemeInterface>(BrandingPreferencesConstants.DEFAULT_PREFERENCE.theme);
    const [
        predefinedLayouts,
        setPredefinedLayouts
    ] = useState<BrandingPreferenceLayoutInterface>(BrandingPreferencesConstants.DEFAULT_PREFERENCE.layout);

    const DEFAULT_PREFERENCE: BrandingPreferenceInterface = useMemo(
        () =>
            BrandingPreferenceUtils.getDefaultBrandingPreference({
                layout: predefinedLayouts,
                theme: predefinedThemes
            }),
        [ predefinedThemes, predefinedLayouts ]
    );

    const [
        brandingPreference,
        setBrandingPreference
    ] = useState<BrandingPreferenceInterface>(DEFAULT_PREFERENCE);
    const [
        isBrandingPreferenceUpdateRequestLoading,
        setIsBrandingPreferenceUpdateRequestLoading
    ] = useState<boolean>(undefined);
    const [
        isBrandingPreferenceDeleteRequestLoading,
        setIsBrandingPreferenceDeleteRequestLoading
    ] = useState<boolean>(undefined);
    const [
        isBrandingFeatureRequestLoading,
        setIsBrandingFeatureRequestLoading
    ] = useState<boolean>(undefined);
    const [ showRevertConfirmationModal, setShowRevertConfirmationModal ] = useState<boolean>(false);
    const [ preferenceTabsComponentKey, setPreferenceTabsComponentKey ] = useState(1);
    const [
        showBrandingPublishStatusConfirmationModal,
        setShowBrandingPublishStatusConfirmationModal
    ] = useState<boolean>(false);
    const [ isBrandingPublished, setIsBrandingPublished ] = useState<boolean>(false);
    const [ showSubOrgBrandingUpdateAlert, setShowSubOrgBrandingUpdateAlert ] = useState<boolean>(false);
    const [ showSubOrgBrandingDeleteAlert, setShowSubOrgBrandingDeleteAlert ] = useState<boolean>(false);
    const [ showResolutionDisclaimerMessage, setShowResolutionDisclaimerMessage ] = useState<boolean>(false);
    const [ selectedLayout, setSelectedLayout ] = useState<PredefinedLayouts>(DEFAULT_PREFERENCE.layout.activeLayout);
    const [ currentWidth, setCurrentWidth ] = useState<number>(0);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isReadOnly: boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.branding,
        featureConfig?.branding?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const {
        data: originalBrandingPreference,
        isLoading: isBrandingPreferenceFetchRequestLoading,
        error: brandingPreferenceFetchRequestError,
        mutate: mutateBrandingPreferenceFetchRequest
    } = useGetBrandingPreferenceResolve(tenantDomain);

    const {
        mutate: mutateCustomTextPreferenceFetchRequest
    } = useGetCustomTextPreferenceResolve(true, tenantDomain, "common", CustomTextPreferenceConstants.DEFAULT_LOCALE);

    const isBrandingPageLoading: boolean = useMemo(
        () =>
            !tenantDomain ||
            isBrandingPreferenceFetchRequestLoading === undefined ||
                isBrandingPreferenceFetchRequestLoading === true,
        [ tenantDomain, isBrandingPreferenceFetchRequestLoading ]
    );

    /**
     * Publish page visit insights.
     */
    useEffect(() => {
        eventPublisher.publish("page-visit-organization-branding");
    }, []);

    /**
     * Get default layout preferences.
     */
    useEffect(() => {
        setPredefinedLayouts({
            activeLayout: BrandingPreferencesConstants.DEFAULT_LAYOUT,
            ...BrandingPreferenceMeta.getLayouts()
        });
    }, []);

    useEffect(() => {
        setShowResolutionDisclaimerMessage(
            BrandingPreferenceUtils.isLayoutPreviewTrimmed(selectedLayout, currentWidth)
        );
    }, [ selectedLayout, currentWidth ]);

    /**
     * Moderates the Branding Peference response.
     */
    useEffect(() => {
        if (!originalBrandingPreference) {
            return;
        }

        if (originalBrandingPreference instanceof IdentityAppsApiException) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.branding.notifications.fetch.invalidStatus.description",
                    { tenant: tenantDomain }),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.branding.notifications.fetch.invalidStatus.message")
            }));

            return;
        }

        if (organizationType === OrganizationType.SUBORGANIZATION
            && originalBrandingPreference?.name !== currentOrganization?.id) {
            // This means the sub-org has no branding preference configured.
            // It gets the branding preference from the parent org.
            setIsBrandingConfigured(false);
        } else {
            setIsBrandingConfigured(true);
        }

        setBrandingPreference(BrandingPreferenceUtils.migrateLayoutPreference(
            BrandingPreferenceUtils.migrateThemePreference(
                originalBrandingPreference.preference,
                {
                    theme: predefinedThemes
                }
            ),
            {
                layout: predefinedLayouts
            }
        ));
        setSelectedLayout(originalBrandingPreference.preference.layout.activeLayout);
    }, [ originalBrandingPreference ]);

    /**
     * Handles the Branding Preference fetch request errors.
     */
    useEffect(() => {
        if (!brandingPreferenceFetchRequestError) {
            return;
        }

        // Check if Branding is not configured for the tenant. If so, silent the errors.
        if (brandingPreferenceFetchRequestError.response?.data?.code
            === BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE) {
            setIsBrandingConfigured(false);
            setBrandingPreference(DEFAULT_PREFERENCE);

            return;
        }

        dispatch(addAlert<AlertInterface>({
            description: t("extensions:develop.branding.notifications.fetch.genericError.description",
                { tenant: tenantDomain }),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.branding.notifications.fetch.genericError.message")
        }));

        setBrandingPreference(DEFAULT_PREFERENCE);
    }, [ brandingPreferenceFetchRequestError ]);

    /**
     * Resolves the theme variables on component mount.
     */
    useEffect(() => {

        if (!theme) {
            return;
        }

        BrandingPreferenceUtils.getPredefinedThemePreferences(theme)
            .then((response: BrandingPreferenceThemeInterface) => {
                setPredefinedThemes({
                    ...predefinedThemes,
                    ...response
                });
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            });
    }, [ theme ]);

    /**
     * Handles preference form submit action.
     *
     * @param values - Form values.
     * @param shouldShowNotifications - Should show success/error notifications on UI.
     */
    const handlePreferenceFormSubmit = (
        values: Partial<BrandingPreferenceInterface>,
        shouldShowNotifications: boolean
    ): void => {

        eventPublisher.compute(() => {
            // If a site title is updated, publish an event.
            if (isEmpty(brandingPreference.organizationDetails.siteTitle)
                && !isEmpty(values.organizationDetails?.siteTitle)) {
                eventPublisher.publish("organization-branding-configure-site-title");
            }

            // If a display name is updated, publish an event.
            if (isEmpty(brandingPreference.organizationDetails.displayName)
                && !isEmpty(values.organizationDetails?.displayName)) {
                eventPublisher.publish("organization-branding-configure-display-name");
            }

            // When a theme is selected for the first time or switched, publish an event.
            if (isEmpty(brandingPreference.theme?.activeTheme)) {
                eventPublisher.publish(`organization-branding-configure-${
                    values.theme.activeTheme.toLocaleLowerCase() }-theme`);
            } else if (brandingPreference.theme?.activeTheme && !isEmpty(values.theme?.activeTheme)) {
                if (brandingPreference.theme.activeTheme !== values.theme.activeTheme) {
                    eventPublisher.publish(
                        `organization-branding-switch-from-${
                            brandingPreference.theme.activeTheme.toLocaleLowerCase()
                        }-theme-to-${ values.theme.activeTheme }-theme`);
                }
            }

            // When a privacy policy is configured, publish an event.
            if (isEmpty(brandingPreference.urls?.privacyPolicyURL)
                && !isEmpty(values.urls?.privacyPolicyURL)) {
                eventPublisher.publish("organization-branding-configure-privacy-policy");
            }

            // When a cookie policy is configured, publish an event.
            if (isEmpty(brandingPreference.urls?.cookiePolicyURL)
                && !isEmpty(values.urls?.cookiePolicyURL)) {
                eventPublisher.publish("organization-branding-configure-cookie-policy");
            }

            // When a tos is configured, publish an event.
            if (isEmpty(brandingPreference.urls?.termsOfUseURL)
                && !isEmpty(values.urls?.termsOfUseURL)) {
                eventPublisher.publish("organization-branding-configure-tos");
            }
        });

        const mergedBrandingPreference: BrandingPreferenceInterface =  merge(cloneDeep(brandingPreference), values);

        // Filter the layout section and remove unrelated properties.
        const layoutSection: BrandingPreferenceLayoutInterface = { ...mergedBrandingPreference.layout };
        const filteredLayoutSection: BrandingPreferenceLayoutInterface = {
            activeLayout: layoutSection.activeLayout,
            ...pick(layoutSection, LAYOUT_PROPERTY_KEYS[layoutSection.activeLayout])
        };

        mergedBrandingPreference.layout = filteredLayoutSection;
        mergedBrandingPreference.configs.isBrandingEnabled = true;


        _updateBrandingPreference(mergedBrandingPreference, isBrandingConfigured, true, shouldShowNotifications);
    };

    /**
     * Handles branding feature enablement action.
     */
    const handleBrandingPublishStatus = (): void => {
        setIsBrandingFeatureRequestLoading(true);
        _updateBrandingPreference(merge(cloneDeep(brandingPreference), {
            configs: {
                isBrandingEnabled: isBrandingPublished
            }
        }), isBrandingConfigured, false);
    };

    /**
     * Function to update the Branding Preferences using the API.
     *
     * @param preference - Preference object.
     * @param _isBrandingConfigured - Local flag passed as a param to determine if branding is configured.
     * @param setRequestLoadingState - Should set the request loading states?
     */
    const _updateBrandingPreference = (
        preference: BrandingPreferenceInterface,
        _isBrandingConfigured: boolean,
        setRequestLoadingState: boolean = true,
        shouldShowNotifications: boolean = true
    ): void => {

        // Only set the request loading states if flag is set to true.
        // Needed to be false for the publish toggle, else the save button's loading state will be shown
        // when the publish toggle is triggered.
        if (setRequestLoadingState) {
            setIsBrandingPreferenceUpdateRequestLoading(true);
        }

        updateBrandingPreference(_isBrandingConfigured, tenantDomain, preference)
            .then((response: BrandingPreferenceAPIResponseInterface) => {
                if (response instanceof IdentityAppsApiException) {
                    if (shouldShowNotifications) {
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.branding.notifications.update.invalidStatus.description",
                                { tenant: tenantDomain }),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.branding.notifications.update.invalidStatus.message")
                        }));
                    }

                    return;
                }

                setIsBrandingConfigured(true);
                // By defefault, when preference is saved, we set the enable to true.
                setIsBrandingPublished(true);
                setBrandingPreference(
                    BrandingPreferenceUtils.migrateLayoutPreference(
                        response.preference,
                        {
                            layout: predefinedLayouts
                        }
                    )
                );

                if (shouldShowNotifications) {
                    if(organizationType !== OrganizationType.SUBORGANIZATION) {
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.branding.notifications.update.success.description",
                                { tenant: tenantDomain }),
                            level: AlertLevels.SUCCESS,
                            message: t("extensions:develop.branding.notifications.update.success.message")
                        }));
                    } else {
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.branding.notifications.update.successWaiting."
                                + "description", { tenant: tenantDomain }),
                            level: AlertLevels.WARNING,
                            message: t("extensions:develop.branding.notifications.update.successWaiting.message")
                        }));

                        handleSubOrgAlerts();
                    }

                }
            })
            .catch((error: IdentityAppsApiException) => {
                // Edge Case...Try again with POST, if Branding preference has been removed due to concurrent sessions.
                if (error.code === BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE) {
                    setIsBrandingConfigured(false);
                    _updateBrandingPreference(preference, false, setRequestLoadingState, shouldShowNotifications);

                    return;
                }

                if (shouldShowNotifications) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.branding.notifications.update.genericError.description",
                            { tenant: tenantDomain }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.branding.notifications.update.genericError.message")
                    }));
                }

                if (originalBrandingPreference
                    && !(originalBrandingPreference instanceof IdentityAppsApiException)) {
                    setBrandingPreference(BrandingPreferenceUtils.migrateLayoutPreference(
                        BrandingPreferenceUtils.migrateThemePreference(
                            originalBrandingPreference.preference,
                            {
                                theme: predefinedThemes
                            }
                        ),
                        {
                            layout: predefinedLayouts
                        }
                    ));
                } else {
                    setBrandingPreference(DEFAULT_PREFERENCE);
                }
            })
            .finally(() => {
                setIsBrandingFeatureRequestLoading(false);
                setShowBrandingPublishStatusConfirmationModal(false);
                if (setRequestLoadingState) {
                    setIsBrandingPreferenceUpdateRequestLoading(false);
                }
            });
    };

    /**
     * Handles the publish/un-publish toggle onchange callback.
     */
    const handleBrandingUnpublish = (): void => {
        setIsBrandingPublished(false);
        setShowBrandingPublishStatusConfirmationModal(true);
    };

    /**
     * Handles the alert for sub-orgs.
     */
    const handleSubOrgAlerts = (): void => {
        if (showSubOrgBrandingUpdateAlert) {
            setShowSubOrgBrandingUpdateAlert(false);
            setShowSubOrgBrandingDeleteAlert(true);
        } else {
            setShowSubOrgBrandingDeleteAlert(false);
            setShowSubOrgBrandingUpdateAlert(true);
        }
    };

    /**
     * Handles the delete operation of branding preference via the API.
     */
    const handleBrandingPreferenceDelete = (): void => {

        setIsBrandingPreferenceDeleteRequestLoading(true);

        Promise.all([ deleteBrandingPreference(tenantDomain), deleteAllCustomTextPreferences() ])
            .then(
                (values: any) => {
                    const [ deleteBrandingPreferenceResponse, deleteCustomTextPreferenceResponse ] = values;

                    const isBrandingPreferenceDeleteError: boolean =
                    deleteBrandingPreferenceResponse instanceof IdentityAppsApiException;
                    const isCustomTextPreferenceDeleteError: boolean =
                    deleteCustomTextPreferenceResponse instanceof IdentityAppsApiException;

                    if (isBrandingPreferenceDeleteError || isCustomTextPreferenceDeleteError) {
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.branding.notifications.delete.invalidStatus.description",
                                { tenant: tenantDomain }),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.branding.notifications.delete.invalidStatus.message")
                        }));

                        return;
                    }

                    setIsBrandingConfigured(false);
                    setBrandingPreference(DEFAULT_PREFERENCE);
                    mutateBrandingPreferenceFetchRequest();
                    mutateCustomTextPreferenceFetchRequest();

                    // Increment the tabs component key to remount the component on branding revert.
                    setPreferenceTabsComponentKey(preferenceTabsComponentKey + 1);

                    if(organizationType !== OrganizationType.SUBORGANIZATION) {
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.branding.notifications.delete.success.description",
                                { tenant: tenantDomain }),
                            level: AlertLevels.SUCCESS,
                            message: t("extensions:develop.branding.notifications.delete.success.message")
                        }));
                    } else {
                        dispatch(addAlert<AlertInterface>({
                            description: t(
                                "extensions:develop.branding.notifications.delete." +
                                "successWaiting.description",
                                { tenant: tenantDomain }
                            ),
                            level: AlertLevels.WARNING,
                            message: t("extensions:develop.branding.notifications.delete.successWaiting.message")
                        }));

                        handleSubOrgAlerts();
                    }
                }
            ).catch((error: IdentityAppsApiException) => {

                let description: string = t("extensions:develop.branding.notifications.delete.genericError" +
                    ".description", { tenant: tenantDomain });
                let message: string = t("extensions:develop.branding.notifications.delete.genericError.message");

                // If branding is not configured, but user tried deleting anyway.
                if (error.code === BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE) {
                    description = t("extensions:develop.branding.notifications.delete.notConfigured" +
                        ".description", { tenant: tenantDomain });
                    message = t("extensions:develop.branding.notifications.delete.notConfigured.message");
                }

                dispatch(addAlert<AlertInterface>({
                    description: description,
                    level: AlertLevels.ERROR,
                    message: message
                }));
            })
            .finally(() => {
                setIsBrandingPreferenceDeleteRequestLoading(false);
                setShowRevertConfirmationModal(false);
            });
    };

    return (
        <BrandingPreferenceProvider>
            <PageLayout
                pageTitle="Branding"
                bottomMargin={ false }
                image={ SHOW_ORGANIZATION_LOGO_IN_PAGE_TITLE && (
                    <GenericIcon
                        square
                        relaxed
                        transparent
                        bordered
                        rounded
                        icon={
                            !isEmpty(
                                brandingPreference.theme[ brandingPreference.theme.activeTheme ]?.images?.logo?.imgURL
                            )
                                ? brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                                : BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(theme)
                                    .theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                        }
                        inverted={ brandingPreference.theme.activeTheme === PredefinedThemes.DARK }
                        size="tiny"
                        data-componentid={ `${ componentId }-organization-logo` }
                    />
                ) }
                title={ (
                    <div className="title-container">
                        <div className="title-container-heading">
                            { t("extensions:develop.branding.pageHeader.title") }
                        </div>
                    </div>
                ) }
                description={ (
                    <div className="with-label">
                        { t("extensions:develop.branding.pageHeader.description") }
                        <DocumentationLink
                            link={ getLink("develop.branding.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </div>
                ) }
                data-componentid={ `${ componentId }-layout` }
                className="branding-page"
            >
                {
                    !isBrandingPageLoading && !brandingPreference.configs?.isBrandingEnabled && (
                        <Message
                            info
                            floating
                            attached="top"
                            className="preview-disclaimer"
                            content={
                                (
                                    <>
                                        { t("extensions:develop.branding.publishToggle.hint") }
                                    </>
                                )
                            }
                            data-componentid="branding-preference-preview-disclaimer"
                        />
                    )
                }
                {
                    showSubOrgBrandingUpdateAlert
                        ? (
                            <Alert onClose={ () => setShowSubOrgBrandingUpdateAlert(false) } severity="warning">
                                { t("extensions:develop.branding.notifications.update.successWaitingAlert.description",
                                    { tenant: tenantDomain }) }
                            </Alert>
                        ) : null
                }
                {
                    showSubOrgBrandingDeleteAlert
                        ? (
                            <Alert onClose={ () => setShowSubOrgBrandingDeleteAlert(false) } severity="warning">
                                { t("extensions:develop.branding.notifications.delete.successWaitingAlert.description",
                                    { tenant: tenantDomain }) }
                            </Alert>
                        ) : null
                }
                {
                    showResolutionDisclaimerMessage && (
                        <Message
                            info
                            floating
                            attached="top"
                            className="preview-disclaimer"
                            content={
                                (
                                    <>
                                        { t("extensions:develop.branding.pageResolution.hint") }
                                    </>
                                )
                            }
                            data-componentid="branding-preference-resolution-disclaimer"
                        />
                    )
                }
                <BrandingPreferenceTabs
                    key={ preferenceTabsComponentKey }
                    predefinedThemes={ predefinedThemes }
                    brandingPreference={ brandingPreference }
                    isLoading={ isBrandingPageLoading }
                    isUpdating={ isBrandingPreferenceUpdateRequestLoading }
                    onSubmit={ (values: Partial<BrandingPreferenceInterface>, shouldShowNotifications: boolean) => {
                        handlePreferenceFormSubmit(values, shouldShowNotifications);
                    } }
                    isSplitView={ isGreaterThanComputerViewport }
                    readOnly={ isReadOnly }
                    onLayoutChange={ (values: DesignFormValuesInterface): void => {
                        setSelectedLayout(values.layout.activeLayout);
                    } }
                    onPreviewResize={ (width: number): void => {
                        setCurrentWidth(width);
                    } }
                />
                <ConfirmationModal
                    onClose={ (): void => setShowBrandingPublishStatusConfirmationModal(false) }
                    type="warning"
                    open={ showBrandingPublishStatusConfirmationModal }
                    assertionHint={
                        t("extensions:develop.branding.confirmations.revertBranding.assertionHint")
                    }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowBrandingPublishStatusConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleBrandingPublishStatus() }
                    data-componentid={ `${ componentId }-branding-feature-confirmation-modal` }
                    closeOnDimmerClick={ false }
                    primaryActionLoading={ isBrandingFeatureRequestLoading }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-branding-feature-confirmation-modal-header` }
                    >
                        { t("extensions:develop.branding.confirmations.unpublishBranding.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid={ `${ componentId }-branding-feature-confirmation-modal-message` }
                    >
                        { brandingPreference.configs?.isBrandingEnabled ?
                            t("extensions:develop.branding.confirmations.unpublishBranding.disableMessage",
                                { productName: productName }) :
                            t("extensions:develop.branding.confirmations.unpublishBranding.enableMessage")
                        }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-branding-feature-confirmation-modal-content` }
                    >
                        { brandingPreference.configs?.isBrandingEnabled ?
                            t("extensions:develop.branding.confirmations.unpublishBranding.disableContent") :
                            t("extensions:develop.branding.confirmations.unpublishBranding.enableContent")
                        }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
                <Show when={ AccessControlConstants.BRANDING_DELETE }>
                    <DangerZoneGroup sectionHeader={ t("extensions:develop.branding.dangerZoneGroup.header") }>
                        { brandingPreference.configs?.isBrandingEnabled && (
                            <DangerZone
                                actionTitle={
                                    t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.actionTitle")
                                }
                                header={
                                    t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.header")
                                }
                                subheader={
                                    t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.subheader",
                                        { productName: productName })
                                }
                                onActionClick={ (): void => handleBrandingUnpublish() }
                                data-componentid={ `${ componentId }-danger-zone-unpublish` }
                            />
                        ) }
                        <DangerZone
                            actionTitle={
                                t("extensions:develop.branding.dangerZoneGroup.revertBranding.actionTitle")
                            }
                            header={
                                t("extensions:develop.branding.dangerZoneGroup.revertBranding.header")
                            }
                            subheader={
                                t("extensions:develop.branding.dangerZoneGroup.revertBranding.subheader",
                                    { productName: productName })
                            }
                            onActionClick={ (): void => setShowRevertConfirmationModal(true) }
                            data-componentid={ `${ componentId }-danger-zone` }
                        />
                    </DangerZoneGroup>
                </Show>
                <ConfirmationModal
                    onClose={ (): void => setShowRevertConfirmationModal(false) }
                    type="negative"
                    open={ showRevertConfirmationModal }
                    assertionHint={
                        t("extensions:develop.branding.confirmations.revertBranding.assertionHint")
                    }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowRevertConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleBrandingPreferenceDelete() }
                    data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal` }
                    closeOnDimmerClick={ false }
                    primaryActionLoading={ isBrandingPreferenceDeleteRequestLoading }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-header` }
                    >
                        { t("extensions:develop.branding.confirmations.revertBranding.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-message` }
                    >
                        {
                            t("extensions:develop.branding.confirmations.revertBranding.message",
                                { productName: productName })
                        }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-content` }
                    >
                        { t("extensions:develop.branding.confirmations.revertBranding.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

/**
 * Default props for the component.
 */
BrandingPage.defaultProps = {
    "data-componentid": "branding-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default BrandingPage;
