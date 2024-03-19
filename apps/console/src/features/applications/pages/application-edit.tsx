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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    Popup,
    TabPageLayout
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Label } from "semantic-ui-react";
import { applicationConfig } from "../../../extensions/configs/application";
import {
    AppConstants,
    AppState,
    AppUtils,
    FeatureConfigInterface,
    PortalDocumentationStructureInterface,
    history,
    setHelpPanelDocsContentURL,
    toggleHelpPanelVisibility
} from "../../core";
import { IdentityProviderConstants } from "../../identity-providers/constants";
import { useGetApplication } from "../api/use-get-application";
import { EditApplication } from "../components/edit-application";
import { InboundProtocolDefaultFallbackTemplates } from "../components/meta/inbound-protocols.meta";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationAccessTypes,
    ApplicationTemplateListItemInterface,
    State,
    SupportedAuthProtocolTypes,
    idpInfoTypeInterface
} from "../models";
import { ApplicationManagementUtils } from "../utils/application-management-utils";
import { ApplicationTemplateManagementUtils } from "../utils/application-template-management-utils";

/**
 * Proptypes for the applications edit page component.
 */
interface ApplicationEditPageInterface extends IdentifiableComponentInterface, RouteComponentProps {
}

/**
 * Application Edit page component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application edit page.
 */
