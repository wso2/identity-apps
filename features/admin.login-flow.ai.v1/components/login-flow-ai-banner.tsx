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

import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { ChevronUpIcon, XMarkIcon }from "@oxygen-ui/react-icons";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as AIIcon } from "../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import AIBannerBackgroundWhite from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import AIBannerInputBackground from "../../themes/wso2is/assets/images/illustrations/ai-banner-input-background.svg";
import useAvailableAuthenticators from "../api/use-available-authenticators";
import useUserClaims from "../api/use-user-claims";
import useAILoginFlow from "../hooks/use-ai-login-flow";
import useGenerateAILoginFlow, { GenerateLoginFlowFunction } from "../hooks/use-generate-ai-login-flow";
import { BannerState } from "../models/banner-state";
import "./login-flow-ai-banner.scss";

const LoginFlowAIBanner: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { isGeneratingLoginFlow } = useAILoginFlow();

    const { availableAuthenticators } = useAvailableAuthenticators();

    const { claimURI, error: userClaimError } = useUserClaims();

    const generateAILoginFlow: GenerateLoginFlowFunction = useGenerateAILoginFlow();

    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.FULL);
    const [ userPrompt, setUserPrompt ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Handles the click event of the expand button.
     */
    const handleExpandClick = () => {
        setBannerState(BannerState.INPUT);
    };

    /**
     * Handles the click event of the collapse button.
     */
    const handleCollapseClick = () => {
        setBannerState(BannerState.COLLAPSED);
    };

    /**
     * Handles the click event of the delete button.
     */
    const handleDeleteButtonCLick = () => {
        setBannerState(BannerState.NULL);
    };

    /**
     * Handles the click event of the generate button.
     */
    const handleGenerateClick = async () => {
        if (!userPrompt) {
            return;
        }

        if (userClaimError) {
            dispatch(addAlert(
                {
                    description: userClaimError?.response?.data?.description
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: userClaimError?.response?.data?.message
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                }
            ));

            return;
        }

        setIsSubmitting(true);

        const traceID: string = uuidv4();

        await generateAILoginFlow(userPrompt, claimURI, availableAuthenticators, traceID);
        setBannerState(BannerState.COLLAPSED);
        setIsSubmitting(false);
    };

    if (isGeneratingLoginFlow) {
        return null;
    }

    if (bannerState === BannerState.FULL) {
        return (
            <Box
                className="login-flow-ai-banner full"
                style={ {
                    backgroundImage: `url(${ AIBannerBackgroundWhite })`
                } }
            >
                <div className="login-flow-ai-banner-text-container">
                    <Typography
                        as="h3"
                        className="login-flow-ai-banner-heading"
                    >
                        { t("ai:aiLoginFlow.banner.full.heading") }
                        <span className="login-flow-ai-text">
                            { t("ai:aiLoginFlow.title") }
                        </span>
                    </Typography>
                    <Typography className="login-flow-ai-banner-sub-heading">
                        { t("ai:aiLoginFlow.banner.full.subheading") }
                    </Typography>
                </div>
                <Button
                    onClick={ handleExpandClick }
                    color="primary"
                    variant="contained"
                >
                    <GenericIcon
                        icon={ AIIcon }
                        fill="white"
                        className="pr-2"
                    />
                    { t("ai:aiLoginFlow.banner.full.button") }
                </Button>
            </Box>
        );
    }

    if (bannerState === BannerState.INPUT) {
        return (
            <Box
                className="login-flow-ai-banner-input"
                style={ {
                    backgroundImage: `url(${ AIBannerInputBackground })`
                } }
            >
                <Box className="login-flow-ai-banner-close-icon">
                    <IconButton
                        onClick={ handleCollapseClick }
                    >
                        <ChevronUpIcon />
                    </IconButton>
                </Box>
                <div className="login-flow-ai-banner-text-container">
                    <Typography
                        as="h3"
                        className="login-flow-ai-banner-heading"
                    >
                        { t("ai:aiLoginFlow.banner.input.heading") }
                        <span className="login-flow-ai-text">
                            { t("ai:aiLoginFlow.title") }
                        </span>
                    </Typography>
                    <Typography className="login-flow-ai-banner-sub-heading">
                        { t("ai:aiLoginFlow.banner.input.subheading") }
                        <DocumentationLink
                            link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
                            isLinkRef={ true }>
                            <Trans i18nKey={ "extensions:common.learnMore" }>
                                Learn more
                            </Trans>
                        </DocumentationLink>
                    </Typography>
                </div>
                <TextField
                    name="loginFlowInput"
                    className="login-flow-ai-input-field mt-5"
                    placeholder={ t("ai:aiLoginFlow.banner.input.placeholder") }
                    fullWidth
                    multiline
                    maxRows={ 4 }
                    value={ userPrompt }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserPrompt(e.target.value) }
                    InputProps={ {
                        className: "login-flow-ai-input-field-inner",
                        endAdornment: (
                            !isSubmitting ? (
                                <IconButton
                                    className="login-flow-ai-input-button"
                                    onClick={ () => handleGenerateClick() }
                                    disabled={ !userPrompt }
                                >
                                    <GenericIcon
                                        icon={ AIIcon }
                                        rounded
                                        transparent
                                        fill="white"
                                    />
                                </IconButton>
                            ) : (
                                <CircularProgress color="primary" />
                            )
                        )
                    } }
                />
            </Box>
        );
    }

    if (bannerState === BannerState.COLLAPSED) {
        return (
            <Box
                className="login-flow-ai-banner collapsed"
                style={ {
                    backgroundImage: `url(${ AIBannerBackgroundWhite })`
                } }
            >
                <Box className="login-flow-ai-banner-close-icon">
                    <IconButton
                        onClick={ handleDeleteButtonCLick }
                    >
                        <XMarkIcon />
                    </IconButton>
                </Box>
                <Box className="login-flow-ai-banner-button-container">
                    <div className="login-flow-ai-banner-text-container">
                        <Typography
                            as="h3"
                            className="login-flow-ai-banner-heading"
                        >
                            { t("ai:aiLoginFlow.banner.collapsed.heading") }
                            <span className="login-flow-ai-text">
                                { t("ai:aiLoginFlow.title") }
                            </span>
                        </Typography>
                        <Typography className="login-flow-ai-banner-sub-heading">
                            { t("ai:aiLoginFlow.banner.input.subheading") }
                            <DocumentationLink
                                link={ "" }
                                isLinkRef={ true }>
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                    Learn more
                                </Trans>
                            </DocumentationLink>
                        </Typography>
                    </div>
                    <Button
                        onClick={ handleExpandClick }
                        color="primary"
                        variant="contained"
                    >
                        <GenericIcon
                            icon={ AIIcon }
                            fill="white"
                            className="pr-2"
                        />
                        { t("ai:aiLoginFlow.banner.collapsed.button") }
                    </Button>
                </Box>
            </Box>
        );
    }

    return null;
};

export default LoginFlowAIBanner;
