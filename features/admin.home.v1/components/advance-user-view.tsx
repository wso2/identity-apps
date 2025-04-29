/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { GearIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, Show } from "@wso2is/access-control";
import TryItCreateWizard from "@wso2is/admin.applications.v1/components/try-it/try-it-create-wizard";
import {
    MinimalAppCreateWizard
} from "@wso2is/admin.applications.v1/components/wizard/minimal-application-create-wizard";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import useTryItApplication from "@wso2is/admin.applications.v1/hooks/use-try-it-application";
import { ApplicationTemplateListItemInterface } from "@wso2is/admin.applications.v1/models/application";
import getTryItClientId from "@wso2is/admin.applications.v1/utils/get-try-it-client-id";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config"; // No specific rule found
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1/models/reducer-state"; // No specific rule found
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Popup, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Card, Grid, Placeholder } from "semantic-ui-react";
import { CardExpandedNavigationButton } from "./card-expanded-navigation-button";
import { DynamicApplicationContextCard } from "./dynamic-application-context-card";
import NewFeatureAnnouncement from "./new-feature-announcement/new-feature-announcement";
import { getGettingStartedCardIllustrations } from "../configs/ui";
import HomeConstants from "../constants/home-constants";

/**
 * Proptypes for the `AdvanceUserView` component.
 */
export interface AdvanceUserViewInterface extends IdentifiableComponentInterface {
    /**
     * Callback function triggered after an application is successfully created.
     */
    onApplicationCreate?: () => void;
}

/**
 * Overview page.
 *
 * @param props - Props injected to the component.
 *
 * @returns AdvanceUserView component
 */
