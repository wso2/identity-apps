/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AccessControlConstants, AccessControlUtils, Show } from "@wso2is/access-control";
import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface, RouteInterface } from "@wso2is/core/models";
import { RouteUtils } from "@wso2is/core/utils";
import { GenericIcon, Heading, LinkButton, PageLayout, Text } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, Grid, Label, Placeholder } from "semantic-ui-react";
import { DynamicApplicationContextCard } from "./components/dynamic-application-context-card";
import { getGettingStartedCardIllustrations } from "./configs";
import {
    ApplicationListInterface,
    ApplicationListItemInterface,
    ApplicationManagementConstants,
    ApplicationTemplateListItemInterface,
    MinimalAppCreateWizard,
    getApplicationList
} from "../../../features/applications";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    FeatureConfigInterface,
    history,
    setActiveView,
    setDeveloperVisibility,
    setManageVisibility
} from "../../../features/core";
import { getAdminViewRoutes, getDeveloperViewRoutes } from "../../../features/core/configs";
import { UserListInterface, getUsersList } from "../../../features/users";
import { ReactComponent as SupportHeadsetIcon } from "../../assets/images/icons/support-headset-icon.svg";
import { AppViewExtensionTypes, commonConfig } from "../../configs";
import { CONSUMER_USERSTORE } from "../users/constants";

/**
 * Proptypes for the overview page component.
 */
type GettingStartedPageInterface = IdentifiableComponentInterface;

