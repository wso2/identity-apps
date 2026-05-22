/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { IntegrationInstructions, ListAlt, ManageAccounts, Security } from "@mui/icons-material";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, FeatureFlagsInterface } from "@wso2is/access-control";
import { CDSConfig, useCDSConfig } from "@wso2is/admin.cds.v1";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import useSubscription, { UseSubscriptionInterface } from "@wso2is/admin.subscription.v1/hooks/use-subscription";
import { TenantTier } from "@wso2is/admin.subscription.v1/models/tenant-tier";
import { AGENT_USERSTORE } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, PrimaryButton, Button as SemanticButton } from "@wso2is/react-components";
import classNames from "classnames";
import DOMPurify from "dompurify";
import { AnimatePresence, motion } from "framer-motion";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import AIAgentBox from "./ai-agent-box";
import RebrandingAnnouncement from "./rebranding-announcement";
import CustomerDataServiceIllustration from "./customer-data-service-illustration";
import SurveyBox from "./survey-box";
import { ReactComponent as PreviewFeaturesIcon } from "../../../themes/default/assets/images/icons/flask-icon.svg";
import "./new-feature-announcement.scss";

/**
 * Props interface of {@link NewFeatureAnnouncement}
 */
interface NewFeatureAnnouncementProps extends IdentifiableComponentInterface {
    id: string;
    title: ReactElement;
    description: ReactElement | string;
    isEnabled: boolean;
    isEnabledStatusLoading: boolean;
    onTryOut: any;
    illustration: any;
    buttonText: ReactElement;
    featureFlags?: FeatureFlagsInterface[];
    featureName?: string;
    featureStatusKey?: string;
    featureConfig?: FeatureAccessConfigInterface
}

/**
 * Section to display new feature announcements.
 *
 * @param props - Props injected to the component.
 * @returns NewFeatureAnnouncement component.
 */
const NewFeatureAnnouncement: FunctionComponent<NewFeatureAnnouncementProps> = ({
    "data-componentid": componentId = "new-feature-announcement",
    id,
    title,
    description,
    isEnabled,
    isEnabledStatusLoading,
    onTryOut,
    illustration,
    buttonText,
    featureFlags,
    featureStatusKey,
    featureConfig,
    featureName,
    ...rest
}: NewFeatureAnnouncementProps): ReactElement => {
    const { setShowPreviewFeaturesModal, setSelectedPreviewFeatureToShow } = useFeatureGate();

    // Handle both string and ReactElement descriptions
    const renderDescription = () => {
        if (typeof description === "string") {
            const sanitizedDescription: string = DOMPurify.sanitize(description, {
                ALLOWED_ATTR: [ ], // No attributes allowed.
                ALLOWED_TAGS: [ "b" ] // Allow only bold.
            });

            return <span dangerouslySetInnerHTML={ { __html: sanitizedDescription } } />;
        }

        // If it's a ReactElement, render it directly
        return description;
    };

    return (
        <Paper
            className={ classNames("new-feature-announcement") }
            data-componentid={ componentId }
            variant="outlined"
            { ...rest }
        >
            <Box className="new-feature-announcement-content">
                <Box>
                    <Typography variant="h3">
                        { title }
                        { featureStatusKey && (
                            <FeatureFlagLabel
                                featureFlags={ featureFlags }
                                featureKey={ featureStatusKey }
                                featureConfig={ featureConfig }
                                featureName={ featureName }
                                type="chip"
                            />
                        ) }
                    </Typography>
                    <Typography variant="body2">
                        { renderDescription() }
                    </Typography>
                </Box>
            </Box>
            { illustration }
            <Box className="new-feature-announcement-actions">
                { isEnabled ? (
                    <Button
                        variant="contained"
                        onClick={ onTryOut }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            Try Out <ChevronRightIcon />
                        </Box>
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={ () => {
                            setSelectedPreviewFeatureToShow(id);
                            if (id !== "agents" && id !== "user-survey") {
                                setShowPreviewFeaturesModal(true);
                            } else {
                                onTryOut();
                            }
                        } }
                        loading={ isEnabledStatusLoading }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            { id === "user-survey" ? buttonText :
                                id !== "agents" ? (<>
                                    <PreviewFeaturesIcon />
                                Enable and try out
                                </>) : "Contact Us for Early Access" }
                        </Box>
                    </Button>
                ) }
            </Box>
        </Paper>
    );
};

