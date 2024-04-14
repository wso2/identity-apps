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

import Button from "@oxygen-ui/react/Button";
import {
    DocumentationLink,
    GenericIcon
} from "@wso2is/react-components";
import axios from "axios";
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import useGenerateAIBrandingPreference,
{ GenerateAIBrandingPreferenceFunc } from "features/admin.ai.v1/hooks/use-generate-ai-branding-preference";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import classNames from "classnames";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

import { v4 as uuidv4 } from "uuid";
import { ReactComponent as AIIcon }
    from "../../../modules/theme/src/themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import "./branding-card.scss";

enum BannerState {
    Full = "banner-full",
    Input = "banner-input",
    Collapsed = "banner-collapsed",
}
interface BrandingAIBannerProps {
    onGenerateBrandingClick: (traceId: string, operationId: string) => void;
    onGenerate: (response: any) => void;
}

export const BrandingAIBanner: FunctionComponent<BrandingAIBannerProps> = (
    { onGenerateBrandingClick, onGenerate }: BrandingAIBannerProps
): ReactElement => {

    const { t } = useTranslation();
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.Full);
    const [ websiteUrl, setWebsiteUrl ] = useState<string>("https://console.choreo.dev/login");

    const { handleGenerate,
        isGeneratingBranding,
        mergedBrandingPreference,
        setGeneratingBranding,
        operationId,
        setOperationId } = useAIBrandingPreference();

    const generateAIBrandingPreference: GenerateAIBrandingPreferenceFunc = useGenerateAIBrandingPreference();

    const handleExpandClick = () => {
        setBannerState(BannerState.Input);
    };

    const handleCollapseClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    const handleGenerateClick = async () => {
        const traceId: string = uuidv4();
        // setGeneratingBranding(true);

        try {
            // const response: any = await
            // axios.post("http://0.0.0.0:8080/t/cryd1/api/server/v1/branding-preference/generate", {
            // // const response: any = await axios.post("http://localhost:3000/generate", {

            //     website_url: websiteUrl
            // }, {
            //     headers: {
            //         "trace-id": traceId
            //     }
            // });

            // const operationId: string = response.data.operation_id;
            // setOperationId(operationId);
            await generateAIBrandingPreference(websiteUrl, "carbon.super");
            onGenerateBrandingClick(traceId, operationId);
        } catch (error) {
            // console.error("Error:", error);
        }
    };

    return (
        <>
            { bannerState === BannerState.Full && (
                <Segment
                    basic
                    className={
                        classNames(
                            "branding-card",
                            {
                                hidden: isGeneratingBranding
                            },
                            "branding-card-banner-full"
                        )
                    }
                >
                    <div className="branding-card-banner-full-heading">
                        <div>
                            <Header as="h3">{ t("branding:ai.banner.full.heading") }</Header>
                            <p>{ t("branding:ai.banner.full.subHeading") }</p>
                        </div>
                        <Button onClick={ handleExpandClick } color="secondary" variant="outlined">
                            <GenericIcon
                                icon={ AIIcon }
                                className="branding-card-banner-full-button"
                            />
                            { t("branding:ai.banner.full.button") }
                        </Button>
                    </div>
                </Segment>
            ) }
            { bannerState === BannerState.Input && (
                <Segment
                    className={
                        classNames(
                            "branding-card",
                            {
                                hidden: isGeneratingBranding
                            }
                        )
                    }
                >
                    <div className="branding-card-banner-input">
                        <Icon
                            name="dropdown"
                            onClick={ handleCollapseClick }
                            className="branding-card-banner-input-icon"
                        />

                        <div className="branding-card-banner-input-content">
                            <div>
                                <Header as="h3" className="branding-card-banner-input-heading">
                                    { t("branding:ai.banner.input.heading") }
                                </Header>
                                <p>{ t("branding:ai.banner.input.subHeading") }
                                    <DocumentationLink
                                        link={ "develop.applications.editApplication.asgardeoTryitApplication" +
                                    ".general.learnMore" }
                                        isLinkRef = { true }
                                    >
                                        <Trans
                                            i18nKey={ "extensions:common.learnMore" }
                                        >
                                            Learn More
                                        </Trans>
                                    </DocumentationLink>
                                </p>
                            </div>
                            <div className="branding-card-banner-input-actions">
                                <Input
                                    className="branding-input-field"
                                    placeholder={ t("branding:ai.banner.input.placeholder") }
                                    value={ websiteUrl }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                        setWebsiteUrl(e.target.value) }
                                />
                                <Button
                                    onClick={ handleGenerateClick }
                                    color="secondary"
                                    variant="outlined"
                                    style={ { marginLeft: "auto" } }
                                >
                                    <GenericIcon
                                        className="branding-card-banner-input-button"
                                        icon={ AIIcon }
                                    />
                                    { t("branding:ai.banner.input.button") }
                                </Button>
                            </div>
                        </div>
                    </div>
                </Segment>
            ) }
            { bannerState === BannerState.Collapsed && (
                <Segment
                    className={
                        classNames(
                            "branding-card",
                            {
                                hidden: isGeneratingBranding
                            }
                        )
                    }
                >
                    <div className="branding-card-banner-collapsed">
                        <div>
                            <Header as="h3" className="branding-card-banner-collapsed-heading">
                                { t("branding:ai.banner.input.heading") }</Header>
                            <p>{ t("branding:ai.banner.collapsed.subHeading") }
                                <DocumentationLink
                                    link={ "develop.applications.editApplication.asgardeoTryitApplication" +
                                    ".general.learnMore" }
                                    isLinkRef = { true }
                                >
                                    <Trans
                                        i18nKey={ "extensions:common.learnMore" }
                                    >
                                        Learn More
                                    </Trans>
                                </DocumentationLink>
                            </p>
                        </div>
                        <Button
                            onClick={ () => setBannerState(BannerState.Input) }
                            color="secondary"
                            variant="outlined"
                        >
                            <GenericIcon
                                className="branding-card-banner-collapsed-button"
                                icon={ AIIcon }
                            />
                            { t("branding:ai.banner.collapsed.button") }
                        </Button>
                    </div>
                </Segment>
            ) }
        </>
    );};

BrandingAIBanner.defaultProps = {

};