/**
 * Overview page.
 *
 * @param {GettingStartedPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const GettingStartedPage: FunctionComponent<GettingStartedPageInterface> = (
    props: GettingStartedPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const activeView: string = useSelector((state: AppState) => state.global.activeView);
    const docSiteURL: string = useSelector((state: AppState) => state.config.deployment.docSiteURL);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ isConsumersAvailable, setIsConsumersAvailable ] = useState<boolean>(undefined);
    const [ isApplicationsAvailable, setIsApplicationsAvailable ] = useState<boolean>(undefined);
    const [
        isConsumerUsersFetchRequestLoading,
        setIsConsumerUsersFetchRequestLoading
    ] = useState<boolean>(undefined);
    const [
        isApplicationsFetchRequestLoading,
        setIsApplicationsFetchRequestLoading
    ] = useState<boolean>(undefined);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);
    const [ applications, setApplications ] = useState<ApplicationListItemInterface[]>([]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Make sure `QUICKSTART` tab is highlighed when this page is in use.
     */
    useEffect(() => {

        if (activeView === AppViewExtensionTypes.QUICKSTART) {
            return;
        }

        dispatch(setActiveView(AppViewExtensionTypes.QUICKSTART));
    }, []);

    useEffect(() => {
        const manageRoutes: RouteInterface[] = RouteUtils.sanitizeForUI(cloneDeep(getAdminViewRoutes()));
        const developRoutes: RouteInterface[] = RouteUtils.sanitizeForUI(cloneDeep(getDeveloperViewRoutes()));

        const tab: string = AccessControlUtils.getDisabledTab(
            manageRoutes, developRoutes, allowedScopes, featureConfig, commonConfig.checkForUIResourceScopes);

        if (tab === "MANAGE") {
            dispatch(setManageVisibility(false));
        } else if (tab === "DEVELOP") {
            dispatch(setDeveloperVisibility(false));
        } else if (tab === "BOTH") {
            dispatch(setManageVisibility(false));
            dispatch(setDeveloperVisibility(false));

            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
            });

        } else {
            dispatch(setManageVisibility(true));
            dispatch(setDeveloperVisibility(true));
        }
    }, []);

    useEffect(() => {

        setIsConsumerUsersFetchRequestLoading(true);

        getUsersList(null, null, null, "id", CONSUMER_USERSTORE)
            .then((response: UserListInterface) => {
                setIsConsumersAvailable(response.totalResults > 0);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                setIsConsumerUsersFetchRequestLoading(false);
            });
    }, []);

    useEffect(() => {

        setIsApplicationsFetchRequestLoading(true);

        getApplicationList(null, null, null)
            .then((response: ApplicationListInterface) => {
                setIsApplicationsAvailable(response.totalResults > 0);
                setApplications(response.applications);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                setIsApplicationsFetchRequestLoading(false);
            });
    }, []);

    /**
     * Monitor `profileInfo.id` and publish the event to avoid an event without `UUID`.
     */
    useEffect(() => {

        if (!profileInfo?.id) {
            return;
        }

        // TODO: Move this to the `extensions/configs/common`.
        // Tracked here https://github.com/wso2-enterprise/asgardeo-product/issues/7742#issuecomment-939960128.
        eventPublisher.publish("console-click-getting-started-menu-item");
    }, [ profileInfo?.id ]);

    return (
        <PageLayout
            padded={ false }
            contentTopMargin={ false }
            data-testid={ `${componentId}-layout` }
            data-componentid={ `${componentId}-layout` }
            className="getting-started-page"
        >
            <div className="greeting">
                <Heading
                    ellipsis
                    compact
                    as="h1"
                    bold="500"
                    data-testid="welcome-greeting-header"
                    data-componentid="welcome-greeting-header"
                    data-suppress=""
                >
                    {
                        isProfileInfoLoading
                            ? (
                                <Placeholder
                                    data-testid="welcome-greeting-placeholder"
                                    data-componentid="welcome-greeting-placeholder"
                                >
                                    <Placeholder.Header>
                                        <Placeholder.Line length="very long"/>
                                    </Placeholder.Header>
                                </Placeholder>
                            )
                            : t("extensions:common.quickStart.greeting.heading", {
                                username: resolveUserDisplayName(profileInfo)
                            })
                    }
                </Heading>
                <Heading
                    subHeading
                    ellipsis
                    as="h5"
                    data-testid="welcome-greeting-sub-header"
                    data-componentid="welcome-greeting-sub-header"
                >
                    {
                        t("extensions:common.quickStart.greeting.subHeading",
                            { productName: config.ui.productName })
                    }
                </Heading>
            </div>
            <Grid stackable stretched>
                <Show when={ AccessControlConstants.APPLICATION_READ }>
                    <Grid.Column
                        mobile={ 16 }
                        tablet={ 16 }
                        computer={ 6 }
                        largeScreen={ 6 }
                        widescreen={ 6 }>
                        <DynamicApplicationContextCard
                            applications={ applications }
                            isApplicationsAvailable={ isApplicationsAvailable }
                            isApplicationsFetchRequestLoading={ isApplicationsFetchRequestLoading }
                            onTemplateSelected={ (template) => {
                                setSelectedTemplate(template);
                                setShowWizard(true);
                            } }
                        />
                    </Grid.Column>
                </Show>
                <Show when={ AccessControlConstants.USER_READ }>
                    <Grid.Column
                        mobile={ 16 }
                        tablet={ 16 }
                        computer={ 6 }
                        largeScreen={ 6 }
                        widescreen={ 6 }>
                        <Card
                            fluid
                            className="basic-card no-hover getting-started-card manage-users-card"
                        >
                            <Card.Content className="illustration-container">
                                <GenericIcon
                                    transparent
                                    className="onboard-users-animated-illustration"
                                    icon={ getGettingStartedCardIllustrations().onboardUsers }
                                />
                            </Card.Content>
                            <Card.Content extra className="description-container">
                                <div className="card-heading">
                                    <Heading as="h2">
                                        { t("extensions:common.quickStart.sections.manageUsers.heading") }
                                    </Heading>
                                </div>
                                <Text muted>
                                    { t("extensions:common.quickStart.sections.manageUsers.description") }
                                </Text>
                                <Label.Group>
                                    <Label>
                                        {
                                            t("extensions:common.quickStart.sections.manageUsers" +
                                                ".capabilities.customers")
                                        }
                                    </Label>
                                    <Label>
                                        {
                                            t("extensions:common.quickStart.sections.manageUsers" +
                                                ".capabilities.collaborators")
                                        }
                                    </Label>
                                    <Label>
                                        {
                                            t("extensions:common.quickStart.sections.manageUsers" +
                                                ".capabilities.groups")
                                        }
                                    </Label>
                                </Label.Group>
                            </Card.Content>
                            <Card.Content className="action-container" extra>
                                <LinkButton
                                    compact
                                    loading={ isConsumerUsersFetchRequestLoading }
                                    data-testid="getting-started-page-add-user-button"
                                    data-componentid="getting-started-page-add-user-button"
                                    className="quick-start-action"
                                    onClick={ () => {
                                        eventPublisher.publish("console-getting-started-add-users-path");
                                        history.push(AppConstants.getPaths().get("USERS"));
                                    } }
                                >
                                    <span
                                        className="button-text"
                                        data-componentid="getting-started-page-add-user-button-text"
                                    >
                                        <Show
                                            when={ AccessControlConstants.USER_WRITE }
                                            fallback={
                                                t("extensions:common.quickStart.sections.manageUsers.actions.view")
                                            }
                                        >
                                            {
                                                isConsumersAvailable
                                                    ? t("extensions:common.quickStart.sections.manageUsers.actions" +
                                                        ".manage")
                                                    : t("extensions:common.quickStart.sections.manageUsers.actions" +
                                                        ".create")
                                            }
                                        </Show>
                                    </span>
                                </LinkButton>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Show>
                <Grid.Column
                    mobile={ 16 }
                    tablet={ 16 }
                    computer={ 4 }
                    largeScreen={ 4 }
                    widescreen={ 4 }>
                    <Show when={ AccessControlConstants.IDP_READ }>
                        <Card
                            fluid
                            className="basic-card no-hover getting-started-card social-connections-card"
                        >
                            <Card.Content className="illustration-container">
                                <GenericIcon
                                    transparent
                                    className="social-connections-animated-illustration"
                                    icon={ getGettingStartedCardIllustrations().setupSocialConnections }
                                />
                            </Card.Content>
                            <Card.Content className="description-container">
                                <div className="card-heading">
                                    <Heading as="h2">
                                        { t("extensions:common.quickStart.sections.addSocialLogin.heading") }
                                    </Heading>
                                </div>
                                <Text muted>
                                    { t("extensions:common.quickStart.sections.addSocialLogin.description") }
                                </Text>
                            </Card.Content>
                            <Card.Content extra className="action-container">
                                <LinkButton
                                    compact
                                    data-testid="develop-getting-started-page-add-social-login"
                                    data-componentid="develop-getting-started-page-add-social-login"
                                    className="quick-start-action py-0"
                                    onClick={ () => {
                                        eventPublisher.publish("console-getting-started-add-social-connection-path");
                                        history.push({
                                            pathname: AppConstants.getPaths().get("CONNECTIONS")
                                        });
                                    } }
                                >
                                    <span
                                        className="button-text"
                                        data-componentid="develop-getting-started-page-add-social-login-text"
                                    >
                                        <Show
                                            when={ AccessControlConstants.IDP_WRITE }
                                            fallback={
                                                t("extensions:common.quickStart.sections.addSocialLogin.actions.view")
                                            }
                                        >
                                            { t("extensions:common.quickStart.sections.addSocialLogin.actions.setup") }
                                        </Show>
                                    </span>
                                </LinkButton>
                            </Card.Content>
                        </Card>
                    </Show>
                    <Card
                        fluid
                        className="basic-card no-hover getting-started-card learn-card"
                    >
                        <Card.Content className="description-container">
                            <div className="card-heading">
                                <Heading as="h2">
                                    { t("extensions:common.quickStart.sections.learn.heading") }
                                </Heading>
                            </div>
                            <Text muted>
                                { t("extensions:common.quickStart.sections.addSocialLogin.description") }
                            </Text>
                        </Card.Content>
                        <Card.Content extra className="action-container">
                            <LinkButton
                                compact
                                data-testid="develop-getting-started-page-view-docs"
                                data-componentid="develop-getting-started-page-view-docs"
                                className="quick-start-action"
                                onClick={ () => {
                                    eventPublisher.publish("console-getting-started-navigate-to-docs-path");
                                    window.open(docSiteURL, "_blank", "noopener");
                                } }
                            >
                                <span
                                    className="button-text"
                                    data-componentid="develop-getting-started-page-view-doc-text"
                                >
                                    { t("extensions:common.quickStart.sections.learn.actions.view") }
                                </span>
                            </LinkButton>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
            <div className="community-link-container" data-componentid="community-link-section">
                <div className="contact-icon-container">
                    <GenericIcon
                        transparent
                        icon={ SupportHeadsetIcon }
                        size="mini"
                        fill="default"
                        spaced="right"
                    />
                </div>
                <div>
                    <Heading as="h5" compact>Help & Support</Heading>
                    <Text compact muted>For assistance, contact
                        { " " }
                        <a
                            href="mailto:asgardeo-help@wso2.com"
                            data-componentid="community-link-mail-trigger"
                        >
                            asgardeo-help@wso2.com
                        </a>
                    </Text>
                </div>
            </div>
            { showWizard && (
                <MinimalAppCreateWizard
                    title={ selectedTemplate?.name }
                    subTitle={ selectedTemplate?.description }
                    closeWizard={ (): void => {
                        setShowWizard(false);
                        setSelectedTemplate(undefined);
                    } }
                    template={ selectedTemplate }
                    showHelpPanel={ true }
                    subTemplates={ selectedTemplate?.subTemplates }
                    subTemplatesSectionTitle={ selectedTemplate?.subTemplatesSectionTitle }
                    addProtocol={ false }
                    templateLoadingStrategy={
                        config.ui.applicationTemplateLoadingStrategy
                        ?? ApplicationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY
                    }
                />
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
GettingStartedPage.defaultProps = {
    "data-componentid": "getting-started-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GettingStartedPage;