const AUTO_SLIDE_INTERVAL: number = 5000;
const SLIDE_TRANSITION_DURATION: number = 0.75;
const CUSTOMER_DATA_SERVICE_FEATURE_ID: string = "customer-data-platform";

export const FeatureCarousel = () => {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const { setShowPreviewFeaturesModal, setSelectedPreviewFeatureToShow } = useFeatureGate();

    const {
        isLoading: isUserStoresListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    const [ showAgentFeatureAnnouncementModal, setShowAgentFeatureAnnouncementModal ] = useState<boolean>(false);

    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const agentFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.agents);

    const { tierName }: UseSubscriptionInterface = useSubscription();

    const isAgentManagementFeatureEnabledForOrganization: boolean = useMemo(() => {
        const agentUserStore: UserStoreListItem =
            userStoresList?.find((userStore: UserStoreListItem) => userStore?.name === AGENT_USERSTORE);

        if (agentFeatureConfig?.enabled && agentUserStore) {
            return true;
        }

        return false;
    }, [ isUserStoresListFetchRequestLoading, userStoresList ]);

    const customerDataServiceFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config.ui.features?.customerDataService);
    const isCDSFeatureEnabled: boolean = customerDataServiceFeatureConfig?.enabled ?? false;
    const {
        data: cdsConfig,
        isLoading: isCDSConfigFetchRequestLoading
    } = useCDSConfig<CDSConfig>(isCDSFeatureEnabled);
    const isCDSEnabledForOrganization: boolean = isCDSFeatureEnabled && (cdsConfig?.cds_enabled ?? false);


    const isUserSurveyBannerEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.userSurveyBanner?.enabled);
    const userSurveyURL: string = useSelector((state: AppState) => state?.config?.ui?.userSurveyBanner?.url);
    const userSurveyTitle: string = useSelector((state: AppState) => state?.config?.ui?.userSurveyBanner?.title);
    const userSurveyDescription: string = useSelector((state: AppState) =>
        state?.config?.ui?.userSurveyBanner?.description);
    const userSurveyButtonText: string = useSelector((state: AppState) =>
        state?.config?.ui?.userSurveyBanner?.buttonText);

    const isRebrandingBannerEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.enabled);
    const rebrandingBannerTitle: string = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.title);
    const rebrandingBannerDescription: string = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.description);
    const rebrandingBannerSubDescription: string = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.subDescription);
    const rebrandingBannerButtonText: string = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.buttonText);
    const rebrandingBannerAnnouncementUrl: string = useSelector((state: AppState) =>
        state?.config?.ui?.rebrandingBanner?.announcementUrl);

    const features: any = useMemo(() => [
        isRebrandingBannerEnabled && {
            announcementUrl: rebrandingBannerAnnouncementUrl,
            buttonText: rebrandingBannerButtonText,
            description: rebrandingBannerDescription,
            id: "rebranding",
            onTryOut: () => {
                if (rebrandingBannerAnnouncementUrl) {
                    window.open(rebrandingBannerAnnouncementUrl, "_blank", "noopener,noreferrer");
                }
            },
            subDescription: rebrandingBannerSubDescription,
            title: rebrandingBannerTitle
        },
        isUserSurveyBannerEnabled && {
            buttonText: userSurveyButtonText,
            description: userSurveyDescription,
            id: "user-survey",
            illustration: <Box className="survey-box">
                <SurveyBox />
            </Box>,
            onTryOut: () => {
                window.open(userSurveyURL, "_blank", "noopener,noreferrer");
            },
            title: userSurveyTitle
        },
        {
            description: "Power personalization, automation, and customer engagement " +
                "with identity-aware customer data.",
            featureConfig: customerDataServiceFeatureConfig,
            featureFlags: customerDataServiceFeatureConfig?.featureFlags,
            featureName: "customerDataService",
            featureStatusKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.CUSTOMER_DATA_SERVICE,
            id: CUSTOMER_DATA_SERVICE_FEATURE_ID,
            illustration: <Box className="customer-data-service-box">
                <img
                    alt="Customer data service"
                    data-componentid="customer-data-service-illustration"
                    src={ CustomerDataServiceIllustration }
                />
            </Box>,
            isEnabled: isCDSEnabledForOrganization,
            isEnabledStatusLoading: isCDSConfigFetchRequestLoading,
            onTryOut: () => {
                if (isCDSEnabledForOrganization) {
                    history.push(AppConstants.getPaths().get("PROFILES"));

                    return;
                }

                setSelectedPreviewFeatureToShow(CUSTOMER_DATA_SERVICE_FEATURE_ID);
                setShowPreviewFeaturesModal(true);
            },
            title: "Your Identity Platform, Now With Customer Intelligence."
        },
        agentFeatureConfig?.enabled && {
            description: "Extend your identity management to autonomous agents and AI systems",
            featureFlags: agentFeatureConfig?.featureFlags,
            featureName: "agents",
            featureStatusKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.AGENTS,
            id: "agents",
            illustration: <Box className="ai-agent-box">
                <AIAgentBox />
            </Box>,
            isEnabled: isAgentManagementFeatureEnabledForOrganization,
            isEnabledStatusLoading: false,
            onTryOut: () => {
                if (isAgentManagementFeatureEnabledForOrganization) {
                    setShowAgentFeatureAnnouncementModal(true);
                } else {
                    const url: string = tierName === TenantTier.FREE
                        ? `mailto:${supportEmail}`
                        : window["AppUtils"].getConfig().extensions.getHelp.helpCenterURL;

                    window.open(url, "_blank");
                }
            },
            title: "Identity for AI Agents"
        }
    ].filter(Boolean), [
        agentFeatureConfig,
        isAgentManagementFeatureEnabledForOrganization,
        isCDSConfigFetchRequestLoading,
        isCDSEnabledForOrganization,
        customerDataServiceFeatureConfig,
        isRebrandingBannerEnabled,
        isUserSurveyBannerEnabled,
        supportEmail,
        setSelectedPreviewFeatureToShow,
        setShowPreviewFeaturesModal,
        tierName,
        userSurveyButtonText,
        userSurveyDescription,
        userSurveyTitle,
        userSurveyURL
    ]);

    useEffect(() => {
        const interval: any = setInterval(() => {
            setCurrentIndex((prev: number) => (prev + 1) % features.length);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [ features.length ]);

    const variants: any = {
        center: {
            x: "0%"
        },
        enter: {
            x: "100%"
        },
        exit: {
            x: "-100%"
        }
    };

    return (
        <div
            style={ {
                height: "200px",
                overflow: "hidden",
                position: "relative",
                width: "100%"
            } }
        >
            <AnimatePresence initial={ false } mode="sync">
                <motion.div
                    key={ currentIndex }
                    variants={ variants }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={ {
                        duration: SLIDE_TRANSITION_DURATION,
                        ease: [ 0.4, 0, 0.2, 1 ]
                    } }
                    style={ {
                        height: "100%",
                        position: "absolute",
                        width: "100%"
                    } }
                >
                    { features[currentIndex]?.id === "rebranding" ? (
                        <RebrandingAnnouncement
                            title={ features[currentIndex]?.title }
                            description={ features[currentIndex]?.description }
                            subDescription={ features[currentIndex]?.subDescription }
                            buttonText={ features[currentIndex]?.buttonText }
                            announcementUrl={ features[currentIndex]?.announcementUrl }
                            onAnnouncementClick={ features[currentIndex]?.onTryOut }
                        />
                    ) : (
                        <NewFeatureAnnouncement
                            id={ features[currentIndex]?.id }
                            title={ features[currentIndex]?.title }
                            description={ features[currentIndex]?.description }
                            illustration={ features[currentIndex]?.illustration }
                            isEnabled={ features[currentIndex]?.isEnabled }
                            isEnabledStatusLoading={ features[currentIndex]?.isEnabledStatusLoading }
                            onTryOut={ features[currentIndex]?.onTryOut }
                            buttonText={ features[currentIndex]?.buttonText }
                            featureFlags={ features[currentIndex]?.featureFlags }
                            featureName={ features[currentIndex]?.featureName }
                            featureStatusKey={ features[currentIndex]?.featureStatusKey }
                            featureConfig={ features[currentIndex]?.featureConfig }
                        />
                    ) }
                </motion.div>
            </AnimatePresence>

            { showAgentFeatureAnnouncementModal && (
                <Modal
                    open={ true }
                    className="wizard action-create-wizard"
                    dimmer="blurring"
                    size="small"
                    onClose={ () => setShowAgentFeatureAnnouncementModal(false) }
                    closeOnDimmerClick={ false }
                    closeOnEscape
                >
                    <Modal.Header className="wizard-header">
                        Identity for AI Agents
                        <Heading as="h6">
                            Extending identity management to autonomous agents and AI systems
                        </Heading>
                    </Modal.Header>
                    <Modal.Content className="content-container" scrolling>
                        <Box display="flex" flexDirection="column" gap={ 3 } width="100%">
                            <Box display="flex" gap={ 3 }>
                                <Paper
                                    elevation={ 3 }
                                    sx={ {
                                        alignItems: "flex-start",
                                        borderLeft: 4,
                                        borderLeftColor: "primary.main",
                                        borderLeftStyle: "solid",
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column",
                                        gap: 1.5,
                                        p: 2
                                    } }
                                >
                                    <Box color="primary.main" mb={ 1 }>
                                        <Security fontSize="large" color="inherit" />
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={ 600 }
                                    >Secure Agent Authentication</Typography>
                                    <Typography variant="body2">
                                        Enable AI agents to authenticate securely with time-limited tokens { " " }
                                        and role-based permissions.
                                    </Typography>
                                </Paper>
                                <Paper
                                    elevation={ 3 }
                                    sx={ {
                                        alignItems: "flex-start",
                                        borderLeft: 4,
                                        borderLeftColor: "primary.main",
                                        borderLeftStyle: "solid",
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column",
                                        gap: 1.5,
                                        p: 2
                                    } }
                                >
                                    <Box color="primary.main" mb={ 1 }>
                                        <ManageAccounts fontSize="large" color="inherit" />
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={ 600 }
                                    >
                                        Automated Access Management
                                    </Typography>
                                    <Typography variant="body2">
                                        Dynamically manage agent permissions based on tasks, context, and
                                        { " " } security policies.
                                    </Typography>
                                </Paper>
                            </Box>
                            <Box display="flex" gap={ 3 }>
                                <Paper
                                    elevation={ 3 }
                                    sx={ {
                                        alignItems: "flex-start",
                                        borderLeft: 4,
                                        borderLeftColor: "primary.main",
                                        borderLeftStyle: "solid",
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column",
                                        gap: 1.5,
                                        p: 2
                                    } }>
                                    <Box color="primary.main" mb={ 1 }>
                                        <ListAlt fontSize="large" color="inherit" />
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={ 600 }
                                    >
                                        Comprehensive Audit Trail
                                    </Typography>
                                    <Typography variant="body2">
                                        Enables tracking every agent activity with comprehensive logging and
                                        compliance reporting capabilities.
                                    </Typography>
                                </Paper>
                                <Paper
                                    elevation={ 3 }
                                    sx={ {
                                        alignItems: "flex-start",
                                        borderLeft: 4,
                                        borderLeftColor: "primary.main",
                                        borderLeftStyle: "solid",
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "column",
                                        gap: 1.5,
                                        p: 2
                                    } }
                                >
                                    <Box color="primary.main" mb={ 1 }>
                                        <IntegrationInstructions fontSize="large" color="inherit" />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={ 600 }>
                                        Seamless Integration
                                    </Typography>
                                    <Typography variant="body2">
                                        Works with your existing business infrastructure with minimum changes as
                                        it’s built on auth standards.
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <SemanticButton
                                        className="link-button"
                                        basic
                                        primary
                                        floated="left"
                                        onClick={ () => setShowAgentFeatureAnnouncementModal(false) }
                                    >
                                    Close
                                    </SemanticButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    { isAgentManagementFeatureEnabledForOrganization && (
                                        <PrimaryButton
                                            onClick={ () => {
                                                history.push(AppConstants.getPaths().get("AGENTS"));
                                            } }
                                        >Try out</PrimaryButton>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </Modal.Actions>

                </Modal>
            ) }
        </div>
    );
};
