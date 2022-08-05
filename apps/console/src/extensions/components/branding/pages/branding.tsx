/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
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
    Hint,
    PageLayout,
    useDocumentation,
    useWindowDimensions
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import React, { Fragment, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, CheckboxProps, Divider, Responsive } from "semantic-ui-react";
import { EventPublisher } from "../../../../features/core";
import { AppState } from "../../../../features/core/store";
import { ExtendedFeatureConfigInterface } from "../../../configs/models";
import { deleteBrandingPreference, getBrandingPreference, updateBrandingPreference } from "../api";
import { BrandingPreferenceTabs } from "../components";
import { BrandingPreferencesConstants } from "../constants";
import { BrandingPreferenceMeta, PredefinedThemes } from "../meta";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface
} from "../models";
import { BrandingPreferenceUtils } from "../utils";

/**
 * Proptypes for the branding page component.
 */
type BrandingPageInterface = IdentifiableComponentInterface;

/**
 * Should show the org logo in the page title?
 */
const SHOW_ORGANIZATION_LOGO_IN_PAGE_TITLE: boolean = false;

/**
 * Branding page.
 *
 * @param {BrandingPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const BrandingPage: FunctionComponent<BrandingPageInterface> = (
    props: BrandingPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { getLink } = useDocumentation();

    const { width } = useWindowDimensions();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const productName: string = useSelector((state: AppState) => state.config.ui.productName);
    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);

    const [ isBrandingConfigured, setIsBrandingConfigured ] = useState<boolean>(true);
    const [ isPreferencesFetchedFromAPI, setIsPreferencesFetchedFromAPI ] = useState<boolean>(false);
    const [
        predefinedThemes,
        setPredefinedThemes
    ] = useState<BrandingPreferenceThemeInterface>(BrandingPreferencesConstants.DEFAULT_PREFERENCE.theme);

    const DEFAULT_PREFERENCE = useMemo(() => BrandingPreferenceUtils.getDefaultBrandingPreference({
        theme: predefinedThemes
    }), [ predefinedThemes ]);

    const [
        brandingPreference,
        setBrandingPreference
    ] = useState<BrandingPreferenceInterface>(DEFAULT_PREFERENCE);
    const [
        isBrandingPreferenceFetchRequestLoading,
        setIsBrandingPreferenceFetchRequestLoading
    ] = useState<boolean>(undefined);
    const [
        isBrandingPreferenceUpdateRequestLoading,
        setIsBrandingPreferenceUpdateRequestLoading
    ] = useState<boolean>(undefined);
    const [
        isBrandingPreferenceDeleteRequestLoading,
        setIsBrandingPreferenceDeleteRequestLoading
    ] = useState<boolean>(undefined);
    const [ isTabletViewport, setIsTabletViewport ] = useState<boolean>(false);
    const [ showRevertConfirmationModal, setShowRevertConfirmationModal ] = useState<boolean>(false);
    const [ preferenceTabsComponentKey, setPreferenceTabsComponentKey ] = useState(1);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isReadOnly = useMemo(() => !hasRequiredScopes(
        featureConfig?.branding,
        featureConfig?.branding?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    /**
     * Publish page visit insights.
     */
    useEffect(() => {

        eventPublisher.publish("page-visit-organization-branding");
    }, []);

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
     * Checks if the window size is tablet.
     */
    useEffect(() => {

        if (width < Responsive.onlyTablet.maxWidth) {
            setIsTabletViewport(true);
        }
    }, [ width ]);

    /**
     * Get Branding Preference when the default tenant is resolved.
     */
    useEffect(() => {

        if (!tenantDomain || isPreferencesFetchedFromAPI || isBrandingPreferenceFetchRequestLoading) {
            return;
        }

        setIsBrandingPreferenceFetchRequestLoading(true);

        getBrandingPreference(tenantDomain)
            .then((response: BrandingPreferenceAPIResponseInterface) => {
                if (response instanceof IdentityAppsApiException) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.branding.notifications.fetch.invalidStatus.description",
                            { tenant: tenantDomain }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.branding.notifications.fetch.invalidStatus.message")
                    }));

                    return;
                }

                // Check if the returned Branding preference is of the intended tenant.
                if (response.name !== tenantDomain) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.branding.notifications.fetch.tenantMismatch.description",
                            { tenant: tenantDomain }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.branding.notifications.fetch.tenantMismatch.message")
                    }));

                    return;
                }

                setIsBrandingConfigured(true);
                setBrandingPreference(BrandingPreferenceUtils.migrateThemePreference(response.preference, {
                    theme: predefinedThemes
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                // Check if Branding is not configured for the tenant. If so, silent the errors.
                if (error.code === BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE) {
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
            })
            .finally(() => {
                setIsBrandingPreferenceFetchRequestLoading(false);
                setIsPreferencesFetchedFromAPI(true);
            });
    }, [ tenantDomain, predefinedThemes, isPreferencesFetchedFromAPI ]);

    /**
     * Handles preference form submit action.
     * @param {Partial<BrandingPreferenceInterface>} values - Form values.
     */
    const handlePreferenceFormSubmit = (values: Partial<BrandingPreferenceInterface>): void => {

        eventPublisher.compute(() => {
            // If a site title is updated, publish an event.
            if (isEmpty(brandingPreference.organizationDetails.siteTitle)
                && !isEmpty(values.organizationDetails?.siteTitle)) {
                eventPublisher.publish("organization-branding-configure-site-title");
            }

            // If a copyright is updated, publish an event.
            if (isEmpty(brandingPreference.organizationDetails.copyrightText)
                && !isEmpty(values.organizationDetails?.copyrightText)) {
                eventPublisher.publish("organization-branding-configure-copyright");
            }

            // If a support email is updated, publish an event.
            if (isEmpty(brandingPreference.organizationDetails.supportEmail)
                && !isEmpty(values.organizationDetails?.supportEmail)) {
                eventPublisher.publish("organization-branding-configure-support-email");
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

        _updateBrandingPreference(merge(cloneDeep(brandingPreference), values), isBrandingConfigured);
    };

    /**
     * Function to update the Branding Preferences using the API.
     *
     * @param {BrandingPreferenceInterface} preference - Preference object.
     * @param {boolean} _isBrandingConfigured - Local flag passed as a param to determine if branding is configured.
     * @param {boolean} setRequestLoadingState - Should set the request loading states?
     */
    const _updateBrandingPreference = (preference: BrandingPreferenceInterface,
        _isBrandingConfigured: boolean,
        setRequestLoadingState: boolean = true): void => {

        // Only set the request loading states if flag is set to true.
        // Needed to be false for the publish toggle, else the save button's loading state will be shown
        // when the publish toggle is triggered.
        if (setRequestLoadingState) {
            setIsBrandingPreferenceUpdateRequestLoading(true);
        }

        updateBrandingPreference(_isBrandingConfigured, tenantDomain, preference)
            .then((response: BrandingPreferenceAPIResponseInterface) => {
                if (response instanceof IdentityAppsApiException) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.branding.notifications.update.invalidStatus.description",
                            { tenant: tenantDomain }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.branding.notifications.update.invalidStatus.message")
                    }));

                    return;
                }

                // Check if the returned Branding preference is of the intended tenant.
                if (response.name !== tenantDomain) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.branding.notifications.update.tenantMismatch.description",
                            { tenant: tenantDomain }),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.branding.notifications.update.tenantMismatch.message")
                    }));

                    return;
                }

                setIsBrandingConfigured(true);
                setBrandingPreference(response.preference);

                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.branding.notifications.update.success.description",
                        { tenant: tenantDomain }),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.branding.notifications.update.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                // Edge Case...Try again with POST, if Branding preference has been removed due to concurrent sessions.
                if (error.code === BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE) {
                    setIsBrandingConfigured(false);
                    _updateBrandingPreference(preference, false);

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.branding.notifications.update.genericError.description",
                        { tenant: tenantDomain }),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.branding.notifications.update.genericError.message")
                }));

                setBrandingPreference(DEFAULT_PREFERENCE);
            })
            .finally(() => {
                if (setRequestLoadingState) {
                    setIsBrandingPreferenceUpdateRequestLoading(false);
                }
            });
    };

    /**
     * Handles the publish/un-publish toggle onchange callback.
     * @param {SyntheticEvent} e - Event.
     * @param {CheckboxProps} data - Event Data.
     */
    const handlePublishToggle = (e: SyntheticEvent, data: CheckboxProps): void => {

        _updateBrandingPreference(merge(cloneDeep(brandingPreference), {
            configs: {
                isBrandingEnabled: data.checked
            }
        }), isBrandingConfigured, false);
    };

    /**
     * Renders the publish toggle.
     * @return {ReactElement}
     */
    const renderPublishToggle = (): ReactElement => {

        return (
            <Fragment>
                <Checkbox
                    toggle
                    label={ t("extensions:develop.branding.publishToggle.label") }
                    data-componentid="branding-preference-publish-toggle"
                    checked={ brandingPreference.configs?.isBrandingEnabled }
                    onChange={ handlePublishToggle }
                />
                <Hint popup>{ t("extensions:develop.branding.publishToggle.hint") }</Hint>
            </Fragment>
        );
    };

    /**
     * Handles the delete operation of branding preference via the API.
     */
    const handleBrandingPreferenceDelete = (): void => {

        setIsBrandingPreferenceDeleteRequestLoading(true);

        deleteBrandingPreference(tenantDomain)
            .then((response: null | IdentityAppsApiException) => {
                if (response instanceof IdentityAppsApiException) {
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
                // Increment the tabs component key to remount the component on branding revert.
                setPreferenceTabsComponentKey(preferenceTabsComponentKey + 1);

                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.branding.notifications.delete.success.description",
                        { tenant: tenantDomain }),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.branding.notifications.delete.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {

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
        <PageLayout
            action={ !isTabletViewport && renderPublishToggle() }
            bottomMargin={ false }
            image={ SHOW_ORGANIZATION_LOGO_IN_PAGE_TITLE && (
                <GenericIcon
                    square
                    relaxed
                    transparent
                    bordered
                    rounded
                    icon={
                        !isEmpty(brandingPreference.theme[ brandingPreference.theme.activeTheme ]?.images?.logo?.imgURL)
                            ? brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                            : BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks()
                                .theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                    }
                    inverted={ brandingPreference.theme.activeTheme === PredefinedThemes.DARK }
                    size="tiny"
                    data-componentid={ `${ componentId }-organization-logo` }
                />
            ) }
            title={ tenantDomain }
            isLoading={
                !tenantDomain
                || (
                    isBrandingPreferenceFetchRequestLoading === undefined
                    || isBrandingPreferenceFetchRequestLoading === true
                )
            }
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
                isTabletViewport && (
                    <Fragment>
                        { renderPublishToggle() }
                        <Divider hidden />
                    </Fragment>
                )
            }
            <BrandingPreferenceTabs
                key={ preferenceTabsComponentKey }
                predefinedThemes={ predefinedThemes }
                brandingPreference={ brandingPreference }
                isLoading={
                    !tenantDomain
                    || (
                        isBrandingPreferenceFetchRequestLoading === undefined
                        || isBrandingPreferenceFetchRequestLoading === true
                    )
                }
                isUpdating={ isBrandingPreferenceUpdateRequestLoading }
                onSubmit={ (values: Partial<BrandingPreferenceInterface>) => {
                    handlePreferenceFormSubmit(values);
                } }
                isSplitView={ !isTabletViewport }
                readOnly={ isReadOnly }
            />
            <Show when={ AccessControlConstants.BRANDING_DELETE }>
                <DangerZoneGroup sectionHeader={ t("extensions:develop.branding.dangerZoneGroup.header") }>
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
