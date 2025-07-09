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
import useNewRegistrationPortalFeatureStatus from
    "@wso2is/admin.registration-flow-builder.v1/api/use-new-registration-portal-feature-status";
import AIText from "@wso2is/common.ai.v1/components/ai-text";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BackgroundBlob from "./background-blob.png";
import SignUpBox from "./sign-up-box";
import { ReactComponent as PreviewFeaturesIcon } from "../../../themes/default/assets/images/icons/flask-icon.svg";
import "./new-feature-announcement.scss";

/**
 * Props interface of {@link NewFeatureAnnouncement}
 */
export interface NewFeatureAnnouncementProps extends IdentifiableComponentInterface {
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
    title,
    description,
    isEnabled,
    isEnabledStatusLoading,
    onTryOut,
    illustration,
    ...rest
}: NewFeatureAnnouncementProps): ReactElement => {
    const { t } = useTranslation();

    const { setShowPreviewFeaturesModal } = useFeatureGate();

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
                        <Chip
                            label={ t(FeatureStatusLabel.PREVIEW) }
                            className="oxygen-menu-item-chip oxygen-chip-experimental"
                        />
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
                        onClick={ () => setShowPreviewFeaturesModal(true) }
                        loading={ isEnabledStatusLoading }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            <PreviewFeaturesIcon /> Enable and try out
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
        data: isNewRegistrationPortalEnabled,
        isLoading: isNewRegistrationPortalEnabledRequestLoading
    } = useNewRegistrationPortalFeatureStatus();

    const agentFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.agents);
    const isAgentManagementFeatureEnabledForOrganization: boolean = useMemo(() => {
        return false;
    }, []);

    const features: any = useMemo(() => [
        agentFeatureConfig?.enabled && {
            description: "Extend your identity management to autonomous agents and AI systems",
            isEnabled: isAgentManagementFeatureEnabledForOrganization,
            isEnabledStatusLoading: false,
            onTryOut: () => {},
            title: "Identity for AI Agents "
        },
        {
            description: (
                <>
                    Effortlessly design your user self-registration flows with the{ " " }
                    new AI-powered visual designer <AIText />
                </>
            ),
            illustration: <Box className="login-box">
                <SignUpBox />
            </Box>,
            isEnabled: isNewRegistrationPortalEnabled,
            isEnabledStatusLoading: isNewRegistrationPortalEnabledRequestLoading,
            onTryOut: () => {
                history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"));
            },
            title: "Design seamless self-registration experiences "
        }
    ].filter(Boolean), [ isNewRegistrationPortalEnabled, agentFeatureConfig ]);

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
                        title={ features[currentIndex]?.title }
                        description={ features[currentIndex]?.description }
                        illustration={ features[currentIndex]?.illustration }
                        isEnabled={ features[currentIndex]?.isEnabled }
                        isEnabledStatusLoading={ features[currentIndex]?.isEnabledStatusLoading }
                        onTryOut={ features[currentIndex]?.onTryOut }
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NewFeatureAnnouncement;
