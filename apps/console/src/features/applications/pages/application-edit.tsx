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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, StorageIdentityAppsSettingsInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    PageLayout
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Label, Popup } from "semantic-ui-react";
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
import { getApplicationDetails } from "../api";
import { EditApplication } from "../components";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationAccessTypes,
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    State,
    SupportedAuthProtocolTypes,
    emptyApplication
} from "../models";
import { ApplicationTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the applications edit page component.
 */
interface ApplicationEditPageInterface extends TestableComponentInterface, RouteComponentProps { }

/**
 * Application Edit page component.
 *
 * @param {ApplicationEditPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ApplicationEditPage: FunctionComponent<ApplicationEditPageInterface> = (
    props: ApplicationEditPageInterface
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);
    const applicationHelpShownStatusKey = "isApplicationHelpShown";

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const appDescElement = useRef<HTMLDivElement>(null);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ applicationTemplate, setApplicationTemplate ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>(undefined);
    const [ inboundProtocolConfigs, setInboundProtocolConfigs ] = useState<Record<string, any>>(undefined);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);

    useEffect(() => {
        if (appDescElement) {
            const nativeElement = appDescElement.current;

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
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        if (showHelpPanel()) {
            dispatch(toggleHelpPanelVisibility(true));
            setHelpPanelShown();
        }
        getApplication(id);
    }, []);

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
             * {@link useSelector} always returns {@code undefined} when
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

        let template = applicationTemplates.find((template) => template.id === application.templateId);

        if (application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            || application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
            || application.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS) {
            template = applicationTemplates.find((template) => template.id === CustomApplicationTemplate.id );
        }

        setApplicationTemplate(template);
    }, [ applicationTemplates, application ]);

    /**
     * Push to 404 if application edit feature is disabled.
     */
    useEffect(() => {
        if (!featureConfig || !featureConfig.applications) {
            return;
        }

        if(!isFeatureEnabled(featureConfig.applications,
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

        const editApplicationDocs = get(helpPanelDocStructure,
            ApplicationManagementConstants.EDIT_APPLICATIONS_DOCS_KEY);

        if (!editApplicationDocs) {
            return;
        }

        dispatch(
            setHelpPanelDocsContentURL(editApplicationDocs[
                ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
                    .get(applicationTemplate.id) ]?.[ApplicationManagementConstants.APPLICATION_DOCS_OVERVIEW])
        );
    }, [ applicationTemplate, helpPanelDocStructure ]);

    /**
     * Retrieves application details from the API.
     *
     * @param {string} id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response: ApplicationInterface) => {
                setApplication(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
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
            })
            .finally(() => {
                setApplicationRequestLoading(false);
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
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
     * @param {string} id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        getApplication(id);
    };

    /**
     * Resolves the application status label.
     * @return {ReactElement}
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
     * @return {boolean} If an application is Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {

        return urlSearchParams.get(ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY) === "true"
            || application.access === ApplicationAccessTypes.READ
            || !hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update,
                allowedScopes);
    };

    return (
        <PageLayout
            title={ (
                <>
                    <span>{ application.name }</span>
                    { /*TODO - Application status is not shown until the backend support for disabling is given
                        @link https://github.com/wso2/product-is/issues/11453
                        { resolveApplicationStatusLabel() }*/ }
                </>
            ) }
            contentTopMargin={ true }
            description={ (
                <div className="with-label ellipsis" ref={ appDescElement }>
                    { applicationTemplate?.name && (
                        <Label size="small">{ applicationTemplate.name }</Label>
                    ) }
                    <Popup
                        disabled={ !isDescTruncated }
                        content={ application?.description }
                        trigger={ (
                            <span>{ application?.description }</span>
                        ) }
                    />
                </div>
            ) }
            image={
                application.imageUrl
                    ? (
                        <AppAvatar
                            name={ application.name }
                            image={ application.imageUrl }
                            size="tiny"
                        />
                    )
                    : (
                        <AnimatedAvatar
                            name={ application.name }
                            size="tiny"
                            floated="left"
                        />
                    )
            }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.applicationsEdit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            pageHeaderMaxWidth={ true }
            data-testid={ `${ testId }-page-layout` }
            truncateContent={ true }
        >
            <EditApplication
                application={ application }
                featureConfig={ featureConfig }
                isLoading={ isApplicationRequestLoading }
                setIsLoading={ setApplicationRequestLoading }
                onDelete={ handleApplicationDelete }
                onUpdate={ handleApplicationUpdate }
                template={ applicationTemplate }
                data-testid={ testId }
                urlSearchParams={ urlSearchParams }
                getConfiguredInboundProtocolsList={ (list: string[]) => {
                    setInboundProtocolList(list);
                } }
                getConfiguredInboundProtocolConfigs={ (configs: Record<string, unknown>) => {
                    setInboundProtocolConfigs(configs);
                } }
                readOnly={ resolveReadOnlyState() }
            />
        </PageLayout>
    );
};

/**
 * Default proptypes for the application edit page component.
 */
ApplicationEditPage.defaultProps = {
    "data-testid": "application-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationEditPage;
