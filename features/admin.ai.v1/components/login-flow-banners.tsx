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

import { ChevronUpIcon, XMarkIcon }from "@oxygen-ui/react-icons";
import Button from "@oxygen-ui/react/Button";
import { DocumentationLink, GenericIcon } from "@wso2is/react-components";
import React, { ReactElement, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header, Segment, TextArea } from "semantic-ui-react";
import { ReactComponent as AIIcon } from "../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import AILoginFlowContext from "../context/login-flow-context";
import { BannerState } from "../models/banner-state";

/*
LoginFlowAIComponentProps is an interface that defines the props for the LoginFlowAIComponent.
params:
- @onGenerateBrandingClick - A callback function that is triggered when the user clicks on the generate branding button.
- @onGenerate - A callback function that is triggered when the user clicks on the generate button.
*/
interface LoginFLowBannerProps {
    onGenerateClick: (userInput:string) => void;

}
const LoginFLowBanner: React.FC<LoginFLowBannerProps> = ( onGenerateClick:any): ReactElement => {

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
        const formData:FormData = new FormData(e.target);
        const loginFlowInput: string = formData.get("loginFlowInput").toString();

        onGenerateClick(loginFlowInput);

    };


    /*
    Declaring sub components for the card.
    */

    // Full Banner.
    const FullBanner = () => (

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
                    height: "100%",
                    justifyContent: "space-between",
                    padding: "45px",
                    position: "relative"
                } }>
                <div>
                    <Header as="h3">
                        { t("ai:banner.full.heading") }
                    </Header>
                    <p>
                        { t("ai:banner.full.subheading1") }<br />
                        { t("ai:banner.full.subheading2") }
                    </p>
                </div>
                <Button onClick={ handleTryLoginFlowButtonClick } color="secondary" variant="outlined">
                    <GenericIcon icon={ AIIcon } style={ { paddingRight: "5px" } }/>
                    { t("ai:banner.full.button") }
                </Button>
            </div>
        </Segment>
    );

    // Input Banner.
    const InputBanner = () => (
        <Segment
            basic
            style={ {
                background: "white",
                borderRadius: "8px"
            } }
        >
            <div
                style={ {
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "25px",
                    position: "relative"
                } }>
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between"
                    } }>
                    <button
                        onClick={ handleBannerCollapseButtonClick }
                        style={ {  backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding:"10px 20px",
                            position: "absolute",
                            right: "0px",
                            top: "0px" } }>
                        <ChevronUpIcon />
                    </button>
                    <Header as="h3">{ t("ai:banner.input.heading") }</Header>

                </div>


                <div
                    style={ {
                        marginBottom: "10px",
                        marginTop: "5px"

                    } }>
                    <p>
                        { t("ai:banner.input.subheading") }
                        <DocumentationLink
                            link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
                            isLinkRef={ true }>
                            <Trans i18nKey={ "extensions:common.learnMore" }>
                                Learn more
                            </Trans>
                        </DocumentationLink>
                    </p>
                </div>
                <form onSubmit={ handleGenerateButtonClick }>
                    <div
                        style={ {
                            alignItems: "center",
                            display: "flex",
                            height: "100%",
                            justifyContent: "space-between",
                            position: "relative"
                        } }>
                        <TextArea
                            name="loginFlowInput"
                            placeholder={ t("ai:banner.input.placeholder") }
                            style={ {
                                border: "1px solid grey",
                                boxSizing: "border-box",
                                maxHeight: "50px",
                                minHeight: "10px",
                                overflowX: "hidden",
                                overflowY: "auto",
                                padding: "10px",
                                resize: "vertical",
                                width: "80%"
                            } }
                        />
                        <Button
                            type="submit"
                            color="secondary"
                            variant="outlined"
                            style= { { alignItems:"center", height: "25%" } }>
                            <GenericIcon icon={ AIIcon } style={ { paddingRight: "5px" } }/>
                            { t("ai:banner.input.button") }
                        </Button>
                    </div>
                </form>
            </div>
        </Segment>
    );

    // Collapsed Banner.
    const CollapsedBanner = () => (
        <Segment
            basic
            style={ {
                background: "white",
                borderRadius: "8px",
                height:"auto",
                padding: "10px"
            } }
        >
            <div
                style={ {
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px",
                    position: "relative"
                } }>
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between"
                    } }>
                    <button
                        onClick={ handleDeleteButtonCLick }
                        style={ {  backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding:"5px 10px",
                            position: "absolute",
                            right: "5px",
                            top: "5px" } }>
                        <XMarkIcon />
                    </button>
                    <Header as="h3">{ t("ai:banner.collapsed.heading") }</Header>
                </div>
                <div
                    style={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        position: "relative"
                    } }>
                    <div>
                        <p>
                            { t("ai:banner.collapsed.subheading") }
                            <DocumentationLink
                                link={
                                    "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore"
                                }
                                isLinkRef={ true }>
                                <Trans i18nKey={ "extensions:common.learnMore" }>
                                        Learn more
                                </Trans>
                            </DocumentationLink>
                        </p>
                    </div>
                    <Button onClick={ handleTryLoginFlowButtonClick } color="secondary" variant="outlined">
                        <GenericIcon icon={ AIIcon } style={ { paddingRight: "5px" } }/>
                        { t("ai:banner.collapsed.button") }
                    </Button>
                </div>
            </div>
        </Segment>
    );



    return (
        <>
            { bannerState === BannerState.Full && (<FullBanner />) }
            { bannerState === BannerState.Input && (<InputBanner />) }
            { bannerState === BannerState.Collapsed && (<CollapsedBanner />) }
            { bannerState === BannerState.Null && (<></>) }
        </>

    );
};

export default LoginFLowBanner;
