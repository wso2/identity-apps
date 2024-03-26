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
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header, Icon, Input, Segment } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as AIIcon } from "../../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import AIContextProvider from "../providers/ai-context-provider";

enum BannerState {
    Full = "banner-full",
    Input = "banner-input",
    Collapsed = "banner-collapsed",
}
interface BrandingAIComponentProps {
    onGenerateBrandingClick: (traceId: string) => void;
    onGenerate: (response: any) => void;
}

export const BrandingAIComponent: FunctionComponent<BrandingAIComponentProps> = (
    { onGenerateBrandingClick, onGenerate }: BrandingAIComponentProps
): ReactElement => {

    const { t } = useTranslation();
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.Full);
    const [ websiteUrl, setWebsiteUrl ] = useState<string>("");

    const handleExpandClick = () => {
        setBannerState(BannerState.Input);
    };

    const handleCollapseClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    const handleGenerateClick = async () => {
        const traceId: string = uuidv4();

        onGenerateBrandingClick(traceId);

        try {
            const response: any = await axios.post("http://localhost:3000/generate", {
                website_url: websiteUrl
            }, {
                headers: {
                    "trace-id": traceId
                }
            });

            onGenerate(response.data);
        } catch (error) {
            // console.error("Error:", error);
        }
    };

    return (
        <AIContextProvider>
            <>
                { bannerState === BannerState.Full && (
                    <Segment
                        basic
                        style={ {
                            background: "linear-gradient(90deg, rgba(255,115,0,0.42) 0%, rgba(255,244,235,1) 37%)",
                            borderRadius: "8px"
                        } }
                    >
                        <div
                            style={ {
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "45px"
                            } }>
                            <div>
                                <Header as="h3">{ t("console:branding.ai.banner.full.heading") }</Header>
                                <p>{ t("console:branding.ai.banner.full.subHeading") }</p>
                            </div>
                            <Button onClick={ handleExpandClick } color="secondary" variant="outlined">
                                <GenericIcon
                                    icon={ AIIcon }
                                    style={ { paddingRight: "5px" } }
                                />
                                { t("console:branding.ai.banner.full.button") }
                            </Button>
                        </div>
                    </Segment>
                ) }
                { bannerState === BannerState.Input && (
                    <Segment>
                        <div
                            style={ {
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                position: "relative"
                            } }>
                            <Icon
                                name="dropdown"
                                onClick={ handleCollapseClick }
                                style={ { cursor: "pointer", position: "absolute", right: 0, top: 0 } }
                            />

                            <div
                                style={ {
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    padding: "10px"
                                } }>
                                <div>
                                    <Header as="h3" style={ { marginBottom: "5px" } }>
                                        { t("console:branding.ai.banner.input.heading") }
                                    </Header>
                                    <p>{ t("console:branding.ai.banner.input.subHeading") }
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
                                <div
                                    style={ {
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingRight: "20px",
                                        paddingTop: "20px"
                                    } }>
                                    <Input
                                        placeholder={ t("console:branding.ai.banner.input.placeholder") }
                                        value={ websiteUrl }
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setWebsiteUrl(e.target.value) }
                                        style={ { width: "40%" } }
                                    />
                                    <Button
                                        onClick={ handleGenerateClick }
                                        color="secondary"
                                        variant="outlined"
                                        style={ { marginLeft: "auto" } }
                                    >
                                        <GenericIcon
                                            icon={ AIIcon }
                                            style={ { paddingRight: "5px" } }
                                        />
                                        { t("console:branding.ai.banner.input.button") }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Segment>
                ) }
                { bannerState === BannerState.Collapsed && (
                    <Segment>
                        <div
                            style={ {
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px"
                            } }>
                            <div>
                                <Header as="h3" style={ { marginBottom: "5px" } }>
                                    { t("console:branding.ai.banner.input.heading") }</Header>
                                <p>{ t("console:branding.ai.banner.collapsed.subHeading") }
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
                                    icon={ AIIcon }
                                    style={ { paddingRight: "5px" } }
                                />
                                { t("console:branding.ai.banner.collapsed.button") }
                            </Button>
                        </div>
                    </Segment>
                ) }
            </>
        </AIContextProvider>
    );};

BrandingAIComponent.defaultProps = {

};
