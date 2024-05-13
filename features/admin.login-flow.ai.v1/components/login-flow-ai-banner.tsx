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

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
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
import AIBanner from "../../common.ai.v1/components/ai-banner";
import AIBannerTall from "../../common.ai.v1/components/ai-banner-tall";
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

    return (
        <>
            <Collapse in={ bannerState === BannerState.FULL }>
                <AIBanner
                    title={ t("ai:aiLoginFlow.banner.full.heading") }
                    description={ t("ai:aiLoginFlow.banner.full.subheading") }
                    aiText={ t("ai:aiLoginFlow.title") }
                    actionButtonText={ t("ai:aiLoginFlow.banner.full.button") }
                    onActionButtonClick={ handleExpandClick }
                    titleLabel={ (
                        <Chip
                            size="small"
                            label={ t("common:beta").toUpperCase() }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
                    ) }
                />
            </Collapse>
            <Collapse in={ bannerState === BannerState.INPUT || bannerState === BannerState.COLLAPSED }>
                <AIBannerTall
                    title={ t("ai:aiLoginFlow.banner.input.heading") }
                    description={ (
                        <>
                            { t("ai:aiLoginFlow.banner.input.subheading") }
                            <DocumentationLink
                                link={ getLink("develop.applications.editApplication.common.signInMethod." +
                                    "conditionalAuthenticaion.ai.learnMore") }
                            >
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                    Learn more
                                </Trans>
                            </DocumentationLink>
                        </>
                    ) }
                    aiText={ t("ai:aiLoginFlow.title") }
                    titleLabel={ (
                        <Chip
                            size="small"
                            label={ t("common:beta").toUpperCase() }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
                    ) }
                >
                    <TextField
                        name="loginFlowInput"
                        className="login-flow-ai-input-field"
                        placeholder={ t("ai:aiLoginFlow.banner.input.placeholder") }
                        fullWidth
                        multiline
                        maxRows={ 4 }
                        size="small"
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
                                (!isSubmitting && !isAuthenticatorsLoading ) ? (
                                    <IconButton
                                        onClick={ () => handleGenerateClick() }
                                        disabled={ !userPrompt?.trim() }
                                    >
                                        <SendOutlinedIcon
                                            className={ `login-flow-ai-input-button-icon
                                                ${ !userPrompt?.trim() ? "disabled" : "" }` }
                                        />
                                    </IconButton>
                                ) : (
                                    <Box className="m-3">
                                        <CircularProgress color="primary" size={ 20 } />
                                    </Box>
                                )
                            )
                        } }
                    />
                    <Box className="login-flow-ai-disclaimer">
                        <Typography variant="caption">
                            { t("ai:aiLoginFlow.disclaimer") }
                            <DocumentationLink
                                link={ getLink("common.termsOfService") }
                            >
                                { t("ai:aiLoginFlow.termsAndConditions") }
                            </DocumentationLink>
                        </Typography>
                    </Box>
                    {
                        promptHistory?.length > 0 && !isSubmitting && (
                            <Accordion
                                className="login-flow-ai-banner-history-container"
                                disableGutters
                                elevation={ 0 }
                                sx={ {
                                    "&:before": {
                                        display: "none"
                                    }
                                } }
                                onChange={ () => setShowHistory(!showHistory) }

                            >
                                <AccordionSummary className="login-flow-ai-banner-history-title">
                                    <Button
                                        startIcon={ <HistoryOutlinedIcon /> }
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        className="login-flow-ai-banner-history-button"
                                    >
                                        { t("ai:aiLoginFlow.promptsHistory") }
                                    </Button>
                                </AccordionSummary>
                                <AccordionDetails className="login-flow-ai-banner-history-card-container">
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
                            negative
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
                </AIBannerTall>
            </Collapse>
        </>
    );
};

/**
 * Default props for the component.
 */
LoginFlowAIBanner.defaultProps = {
    "data-componentid": "login-flow-ai-banner"
};

export default LoginFlowAIBanner;
