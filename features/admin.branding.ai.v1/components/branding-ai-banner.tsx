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

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Collapse } from "@mui/material";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import AIBanner from "@wso2is/common.ai.v1/components/ai-banner";
import AIBannerTall from "@wso2is/common.ai.v1/components/ai-banner-tall";
import {
    DocumentationLink,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import FeatureStatusLabel from "../../admin.extensions.v1/components/feature-gate/models/feature-gate";
import useAIBrandingPreference from "../hooks/use-ai-branding-preference";
import useGenerateAIBrandingPreference, { GenerateAIBrandingPreferenceFunc }
    from "../hooks/use-generate-ai-branding-preference";
import { BannerState } from "../models/types";
import "./branding-ai-banner.scss";

interface BrandingAIBannerProps {
    readonly?: boolean;
}

/**
 * Branding AI banner component.
 */
const BrandingAIBanner: FunctionComponent<PropsWithChildren<BrandingAIBannerProps>> = (
    props: PropsWithChildren<BrandingAIBannerProps>): ReactElement => {

    const { readonly } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const {
        bannerState,
        isGeneratingBranding,
        setBannerState,
        setWebsiteUrl,
        websiteUrl
    } = useAIBrandingPreference();

    const generateAIBrandingPreference: GenerateAIBrandingPreferenceFunc = useGenerateAIBrandingPreference();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

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
        setIsSubmitting(true);
        await generateAIBrandingPreference(websiteUrl);
        setBannerState(BannerState.INPUT);
        setIsSubmitting(false);
    };

    if (isGeneratingBranding) {
        return null;
    }

    return (
        <>
            <Collapse in={ bannerState === BannerState.FULL }>
                <AIBanner
                    title={ t("branding:ai.banner.full.heading") }
                    description={ t("branding:ai.banner.full.subHeading") }
                    aiText={ t("branding:ai.title") }
                    actionButtonText={ t("branding:ai.banner.full.button") }
                    onActionButtonClick={ handleExpandClick }
                    titleLabel={ (
                        <Chip
                            size="small"
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
                    ) }
                    readonly={ readonly }
                />
            </Collapse>
            <Collapse in={ bannerState === BannerState.INPUT || bannerState === BannerState.COLLAPSED }>
                <AIBannerTall
                    title={ t("branding:ai.banner.input.heading") }
                    description={ (
                        <>
                            { t("branding:ai.banner.input.subHeading") }
                            <DocumentationLink
                                link={ getLink("develop.branding.ai.learnMore") }
                            >
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                    Learn more
                                </Trans>
                            </DocumentationLink>
                        </>
                    ) }
                    aiText={ t("branding:ai.title") }
                    titleLabel={ (
                        <Chip
                            size="small"
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-chip-beta mb-1 ml-2"
                        />
                    ) }
                >
                    <TextField
                        name="brandingAIInput"
                        className="branding-ai-input-field mt-5"
                        data-componentid="branding-ai-input-field"
                        placeholder={ t("branding:ai.banner.input.placeholder") }
                        fullWidth
                        inputProps={ {
                            maxlength: 2048
                        } }
                        value={ websiteUrl }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                            setWebsiteUrl(e?.target?.value) }
                        onKeyDown={ (e: React.KeyboardEvent<HTMLInputElement>) => {
                            // Handle the enter key press.
                            if (e?.key === "Enter") {
                                e?.preventDefault();
                                handleGenerateClick();
                            }
                        } }
                        InputProps={ {
                            className: "branding-ai-input-field-inner",
                            endAdornment: (
                                !isSubmitting ? (
                                    <IconButton
                                        onClick={ () => handleGenerateClick() }
                                        disabled={ !websiteUrl.trim() }
                                    >
                                        <SendOutlinedIcon
                                            className={ `branding-ai-input-button-icon
                                                ${ !websiteUrl.trim() && "disabled" }` }
                                        />
                                    </IconButton>
                                ) : (
                                    <Box className="branding-ai-input-loader">
                                        <CircularProgress color="primary" size={ 25 } />
                                    </Box>
                                )
                            )
                        } }
                    />
                    <Box className="branding-ai-disclaimer">
                        <Typography variant="caption">
                            { t("branding:ai.disclaimer") }
                            <DocumentationLink
                                link={ getLink("common.termsOfService") }
                            >
                                { t("branding:ai.termsAndConditions") }
                            </DocumentationLink>
                        </Typography>
                    </Box>
                </AIBannerTall>
            </Collapse>
        </>
    );
};

BrandingAIBanner.defaultProps = {
    readonly: false
};

export default BrandingAIBanner;