const AdvanceUserView: FunctionComponent<AdvanceUserViewInterface> = ({
    onApplicationCreate,
    "data-componentid": _componentId = "getting-started-page"
}: AdvanceUserViewInterface): ReactElement => {
    const { t } = useTranslation();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const username: string = useSelector((state: AppState) => state.auth.fullName);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const homeFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.gettingStarted;
    });
    const loginAndRegistrationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.loginAndRegistration;
    });

    const showFeatureAnnouncementBanner: boolean = !homeFeatureConfig?.disabledFeatures?.includes(
        HomeConstants.FEATURE_DICTIONARY.FEATURE_ANNOUNCEMENT
    );

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);
    const [ showWizardLogin, setShowWizardLogin ] = useState<boolean>(false);

    const { organizationType } = useGetCurrentOrganizationType();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        isTryItApplicationAvailable,
        onTryItApplicationCreate,
        isTryItApplicationRetrieveRequestLoading,
        tryItApplicationAccessUrl,
        tryItApplicationClientId,
        tryItApplicationId
    } = useTryItApplication();

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

    const handleTryLoginClick = () => {
        if(isTryItApplicationAvailable){
            window.open(tryItApplicationAccessUrl+"?client_id="+getTryItClientId(tenantDomain)+"&org="+tenantDomain);
            eventPublisher.publish("tryit-try-login-overview", {
                "client-id": tryItApplicationClientId
            });
        } else{
            eventPublisher.publish("application-quick-start-click-add-user");
            setShowWizardLogin(true);
        }
    };

    const onCustomizeLoginFlowNavigate = (): void => {
        eventPublisher.publish("tryit-customize-login-flow", {
            "client-id": getTryItClientId(tenantDomain)
        });
        history.push(AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", `${ tryItApplicationId }#tab=2`) );
    };

    const renderManageUsersCard = (): ReactElement => (
        <Grid.Column
            stretched
            mobile={ 16 }
            tablet={ 16 }
            computer={ 8 }
            largeScreen={ 8 }
            widescreen={ 8 }
        >
            <Card
                fluid
                className="basic-card no-hover getting-started-card manage-users-card"
            >
                <Card.Content extra className="description-container">
                    <div className="card-heading mb-1">
                        <Heading as="h2">
                            Manage users
                        </Heading>
                    </div>
                    <Text muted>
                        Manage users in your organization who will access the  applications
                    </Text>
                </Card.Content>
                <Card.Content style={ { borderTop: "none" } } className="illustration-container">
                    <GenericIcon
                        relaxed="very"
                        size="small"
                        transparent
                        className="onboard-users-animated-illustration mb-5"
                        icon={ getGettingStartedCardIllustrations().onboardUsers }
                    />
                </Card.Content>
                <Card.Content className="action-container" extra>
                    <CardExpandedNavigationButton
                        data-testid="getting-started-page-add-user-button"
                        data-componentid="getting-started-page-add-user-button"
                        onClick={ () => {
                            eventPublisher.publish("console-getting-started-add-users-path");
                            history.push(AppConstants.getPaths().get("USERS"));
                        } }
                        text="View users"
                        icon="angle right"
                        iconPlacement="right"
                        className="primary-action-button"
                    />
                </Card.Content>
            </Card>
        </Grid.Column>
    );

    const renderConnectionsCard = (): ReactElement => (
        <Grid.Column
            stretched
            mobile={ 16 }
            tablet={ 16 }
            computer={ 8 }
            largeScreen={ 8 }
            widescreen={ 8 }
        >
            <Card
                fluid
                className="basic-card no-hover getting-started-card social-connections-card"
            >
                <Card.Content extra className="description-container">
                    <div className="card-heading mb-1">
                        <Heading as="h2">
                            Enhance app login
                        </Heading>
                    </div>
                    <Text muted>
                        { t("console:common.quickStart.sections.addSocialLogin.description") }
                    </Text>
                </Card.Content>
                <Card.Content style={ { borderTop: "none" } } className="illustration-container">
                    <GenericIcon
                        relaxed="very"
                        size="small"
                        transparent
                        className="social-connections-animated-illustration mb-5"
                        icon={ getGettingStartedCardIllustrations().setupSocialConnections }
                    />
                </Card.Content>
                <Card.Content extra className="action-container">
                    <CardExpandedNavigationButton
                        data-testid="develop-getting-started-page-add-social-login"
                        data-componentid="develop-getting-started-page-add-social-login"
                        onClick={ () => {
                            eventPublisher.publish("console-getting-started-add-social-connection-path");
                            history.push({
                                pathname: AppConstants.getPaths().get("CONNECTIONS")
                            });
                        } }
                        text="Set up social connections"
                        icon="angle right"
                        iconPlacement="right"
                        className="primary-action-button"
                    />
                </Card.Content>
            </Card>
        </Grid.Column>
    );

    const renderTryItCard = (): ReactElement => (
        <Grid.Row>
            <Grid.Column>
                <Card
                    fluid
                    className="basic-card no-hover"
                >
                    <Card.Content>
                        <div className="try-it-card">
                            <div className="try-it-card-icon">
                                <GenericIcon
                                    style={ {
                                        height: "91.3px",
                                        width: "111.26px"
                                    } }
                                    floated="left"
                                    transparent
                                    icon={
                                        getGettingStartedCardIllustrations()
                                            .tryItApplication
                                    }
                                />
                            </div>
                            <div className="try-it-card-content">
                                <div className="card-heading pt-3 mb-1">
                                    <Heading as="h2">
                                        Try login with the Try It app
                                    </Heading>
                                </div>
                                <Text muted>
                                    Use the hosted sample application to try basic and
                                    customized login flows of Asgardeo.
                                </Text>
                            </div>
                            <div className="try-it-card-actions">
                                {
                                    (
                                        isTryItApplicationRetrieveRequestLoading ||
                                        isTryItApplicationAvailable === undefined
                                    )
                                        ? (
                                            <Button
                                                loading
                                                floated="right"
                                                data-componentid={
                                                    "develop-getting-started-page-try-it-loading"
                                                }
                                                className={
                                                    "primary-action-button loading mr-3"
                                                }
                                            />
                                        )
                                        : (
                                            <>
                                                <Popup
                                                    position="top center"
                                                    trigger={ (
                                                        <Button
                                                            data-testid="develop-getting-started-page-try-it"
                                                            data-componentid="develop-getting-started-page-try-it"
                                                            onClick={ handleTryLoginClick }
                                                            icon="angle right"
                                                            iconPlacement="right"
                                                            className="primary-action-button mr-3"
                                                            size="large"
                                                        />
                                                    ) }
                                                    content="Try It"
                                                    inverted
                                                />
                                                {
                                                    isTryItApplicationAvailable && (
                                                        <Popup
                                                            position="top center"
                                                            trigger={ (
                                                                <Button
                                                                    data-testid={
                                                                        "develop-getting-started-page-cutomize-try-it"
                                                                    }
                                                                    data-componentid={
                                                                        "develop-getting-started-page-cutomize-try-it"
                                                                    }
                                                                    onClick={ onCustomizeLoginFlowNavigate }
                                                                    icon={ GearIcon }
                                                                    iconPlacement="right"
                                                                    size="large"
                                                                    className="primary-action-button"
                                                                />
                                                            ) }
                                                            content="Customize Login Flow"
                                                            inverted
                                                        />
                                                    )
                                                }
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid.Row>
    );

    return (
        <div className="advance-user-view-cards-wrapper">
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
                            : t("console:common.quickStart.greeting.heading", {
                                username: isPrivilegedUser ? username : resolveUserDisplayName(profileInfo)
                            })
                    }
                </Heading>
            </div>
            { showFeatureAnnouncementBanner && (
                <Show featureId={ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER }>
                    <Show
                        when={ loginAndRegistrationFeatureConfig?.scopes?.update }
                        featureId={ FeatureGateConstants.PREVIEW_FEATURES_IDENTIFIER }
                    >
                        <NewFeatureAnnouncement />
                    </Show>
                </Show>
            ) }
            <Grid stackable>
                <Grid.Row columns={ 2 }>
                    {
                        organizationType !== OrganizationType.SUBORGANIZATION && (
                            <Show
                                when={
                                    [
                                        ...featureConfig?.applications?.scopes?.create,
                                        ...featureConfig?.applications?.scopes?.read
                                    ]
                                }
                            >
                                <Grid.Column
                                    stretched
                                    mobile={ 16 }
                                    tablet={ 16 }
                                    computer={ 6 }
                                    largeScreen={ 6 }
                                    widescreen={ 6 }
                                >
                                    <DynamicApplicationContextCard
                                        onTemplateSelected={ (template: ApplicationTemplateListItemInterface) => {
                                            setSelectedTemplate(template);
                                            setShowWizard(true);
                                        } }
                                    />
                                </Grid.Column>
                            </Show>
                        )
                    }
                    <Grid.Column
                        stretched
                        mobile={ 16 }
                        tablet={ 16 }
                        computer={ 10 }
                        largeScreen={ 10 }
                        widescreen={ 10 }
                    >
                        <Grid stackable>
                            <Grid.Row columns={ 2 }>
                                <Show when={ featureConfig?.users?.scopes?.read }>
                                    { renderManageUsersCard() }
                                </Show>
                                <Show when={ featureConfig?.identityProviders?.scopes?.read }>
                                    { renderConnectionsCard() }
                                </Show>
                            </Grid.Row>
                            {
                                organizationType !== OrganizationType.SUBORGANIZATION && (
                                    <>
                                        { renderTryItCard() }
                                    </>
                                )
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
            {
                showWizardLogin && (
                    <TryItCreateWizard
                        data-componentId="login-playground-wizard-modal"
                        closeWizard={ () => setShowWizardLogin(false) }
                        applicationName="Asgardeo Login Playground"
                        applicationAccessUrl={ tryItApplicationAccessUrl }
                        onApplicationCreate={ () => {
                            onTryItApplicationCreate();

                            if (onApplicationCreate) {
                                onApplicationCreate();
                            }
                        } }
                    />
                )
            }
        </div>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AdvanceUserView;