const ApplicationEditPage: FunctionComponent<ApplicationEditPageInterface> = (
    props: ApplicationEditPageInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);
    const applicationHelpShownStatusKey: string = "isApplicationHelpShown";

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const appDescElement: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);

    const [ applicationId, setApplicationId ] = useState<string>(undefined);
    const [ applicationTemplate, setApplicationTemplate ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(undefined);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>(undefined);
    const [ inboundProtocolConfigs, setInboundProtocolConfigs ] = useState<Record<string, any>>(undefined);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);

    const [ isConnectedAppsRedirect, setisConnectedAppsRedirect ] = useState(false);
    const [ callBackIdpID, setcallBackIdpID ] = useState<string>();
    const [ callBackIdpName, setcallBackIdpName ] = useState<string>();
    const [ callBackRedirect, setcallBackRedirect ] = useState<string>();

    const {
        data: application,
        mutate: mutateApplicationGetRequest,
        isLoading: isApplicationGetRequestLoading,
        error: applicationGetRequestError
    } = useGetApplication(applicationId, !!applicationId);

    /**
     * Sets the internal state of the application loading status when the SWR `isLoading` state changes.
     * TODO: Remove this once `setIsLoading` is removed from the nested components.
     */
    useEffect(() => {
        setApplicationRequestLoading(isApplicationGetRequestLoading);
    }, [ isApplicationGetRequestLoading ]);

    /**
     * Handles the application get request error.
     */
    useEffect(() => {
        if (!applicationGetRequestError) {
            return;
        }

        if (applicationGetRequestError.response?.data?.description) {
            dispatch(addAlert({
                description: applicationGetRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.notifications.fetchApplication.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.notifications.fetchApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.notifications.fetchApplication.genericError." +
                "message")
        }));
    }, [ applicationGetRequestError ]);

    useEffect(() => {
        /**
         * What's the goal of this effect?
         * To figure out the application's description is truncated or not.
         *
         * Even though {@link useRef} calls twice, the PageLayout component doesn't render
         * the passed children immediately (it will use a placeholder when it's loading),
         * when that happens the relative element always returns 0 as the offset height
         * and width. So, I'm relying on this boolean variable {@link isApplicationRequestLoading}
         * to re-render it for the third time, so it returns correct values for figuring out
         * whether the element's content is truncated or not.
         *
         * Please refer implementation details of {@link PageHeader}, if you check its
         * heading content, you can see that it conditionally renders first. So, for us
         * to correctly figure out the offset width and scroll width of the target
         * element we need it to be persistently mounted inside the {@link Header}
         * element.
         *
         * What exactly happens inside this effect?
         *
         * 1st Call -
         *  React calls this with a `null` value for {@link appDescElement}
         *  (This is expected in useRef())
         *
         * 2nd Call -
         *  React updates the {@link appDescElement} with the target element.
         *  But {@link PageHeader} will immediately unmount it (because there's a request is ongoing).
         *  When that happens, for "some reason" we always get \{ offsetWidth, scrollWidth
         *  and all the related attributes \} as zero or null.
         *
         * 3rd Call -
         *  So, whenever there's some changes to {@link isApplicationRequestLoading}
         *  we want React to re-update to reference so that we can accurately read the
         *  element's measurements (once after a successful load the {@link PageHeader}
         *  will try to render the component we actually pass down the tree)
         *
         *  For more additional context please refer comment:
         *  @see https://github.com/wso2/identity-apps/pull/3028#issuecomment-1123847668
         */
        if (appDescElement || isApplicationRequestLoading) {
            const nativeElement: HTMLDivElement = appDescElement?.current;

            if (nativeElement && (nativeElement.offsetWidth < nativeElement.scrollWidth)) {
                setIsDescTruncated(true);
            }
        }
    }, [ appDescElement, isApplicationRequestLoading ]);

    /**
     * Get whether to show the help panel
     * Help panel only shows for the first time
     */
    const showHelpPanel = (): boolean => {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        return !isEmpty(userPreferences) &&
            !userPreferences.identityAppsSettings?.devPortal?.[ applicationHelpShownStatusKey ];
    };

    /**
     * Set status of first time help panel is shown
     */
    const setHelpPanelShown = (): void => {
        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences) || !userPreferences?.identityAppsSettings?.devPortal) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);

        newPref.identityAppsSettings.devPortal[ applicationHelpShownStatusKey ] = true;
        AppUtils.setUserPreferences(newPref);
    };

    /**
     * Fetch the application details on initial component load.
     */
    useEffect(() => {
        const path: string[] = history.location.pathname?.split("/");
        const id: string = path[ path?.length - 1 ];

        if (showHelpPanel()) {
            dispatch(toggleHelpPanelVisibility(true));
            setHelpPanelShown();
        }

        setApplicationId(id);
    }, []);

    /**
    * Fetch the identity provider id & name when calling the app edit through connected apps
    */
    useEffect(() => {
        if (typeof history.location.state !== "object") {
            return;
        }

        setisConnectedAppsRedirect(true);
        const idpInfo: idpInfoTypeInterface = history.location.state as idpInfoTypeInterface;

        setcallBackIdpID(idpInfo.id);
        setcallBackIdpName(idpInfo.name);
        idpInfo?.redirectTo && setcallBackRedirect(idpInfo.redirectTo);
    });

    /**
     * Load the template that the application is built on.
     */
    useEffect(() => {

        if (!application
            || !(applicationTemplates
                && applicationTemplates instanceof Array
                && applicationTemplates.length > 0)) {

            /**
             * What's this?
             *
             * When navigating to an application using the direct url i.e.,
             * /t/foo/develop/applications/:id#tab=1 this component will be
             * mounted. But you see this {@link applicationTemplates}?; it is
             * loaded elsewhere. For some reason, requesting the state from
             * {@link useSelector} always returns `undefined` when
             * directly navigating or refreshing the page. Therefore; it hangs
             * without doing anything. It will show a overlay loader but
             * that's it. Nothing happens afterwards.
             *
             * So, as a workaround; if for some reason, the {@link useSelector}
             * return no data, we will manually emit the event
             * {@link ApplicationActionTypes.SET_APPLICATION_TEMPLATES}. So, doing
             * that ensures we load the application templates again.
             *
             * Consider this as a **failsafe workaround**. We shouldn't rely
             * on this. This may get removed in the future.
             */
            ApplicationTemplateManagementUtils
                .getApplicationTemplates()
                .finally();

            return;
        }

        determineApplicationTemplate();

    }, [ applicationTemplates, application ]);

    useEffect(() => {

        /**
         * If there's no application {@link ApplicationInterface.templateId}
         * in the application instance, then we manually bind a templateId. You
         * may ask why templateId is null at this point? Well, one reason
         * is that, if you create an application via the API, the templateId
         * is an optional property in the model instance.
         *
         *      So, if someone creates one without it, we don't have a template
         * to bootstrap the model. When that happens the edit view will not
         * work properly.
         *
         * We have added a mapping for application's inbound protocol
         * {@link InboundProtocolDefaultFallbackTemplates} to pick a default
         * template if none is present. One caveat is that, if we couldn't
         * find any template from the fallback mapping, we always assign
         * {@link ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC} to it.
         * Additionally @see InboundFormFactory.
         */
        if (!application?.advancedConfigurations?.fragment && !application?.templateId) {
            if (application?.inboundProtocols?.length > 0) {
                // FIXME: `application` object is directly mutated here causing unpredictable side effects.
                // Tracker: https://github.com/wso2/product-is/issues/20016
                application.templateId = InboundProtocolDefaultFallbackTemplates.get(
                    application.inboundProtocols[ 0 /*We pick the first*/ ].type
                ) ?? ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC;
                determineApplicationTemplate();
            }
        }

    }, [ isApplicationRequestLoading, application ]);

    /**
     * Push to 404 if application edit feature is disabled.
     */
    useEffect(() => {
        if (!featureConfig || !featureConfig.applications) {
            return;
        }

        if (!isFeatureEnabled(featureConfig.applications,
            ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT"))) {

            history.push(AppConstants.getPaths().get("PAGE_NOT_FOUND"));
        }
    }, [ featureConfig ]);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (!applicationTemplate) {
            return;
        }

        const editApplicationDocs: PortalDocumentationStructureInterface[] = get(helpPanelDocStructure,
            ApplicationManagementConstants.EDIT_APPLICATIONS_DOCS_KEY);

        if (!editApplicationDocs) {
            return;
        }

        dispatch(
            setHelpPanelDocsContentURL(editApplicationDocs[
                ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
                    .get(applicationTemplate.id)]?.[ApplicationManagementConstants.APPLICATION_DOCS_OVERVIEW])
        );
    }, [ applicationTemplate, helpPanelDocStructure ]);

    const determineApplicationTemplate = () => {

        let template: ApplicationTemplateListItemInterface = applicationTemplates?.find(
            (template: ApplicationTemplateListItemInterface) => {
                return template.id === application.templateId;
            });

        if (application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            || application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
            || application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS) {
            template = applicationTemplates?.find((template: ApplicationTemplateListItemInterface) =>
                template.id === CustomApplicationTemplate.id);
        }

        setApplicationTemplate(template);
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        if (!isConnectedAppsRedirect) {
            history.push(AppConstants.getPaths().get("APPLICATIONS"));
        } else {
            if (callBackRedirect === ApplicationManagementConstants.ROLE_CALLBACK_REDIRECT) {
                history.push({
                    pathname: AppConstants.getPaths().get("ROLE_EDIT").replace(":id", callBackIdpID),
                    state: IdentityProviderConstants.CONNECTED_APPS_TAB_ID
                });
            } else {
                history.push({
                    pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", callBackIdpID),
                    state: IdentityProviderConstants.CONNECTED_APPS_TAB_ID
                });
            }
        }
    };

    /**
     * Called when an application is deleted.
     */
    const handleApplicationDelete = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * Called when an application updates.
     *
     * @param id - Application id.
     */
    const handleApplicationUpdate = (): void => {
        mutateApplicationGetRequest();
    };

    /**
     * Resolves the application status label.
     *
     * @returns Application status label.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resolveApplicationStatusLabel = (): ReactElement => {

        if (!inboundProtocolList || !inboundProtocolConfigs) {
            return null;
        }

        if (inboundProtocolList.length === 0) {

            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.applications.popups.appStatus.notConfigured.header") }
                    popupSubHeader={ t("console:develop.features.applications.popups.appStatus.notConfigured.content") }
                    labelColor="yellow"
                />
            );
        }

        if (inboundProtocolList.length === 1
                && inboundProtocolList.includes(SupportedAuthProtocolTypes.OIDC)
                && inboundProtocolConfigs
                && inboundProtocolConfigs[ SupportedAuthProtocolTypes.OIDC ]) {

            if (inboundProtocolConfigs[ SupportedAuthProtocolTypes.OIDC ].state === State.REVOKED) {

                return (
                    <LabelWithPopup
                        popupHeader={ t("console:develop.features.applications.popups.appStatus.revoked.header") }
                        popupSubHeader={ t("console:develop.features.applications.popups.appStatus.revoked.content") }
                        labelColor="grey"
                    />
                );
            }
        }

        return (
            <LabelWithPopup
                popupHeader={ t("console:develop.features.applications.popups.appStatus.active.header") }
                popupSubHeader={ t("console:develop.features.applications.popups.appStatus.active.content") }
                labelColor="green"
            />
        );
    };

    /**
     * Returns if the application is readonly or not by evaluating the `readOnly` attribute in
     * URL, the `access` attribute in application info response && the scope validation.
     *
     * @returns If an application is Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {

        return urlSearchParams.get(ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY) === "true"
            || application?.access === ApplicationAccessTypes.READ
            || !hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update,
                allowedScopes);
    };

    /**
     * Resolves the application template label.
     *
     * @returns Template label.
     */
    const resolveTemplateLabel = (): ReactElement => {
        if (application?.advancedConfigurations?.fragment) {
            return (
                <Label size="small">
                    { t("console:develop.features.applications.list.labels.fragment") }
                </Label>
            );
        }

        if (applicationTemplate?.name) {
            return <Label size="small">{ applicationTemplate.name }</Label>;
        }

        return null;
    };

    return (
        <TabPageLayout
            pageTitle="Edit Application"
            title={ (
                <>
                    <span>{ application?.name }</span>
                    { /*TODO - Application status is not shown until the backend support for disabling is given
                        @link https://github.com/wso2/product-is/issues/11453
                        { resolveApplicationStatusLabel() }*/ }
                </>
            ) }
            contentTopMargin={ true }
            description={ (
                applicationConfig.editApplication.getOverriddenDescription(inboundProtocolConfigs?.oidc?.clientId,
                    tenantDomain, applicationTemplate?.name)
                    ?? (
                        <div className="with-label ellipsis" ref={ appDescElement }>
                            { resolveTemplateLabel() }
                            {
                                ApplicationManagementUtils.isChoreoApplication(application)
                                    && (<Label
                                        size="small"
                                        className="choreo-label no-margin-left"
                                    >
                                        { t("extensions:develop.apiResource.managedByChoreoText") }
                                    </Label>)
                            }
                            <Popup
                                disabled={ !isDescTruncated }
                                content={ application?.description }
                                trigger={ (
                                    <span>{ application?.description }</span>
                                ) }
                            />
                        </div>
                    )
            ) }
            image={
                applicationConfig.editApplication.getOverriddenImage(inboundProtocolConfigs?.oidc?.clientId,
                    tenantDomain)
                ?? (
                    application?.imageUrl
                        ? (
                            <AppAvatar
                                name={ application?.name }
                                image={ application?.imageUrl }
                                size="tiny"
                            />
                        )
                        : (
                            <AnimatedAvatar
                                name={ application?.name }
                                size="tiny"
                                floated="left"
                            />
                        )
                )
            }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            isLoading={ isApplicationRequestLoading }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: isConnectedAppsRedirect ? t("console:develop.features.idp.connectedApps.applicationEdit.back",
                    { idpName: callBackIdpName }) : t("console:develop.pages.applicationsEdit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-page-layout` }
            truncateContent={ true }
            action={ (
                <>
                    {
                        applicationConfig.editApplication.getActions(
                            inboundProtocolConfigs?.oidc?.clientId,
                            tenantDomain,
                            componentId
                        )
                    }
                </>
            ) }
        >
            <EditApplication
                application={ application }
                featureConfig={ featureConfig }
                isLoading={ isApplicationRequestLoading }
                setIsLoading={ setApplicationRequestLoading }
                onDelete={ handleApplicationDelete }
                onUpdate={ handleApplicationUpdate }
                template={ applicationTemplate }
                data-componentid={ componentId }
                urlSearchParams={ urlSearchParams }
                getConfiguredInboundProtocolsList={ (list: string[]) => {
                    setInboundProtocolList(list);
                } }
                getConfiguredInboundProtocolConfigs={ (configs: Record<string, unknown>) => {
                    setInboundProtocolConfigs(configs);
                } }
                readOnly={ resolveReadOnlyState() }
            />
        </TabPageLayout>
    );
};

/**
 * Default proptypes for the application edit page component.
 */
ApplicationEditPage.defaultProps = {
    "data-componentid": "application-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationEditPage;
