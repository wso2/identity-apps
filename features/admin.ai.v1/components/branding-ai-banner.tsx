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

import { ChevronUpIcon } from "@oxygen-ui/react-icons";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import {
    DocumentationLink,
    GenericIcon,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ReactComponent as AIIcon }
    from "../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import AIBannerBackgroundWhite from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import AIBannerInputBackground from "../../themes/wso2is/assets/images/illustrations/ai-banner-input-background.svg";
import useAIBrandingPreference from "../hooks/use-ai-branding-preference";
import useGenerateAIBrandingPreference,
{ GenerateAIBrandingPreferenceFunc } from "../hooks/use-generate-ai-branding-preference";
import { BannerState } from "../models/types";
import "./branding-ai-banner.scss";

/**
 * Branding AI banner component.
 */
export const BrandingAIBanner: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.FULL);
    const [ websiteUrl, setWebsiteUrl ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const { isGeneratingBranding } = useAIBrandingPreference();
    const generateAIBrandingPreference: GenerateAIBrandingPreferenceFunc = useGenerateAIBrandingPreference();

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
        setIsSubmitting(true);
        await generateAIBrandingPreference(websiteUrl);
        setBannerState(BannerState.COLLAPSED);
        setIsSubmitting(false);
    };

    if (isGeneratingBranding) {
        return null;
    }

    if (bannerState === BannerState.FULL) {
        return (
            <Box
                className="branding-ai-banner full"
                style={ {
                    backgroundImage: `url(${ AIBannerBackgroundWhite })`
                } }
            >
                <div className="branding-ai-banner-text-container">
                    <Typography
                        as="h3"
                        className="branding-ai-banner-heading"
                    >
                        { t("branding:ai.banner.full.heading") }
                        <span className="branding-ai-text">
                            { t("branding:ai.title") }
                        </span>
                        <Chip
                            size="small"
                            label={ t("common:beta").toUpperCase() }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
                    </Typography>
                    <Typography className="branding-ai-banner-sub-heading">
                        { t("branding:ai.banner.full.subHeading") }
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
                    { t("branding:ai.banner.full.button") }
                </Button>
            </Box>
        );
    }

    if (bannerState === BannerState.INPUT) {
        return (
            <Box
                className="branding-ai-banner-input"
                style={ {
                    backgroundImage: `url(${ AIBannerInputBackground })`
                } }
            >
                <Box className="branding-ai-banner-input-heading-container">
                    <Typography
                        as="h3"
                        className="branding-ai-banner-heading"
                    >
                        { t("branding:ai.banner.input.heading") }
                        <span className="branding-ai-text">
                            { t("branding:ai.title") }
                        </span>
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
                <div className="branding-ai-banner-text-container">
                    <Typography className="branding-ai-banner-sub-heading">
                        { t("branding:ai.banner.input.subHeading") }
                        <DocumentationLink
                            link={ getLink("develop.branding.ai.learnMore") }
                            isLinkRef={ true }>
                            <Trans i18nKey={ "extensions:common.learnMore" }>
                                Learn more
                            </Trans>
                        </DocumentationLink>
                    </Typography>
                </div>
                <TextField
                    name="loginFlowInput"
                    className="branding-ai-input-field mt-5"
                    placeholder={ t("branding:ai.banner.input.placeholder") }
                    fullWidth
                    inputProps={ {
                        maxlength: 75
                    } }
                    value={ websiteUrl }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                        setWebsiteUrl(e.target.value) }
                    onKeyDown={ (e: React.KeyboardEvent<HTMLInputElement>) => {
                        // Handle the enter key press.
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleGenerateClick();
                        }
                    } }
                    InputProps={ {
                        className: "branding-ai-input-field-inner",
                        endAdornment: (
                            !isSubmitting ? (
                                <IconButton
                                    className="branding-ai-input-button"
                                    onClick={ () => handleGenerateClick() }
                                    disabled={ !websiteUrl }
                                >
                                    <GenericIcon
                                        icon={ AIIcon }
                                        rounded
                                        transparent
                                        fill="white"
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
            </Box>
        );
    }

    if (bannerState === BannerState.COLLAPSED) {
        return (
            <Box
                className="branding-ai-banner collapsed"
                style={ {
                    backgroundImage: `url(${ AIBannerBackgroundWhite })`
                } }
            >
                <Box className="branding-ai-banner-button-container">
                    <div className="branding-ai-banner-text-container">
                        <Typography
                            as="h3"
                            className="branding-ai-banner-heading"
                        >
                            { t("branding:ai.banner.input.heading") }
                            <span className="branding-ai-text">
                                { t("branding:ai.title") }
                            </span>
                            <Chip
                                size="small"
                                label={ t("common:beta").toUpperCase() }
                                className="oxygen-chip-beta mb-1 ml-2"
                            />
                        </Typography>
                        <Typography className="branding-ai-banner-sub-heading">
                            { t("branding:ai.banner.collapsed.subHeading") }
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
                        { t("branding:ai.banner.collapsed.button") }
                    </Button>
                </Box>
            </Box>
        );
    }

    return null;
};
