import React, { FunctionComponent, ReactElement, useState } from "react";
import Button from "@oxygen-ui/react/Button";
import axios from 'axios';
import { ReactComponent as AIIcon } from "../../../themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import { 
    DocumentationLink
} from "@wso2is/react-components";
import { Trans } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Segment, Icon, Input, Header } from "semantic-ui-react";
import { GenericIcon } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";


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
    const [bannerState, setBannerState] = useState<BannerState>(BannerState.Full);
    // const [websiteUrl, setWebsiteUrl] = useState<string>("https://www.demoblaze.com/");
    const [websiteUrl, setWebsiteUrl] = useState<string>("");


    const handleExpandClick = () => {
        setBannerState(BannerState.Input);
    };

    const handleCollapseClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    const handleGenerateClick = async () => {
        console.log("Generating branding for:", websiteUrl);
        const traceId = uuidv4();
        onGenerateBrandingClick(traceId);
        try {
            const response = await axios.post('http://0.0.0.0:8080/branding/generate', {
            // const response = await axios.post('http://localhost:3000/generate', {
                website_url: websiteUrl
            }, {
                headers: {
                    'trace-id': traceId
                }
            });
            onGenerate(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            {bannerState === BannerState.Full && (
                <Segment
                    basic
                    style={{ 
                        background: 'linear-gradient(90deg, rgba(255,115,0,0.42) 0%, rgba(255,244,235,1) 37%)',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '45px'
                    }}>
                        <div>
                            <Header as="h3">{ t("console:branding.ai.banner.full.heading") }</Header>
                            <p>{ t("console:branding.ai.banner.full.subHeading") }</p>
                        </div>
                        <Button onClick={handleExpandClick} color="secondary" variant="outlined">
                            <GenericIcon
                                icon={ AIIcon }
                                style={{ paddingRight: '5px' }}
                            />
                            Try Branding AI
                        </Button>
                    </div>

                </Segment>
            )}
            {bannerState === BannerState.Input && (
                <Segment>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                        <Icon
                            name="dropdown"
                            onClick={handleCollapseClick}
                            style={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0 }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px' }}>
                            <div>
                                <Header as="h3" style={{ marginBottom: '5px' }}>
                                    { t("console:branding.ai.banner.input.heading") }
                                </Header>
                                <p>{ t("console:branding.ai.banner.input.subHeading") }
                                <DocumentationLink 
                                    link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
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
                            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px', justifyContent: 'space-between', paddingRight: '20px'}}>
                                <Input
                                    placeholder={ t("console:branding.ai.banner.input.placeholder") }
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    style={{ width: '40%' }}
                                />
                                <Button
                                    onClick={handleGenerateClick}
                                    color="secondary"
                                    variant="outlined"
                                    style={{ marginLeft: "auto"}}
                                >
                                    <GenericIcon
                                        icon={ AIIcon }
                                        style={{ paddingRight: "5px" }}
                                    />
                                    Generate Branding
                                </Button>
                            </div>
                        </div>
                    </div>
                </Segment>
            )}
            {bannerState === BannerState.Collapsed && (
                <Segment>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
                    <div>
                        <Header as="h3" style={{ marginBottom: '5px' }}>{ t("console:branding.ai.banner.input.heading") }</Header>
                        <p>{ t("console:branding.ai.banner.collapsed.subHeading") }
                        <DocumentationLink 
                            link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
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
                    <Button onClick={() => setBannerState(BannerState.Input)} color="secondary" variant="outlined">
                    <GenericIcon
                        icon={ AIIcon }
                        style={{ paddingRight: '5px' }}
                    />
                    Try Branding AI
                    </Button>
                </div>
                </Segment>
            )}
        </>
)};

BrandingAIComponent.defaultProps = {
    
};
