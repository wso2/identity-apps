/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Chip from "@oxygen-ui/react/Chip";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import useGetFlowConfig from "@wso2is/admin.flows.v1/api/use-get-flow-config";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import useSubscription, { UseSubscriptionInterface } from "@wso2is/admin.subscription.v1/hooks/use-subscription";
import { TenantTier } from "@wso2is/admin.subscription.v1/models/tenant-tier";
import { AGENT_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import AIText from "@wso2is/common.ai.v1/components/ai-text";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, PrimaryButton, Button as SemanticButton } from "@wso2is/react-components";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Message, Modal } from "semantic-ui-react";
import BackgroundBlob from "./background-blob.png";
import SignUpBox from "./sign-up-box";
import { ReactComponent as PreviewFeaturesIcon } from "../../../themes/default/assets/images/icons/flask-icon.svg";
import "./new-feature-announcement.scss";

/**
 * Props interface of {@link NewFeatureAnnouncement}
 */
export interface NewFeatureAnnouncementProps extends IdentifiableComponentInterface {
    id: string;
    title: ReactElement;
    description: ReactElement;
    isEnabled: boolean;
    isEnabledStatusLoading: boolean;
    onTryOut: any;
    illustration: any;
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
    ...rest
}: NewFeatureAnnouncementProps): ReactElement => {
    const { t } = useTranslation();

    const { setShowPreviewFeaturesModal, setSelectedPreviewFeatureToShow } = useFeatureGate();

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
                        { id !== "agents" && (
                            <Chip
                                label={ t(FeatureStatusLabel.PREVIEW) }
                                className="oxygen-menu-item-chip oxygen-chip-experimental"
                            />
                        ) }
                    </Typography>
                    <Typography variant="body2">
                        { description }
                    </Typography>
                </Box>
            </Box>
            <Box
                className="login-box-overlay"
                sx={ {
                    backgroundImage: `url(${BackgroundBlob})`
                } }
            ></Box>
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
                            if (id !== "agents") {
                                setShowPreviewFeaturesModal(true);
                            } else {
                                onTryOut();
                            }
                        } }
                        loading={ isEnabledStatusLoading }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            { id !== "agents" ? (<>
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

export const FeatureCarousel = () => {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ direction, setDirection ] = useState(1);

    const {
        isLoading: isUserStoresListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    const [ showAgentFeatureAnnouncementModal, setShowAgentFeatureAnnouncementModal ] = useState<boolean>(false);

    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const {
        data: registrationFlowConfigs,
        isLoading: isRegistrationFlowConfigsLoading
    } = useGetFlowConfig(FlowTypes.REGISTRATION);

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

    const features: any = useMemo(() => [
        agentFeatureConfig?.enabled && {
            description: "Extend your identity management to autonomous agents and AI systems",
            id: "agents",
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
            title: "Identity for AI Agents "
        },
        {
            description: (
                <>
                    Effortlessly design your user self-registration flows with the{ " " }
                    new AI-powered visual designer <AIText />
                </>
            ),
            id: "self-registration-orchestration",
            illustration: <Box className="login-box">
                <SignUpBox />
            </Box>,
            isEnabled: registrationFlowConfigs?.isEnabled,
            isEnabledStatusLoading: isRegistrationFlowConfigsLoading,
            onTryOut: () => {
                history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"));
            },
            title: "Design seamless self-registration experiences "
        }
    ].filter(Boolean), [
        registrationFlowConfigs,
        agentFeatureConfig,
        isRegistrationFlowConfigsLoading,
        isAgentManagementFeatureEnabledForOrganization
    ]);

    useEffect(() => {
        const interval: any = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev: number) => (prev + 1) % features.length);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [ features.length ]);

    const variants: any = {
        center: {
            opacity: 1,
            x: 0
        },
        enter: (direction: number) => ({
            opacity: 0.5,
            x: direction > 0 ? 300 : -300
        })
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
            <AnimatePresence custom={ direction } mode="wait">
                <motion.div
                    key={ currentIndex }
                    custom={ direction }
                    variants={ variants }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={ {
                        opacity: { duration: 0.2 },
                        x: { damping: 30,stiffness: 300, type: "spring" }
                    } }
                    style={ {
                        height: "100%",
                        position: "absolute",
                        width: "100%"
                    } }
                >
                    <NewFeatureAnnouncement
                        id={ features[currentIndex].id }
                        title={ features[currentIndex]?.title }
                        description={ features[currentIndex]?.description }
                        illustration={ features[currentIndex]?.illustration }
                        isEnabled={ features[currentIndex]?.isEnabled }
                        isEnabledStatusLoading={ features[currentIndex]?.isEnabledStatusLoading }
                        onTryOut={ features[currentIndex]?.onTryOut }
                    />
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

                        { isAgentManagementFeatureEnabledForOrganization ? (
                            <Message warning>
                                This feature is experimental. Some functionality may be limited or subject to change.
                            </Message>
                        ): (
                            <Message info>
                                AI agent management is coming soon to your organization! Create a fresh organization
                                { " " }for instant access, or <a
                                    href={
                                        tierName === TenantTier.FREE
                                            ? "mailto:" + supportEmail
                                            : window["AppUtils"].getConfig().extensions.getHelp.helpCenterURL
                                    }>contact us</a> { " " }
                                for early access.
                            </Message>
                        ) }

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

export default NewFeatureAnnouncement;
