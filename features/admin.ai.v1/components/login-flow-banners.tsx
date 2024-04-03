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

import React, { ReactElement, useState, useContext } from 'react';
import { ChevronUpIcon, XMarkIcon}from '@oxygen-ui/react-icons';
import { Trans, useTranslation} from 'react-i18next';
import { Header, Segment, TextArea } from 'semantic-ui-react';
import { GenericIcon, DocumentationLink } from '@wso2is/react-components';
import { ReactComponent as AIIcon } from "../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import Button from "@oxygen-ui/react/Button";
import { BannerState } from "../models/banner-state";
import AILoginFlowContext from "../context/login-flow-context";
/*
LoginFlowAIComponentProps is an interface that defines the props for the LoginFlowAIComponent.
params:
- @onGenerateBrandingClick - A callback function that is triggered when the user clicks on the generate branding button.
- @onGenerate - A callback function that is triggered when the user clicks on the generate button.
*/
interface LoginFLowBannerProps {
    onGenerateClick: (userInput:string) => void;

}
const LoginFLowBanner: React.FC<LoginFLowBannerProps> = ({onGenerateClick}): ReactElement => {

    const { t } = useTranslation();
    /**
     * Load login flow context.
     */
    const {
        bannerState,
        setBannerState
    } = useContext(AILoginFlowContext);

    //Try login flow button click event handler.
    const handleTryLoginFlowButtonClick = () => {
        setBannerState(BannerState.Input);
    };

    //Banner collapse button click event handler.
    const handleBannerCollapseButtonClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    //Delete banner button click event handler.
    const handleDeleteButtonCLick = () => {
        setBannerState(BannerState.Null);
    };

    //Generate branding button click event handler.
    const handleGenerateButtonClick = (e:any) => {
        /* 
        * Get the user input from the text area.
        * Prevent the browser from reloading the page
        */
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginFlowInput = formData.get("loginFlowInput").toString();

        onGenerateClick(loginFlowInput);

    };


    /*
    Declaring sub components for the card.
    */

    // Full Banner.
    const FullBanner = () => (

        <Segment basic 
                style={{
                    background: "linear-gradient(90deg, rgba(255,115,0,0.42) 0%, rgba(255,244,235,1) 37%)",
                    borderRadius: "8px"
                }}
        >
            <div style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                padding: "45px",
                height: "100%",
                position: "relative"
            }}>
                <div>
                    <Header as="h3">
                        {t("ai:banner.full.heading")}
                    </Header>
                    <p>
                        {t("ai:banner.full.subheading1")}<br />
                        {t("ai:banner.full.subheading2")}
                    </p>
                </div>
                <Button onClick={handleTryLoginFlowButtonClick} color="secondary" variant="outlined">
                    <GenericIcon icon={AIIcon} style={{paddingRight: "5px"}}/>
                        {t("ai:banner.full.button")}
                </Button>
            </div>
        </Segment>
    );

    // Input Banner.
    const InputBanner = () => (
        <Segment basic
            style={{
                background: "white",
                borderRadius: "8px"
            }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "25px",
                position: "relative"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <button onClick={handleBannerCollapseButtonClick} style={{  backgroundColor: "transparent",
                                                                                position: "absolute", 
                                                                                right: "0px", 
                                                                                top: "0px", 
                                                                                padding:"10px 20px",
                                                                                border: "none",
                                                                                cursor: "pointer"}}>
                        <ChevronUpIcon />
                    </button>
                    <Header as="h3">{t("ai:banner.input.heading")}</Header>

                </div>
                
                
                <div style={{
                    marginTop: "5px",
                    marginBottom: "10px",
                
                }}>   
                    <p>
                        {t("ai:banner.input.subheading")}
                        <DocumentationLink
                        link={"develop.applications.editApplication.asgardeoTryitApplication.general.learnMore"}
                        isLinkRef={true}>
                            <Trans i18nKey={"extensions:common.learnMore"}>
                                Learn more
                            </Trans>
                        </DocumentationLink>
                    </p>
                </div>
                <form onSubmit={handleGenerateButtonClick}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        position: "relative",
                        height: "100%",
                        alignItems: "center"
                    }}> 
                        <TextArea
                            name="loginFlowInput"
                            placeholder={t("ai:banner.input.placeholder")} 
                            style={{
                                width: '80%',
                                minHeight: '10px',
                                maxHeight: '50px',
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: '1px solid grey',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                padding: '10px',
                            }}
                        />
                        <Button type='submit' color="secondary" variant="outlined" style= {{height: "25%", alignItems:"center"}}>
                            <GenericIcon icon={AIIcon} style={{paddingRight: "5px"}}/>
                            {t("ai:banner.input.button")}
                        </Button>
                    </div>
                </form>
            </div>
        </Segment>
    );

    // Collapsed Banner.
    const CollapsedBanner = () => (
        <Segment basic
            style={{
                background: "white",
                borderRadius: "8px",
                height:"auto",
                padding: "10px",
            }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "0px",
                position: "relative"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <button onClick={handleDeleteButtonCLick} style={{  backgroundColor: "transparent",
                                                                        position: "absolute", 
                                                                        right: "5px", 
                                                                        top: "5px", 
                                                                        padding:"5px 10px",
                                                                        border: "none",
                                                                        cursor: "pointer"}}>
                        <XMarkIcon />
                    </button>
                    <Header as="h3">{t("ai:banner.collapsed.heading")}</Header>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    alignItems: "center",
                }}>
                    <div> 
                        <p>
                            {t("ai:banner.collapsed.subheading")}
                            <DocumentationLink
                                link={"develop.applications.editApplication.asgardeoTryitApplication.general.learnMore"}
                                isLinkRef={true}>
                                    <Trans i18nKey={"extensions:common.learnMore"}>
                                        Learn more
                                    </Trans>
                            </DocumentationLink>
                        </p>
                    </div>
                    <Button onClick={handleTryLoginFlowButtonClick} color="secondary" variant="outlined">
                        <GenericIcon icon={AIIcon} style={{paddingRight: "5px"}}/>
                        {t("ai:banner.collapsed.button")}
                    </Button>
                </div>
            </div>
        </Segment>
    );



    return (
        <>
            {bannerState === BannerState.Full && (<FullBanner />)}
            {bannerState === BannerState.Input && (<InputBanner />)}
            {bannerState === BannerState.Collapsed && (<CollapsedBanner />)}
            {bannerState === BannerState.Null && (<></>)}
        </>
    
    );
};

export default LoginFLowBanner;
