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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Variants, motion } from "framer-motion";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./ai-loading-screen.scss";
import { useSelector } from "react-redux";
import AIBotAnimatedWithBackGround from "./ai-bot-animated-with-bg";
import { AppState } from "../../admin.core.v1/store";
import { ReactComponent as LoadingPlaceholder }
    from "../../themes/wso2is/assets/images/illustrations/ai-loading-screen-placeholder.svg";
import { ANIMATED_BOT_FEATURE_TAG } from "../constants/ai-common-constants";

/**
 * Interface for the AI loading screen component.
 */
interface AILoadingScreenProps extends IdentifiableComponentInterface {
    currentLoadingState?: string;
    currentProgress?: number;
    fact?: string;
    handleGenerateCancel: () => void;
}

/**
 * AI loading screen component.
 *
 * @returns ReactElement containing the AI  loading screen.
 */
const AILoadingScreen = (props: AILoadingScreenProps): ReactElement => {

    const {
        ["data-componentid"]: dataComponentId,
        currentLoadingState,
        currentProgress,
        fact,
        handleGenerateCancel
    } = props;

    const { t } = useTranslation();

    const AIDisabledFeatures: string[] = useSelector((state: AppState) =>
        state.config.ui.features?.ai?.disabledFeatures);

    const isAnimatedBotDisabled: boolean = AIDisabledFeatures?.includes(ANIMATED_BOT_FEATURE_TAG);

    // Define animation variants
    const factVariants: Variants = {
        exit: { opacity: 0, y: 20 },
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div animate="botAnimation">
            <Box
                className="ai-loading-screen-container"
                data-componentid={ `${dataComponentId}-container` }
            >
                <Box className={ `ai-loading-screen-illustration-container ${ !isAnimatedBotDisabled && "hidden" }` }>
                    <LoadingPlaceholder />
                </Box>
                {
                    !isAnimatedBotDisabled && (
                        <div className="ai-loading-screen-animation-container">
                            <AIBotAnimatedWithBackGround />
                        </div>
                    )
                }
                <Box className="ai-loading-screen-text-container">
                    <Box className="mb-5">
                        <Typography
                            variant="h5"
                            className="ai-loading-screen-heading"
                        >
                            { t("branding:ai.screens.loading.didYouKnow") }
                        </Typography>
                        <motion.div
                            key={ fact }
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={ factVariants }
                            transition={ { duration: 1, type: "spring" } }
                        >
                            <Typography className="ai-loading-screen-sub-heading">
                                { fact }
                            </Typography>
                        </motion.div>
                    </Box>
                    <Box sx={ { width: 1 } }>
                        <Box className="ai-loading-screen-loading-container">
                            <Typography className="ai-loading-screen-loading-state">
                                { currentLoadingState }
                            </Typography>
                            <Tooltip
                                title="Cancel"
                                placement="top"
                            >
                                <IconButton
                                    onClick={ handleGenerateCancel }
                                >
                                    <XMarkIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <LinearProgress
                            variant="buffer"
                            value={ currentProgress }
                            valueBuffer={ currentProgress + 1 }
                        />
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

AILoadingScreen.defaultProps = {
    currentProgress: 0,
    "data-componentid": "ai-loading-screen"
};

export default AILoadingScreen;
