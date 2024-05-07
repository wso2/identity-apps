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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { ChevronUpIcon }from "@oxygen-ui/react-icons";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as AIIcon } from "../../themes/wso2is/assets/images/icons/solid-icons/ai-icon.svg";
import AIBannerBackgroundWhite from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import AIBannerInputBackgroundTall from
    "../../themes/wso2is/assets/images/illustrations/ai-banner-input-background-tall.svg";
import useAvailableAuthenticators from "../api/use-available-authenticators";
import useUserClaims from "../api/use-user-claims";
import useAILoginFlow from "../hooks/use-ai-login-flow";
import useGenerateAILoginFlow, { GenerateLoginFlowFunction } from "../hooks/use-generate-ai-login-flow";
import { BannerState } from "../models/banner-state";
import "./login-flow-ai-banner.scss";

const LoginFlowAIBanner: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        bannerState,
        isGeneratingLoginFlow,
        promptHistory,
        updatePromptHistory,
        userPrompt,
        setBannerState,
        setUserPrompt
    } = useAILoginFlow();

    const { getLink } = useDocumentation();

    const { filteredAuthenticators, loading: isAuthenticatorsLoading } = useAvailableAuthenticators();

    const { claimURI, error: userClaimError } = useUserClaims();

    const generateAILoginFlow: GenerateLoginFlowFunction = useGenerateAILoginFlow();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showHistory, setShowHistory ] = useState<boolean>(false);
    const [ showReplaceConfirmationModal, setShowReplaceConfirmationModal ] = useState<boolean>(false);
    const [ replacingPrompt, setReplacingPrompt ] = useState<string>("");

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

        if (filteredAuthenticators.local.length === 0 &&
            filteredAuthenticators.enterprise.length === 0 &&
            filteredAuthenticators.recovery.length === 0 &&
            filteredAuthenticators.secondFactor.length === 0 &&
            filteredAuthenticators.social.length === 0
        ) {
            dispatch(addAlert(
                {
                    description: t("ai:aiLoginFlow.notifications.noAuthenticators.description"),
                    level: AlertLevels.WARNING,
                    message: t("ai:aiLoginFlow.notifications.noAuthenticators.message")
                }
            ));

            return;
        }

        setIsSubmitting(true);

        updatePromptHistory(userPrompt);

        const traceID: string = uuidv4();

        await generateAILoginFlow(userPrompt, claimURI, filteredAuthenticators, traceID);
        setBannerState(BannerState.INPUT);
        setIsSubmitting(false);
    };

    /**
     * Replaces the prompt with the selected prompt.
     *
     * @param prompt - Selected prompt.
     */
    const replacePrompt = (prompt: string) => {
        // Ask for confirmation before replacing the prompt.
        // Ask only a prompt exists in the input field and the selected prompt is different from the current prompt.
        if (userPrompt && userPrompt !== prompt) {
            setReplacingPrompt(prompt);
            setShowReplaceConfirmationModal(true);

            return;
        }

        setUserPrompt(prompt);
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
                        <AIIcon className="ai-icon"/>
                        <Chip
                            size="small"
                            label={ t("common:beta").toUpperCase() }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
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
                    { t("ai:aiLoginFlow.banner.full.button") }
                </Button>
            </Box>
        );
    }

    if (bannerState === BannerState.INPUT) {
        return (
            <Box
                className="login-flow-ai-banner-container"
                style={ {
                    backgroundImage: `url(${ AIBannerInputBackgroundTall })`
                } }
            >
                <Box className="login-flow-ai-banner-input">
                    <Box className="login-flow-ai-banner-input-heading-container">
                        <Typography
                            as="h3"
                            className="login-flow-ai-banner-heading"
                        >
                            { t("ai:aiLoginFlow.banner.input.heading") }
                            <span className="login-flow-ai-text">
                                { t("ai:aiLoginFlow.title") }
                            </span>
                            <AIIcon className="ai-icon"/>
                            <Chip
                                size="small"
                                label={ t("common:beta").toUpperCase() }
                                className="oxygen-chip-beta mb-1 ml-2"
                            />
                        </Typography>
                        <IconButton
                            onClick={ handleCollapseClick }
                        >
                            <ChevronUpIcon />
                        </IconButton>
                    </Box>
                    <div className="login-flow-ai-banner-text-container mb-5">
                        <Typography className="login-flow-ai-banner-sub-heading">
                            { t("ai:aiLoginFlow.banner.input.subheading") }
                            <DocumentationLink
                                link={ getLink("develop.applications.editApplication.common.signInMethod." +
                                    "conditionalAuthenticaion.ai.learnMore") }
                            >
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                    Learn more
                                </Trans>
                            </DocumentationLink>
                        </Typography>
                    </div>
                    <TextField
                        name="loginFlowInput"
                        className="login-flow-ai-input-field"
                        placeholder={ t("ai:aiLoginFlow.banner.input.placeholder") }
                        fullWidth
                        multiline
                        maxRows={ 4 }
                        value={ userPrompt }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                            setUserPrompt(e?.target?.value) }
                        onKeyDown={ (e: React.KeyboardEvent<HTMLInputElement>) => {
                            // Go to next line with shift + enter.
                            if (e?.key === "Enter" && e?.shiftKey) {
                                return;
                            }

                            // Handle the enter key press.
                            if (e?.key === "Enter") {
                                e?.preventDefault();
                                handleGenerateClick();
                            }
                        } }
                        inputProps={ {
                            maxlength: 1000
                        } }
                        InputProps={ {
                            className: "login-flow-ai-input-field-inner",
                            endAdornment: (
                                (!isSubmitting && !isAuthenticatorsLoading )? (
                                    <IconButton
                                        className="login-flow-ai-input-button"
                                        onClick={ () => handleGenerateClick() }
                                        disabled={ !userPrompt }
                                    >
                                        <SendOutlinedIcon
                                            className={
                                                `login-flow-ai-input-button-icon ${ !userPrompt ? "disabled" : "" }` }
                                        />
                                    </IconButton>
                                ) : (
                                    <Box>
                                        <CircularProgress color="primary" size={ 25 } className="mr-2 mt-1" />
                                    </Box>
                                )
                            )
                        } }
                    />
                    <Box className={ `login-flow-ai-disclaimer ${ promptHistory.length > 0 ? "" : "mb-6" }` }>
                        <Typography variant="caption">
                            { t("ai:aiLoginFlow.disclaimer") }
                            <DocumentationLink
                                link={ getLink("common.termsOfService") }
                            >
                                { t("ai:aiLoginFlow.termsAndConditions") }
                            </DocumentationLink>
                        </Typography>
                    </Box>
                </Box>
                {
                    promptHistory.length > 0 && (
                        <Accordion
                            className="login-flow-ai-banner-history"
                            disableGutters
                            elevation={ 0 }
                            sx={ {
                                "&:before": {
                                    display: "none"
                                }
                            } }
                            onChange={ () => setShowHistory(!showHistory) }
                        >
                            <AccordionSummary>
                                <Typography variant="subtitle2">
                                    { t("ai:aiLoginFlow.promptsHistory") }
                                </Typography>
                                <ExpandMoreIcon
                                    className={ showHistory
                                        ? "login-flow-ai-banner-caret-icon close-icon"
                                        : "login-flow-ai-banner-caret-icon open-icon"
                                    }
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <Grid
                                        container
                                        spacing={ 2 }
                                    >
                                        {
                                            promptHistory.map((prompt: string, index: number) => (
                                                <Grid
                                                    xs={ 4 }
                                                    key={ index }
                                                >
                                                    <Card
                                                        className="login-flow-ai-banner-history-card"
                                                        onClick={ () => replacePrompt(prompt) }
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                color="text.secondary"
                                                                variant="body2"
                                                                className="login-flow-ai-banner-history-card-text"
                                                            >
                                                                {
                                                                    prompt.length > 200
                                                                        ? `${prompt.substring(0, 200)}...` : prompt
                                                                }
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )
                }
                <ConfirmationModal
                    onClose={ (): void => setShowReplaceConfirmationModal(false) }
                    type="warning"
                    open={ showReplaceConfirmationModal }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowReplaceConfirmationModal(false) }
                    onPrimaryActionClick={ () => {
                        setUserPrompt(replacingPrompt);
                        setShowReplaceConfirmationModal(false);
                    } }
                    data-componentid={ `${ componentId }-propmt-replace-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-propmt-replace-confirmation-modal-header` }
                    >
                        { t("ai:aiLoginFlow.confirmations.replacePrompt.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid={ `${ componentId }-propmt-replace-confirmation-modal-message` }
                    >
                        {
                            t("ai:aiLoginFlow.confirmations.replacePrompt.message")
                        }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-propmt-replace-confirmation-modal-content` }
                    >
                        { t("ai:aiLoginFlow.confirmations.replacePrompt.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
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
                            <AIIcon className="ai-icon"/>
                            <Chip
                                size="small"
                                label={ t("common:beta").toUpperCase() }
                                className="oxygen-chip-beta mb-1 ml-2"
                            />
                        </Typography>
                        <Typography className="login-flow-ai-banner-sub-heading">
                            { t("ai:aiLoginFlow.banner.input.subheading") }
                            <DocumentationLink
                                link={ getLink("develop.applications.editApplication.common.signInMethod." +
                                    "conditionalAuthenticaion.ai.learnMore") }
                            >
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
                        { t("ai:aiLoginFlow.banner.collapsed.button") }
                    </Button>
                </Box>
            </Box>
        );
    }

    return null;
};

/**
 * Default props for the component.
 */
LoginFlowAIBanner.defaultProps = {
    "data-componentid": "login-flow-ai-banner"
};

export default LoginFlowAIBanner;
