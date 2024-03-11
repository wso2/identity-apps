import React, { FunctionComponent, ReactElement, useState } from "react";
import { Button } from "@oxygen-ui/react";
import axios from 'axios';
import { ReactComponent as AIIcon } from "../../../../theme/src/themes/wso2is/assets/images/icons/solid-icons/twinkle-ai-solid.svg";
import { 
    DocumentationLink
} from "@wso2is/react-components";
import { Trans } from "react-i18next";
import { Segment, Icon, Input, Header } from "semantic-ui-react";
import { GenericIcon } from "../icon";


enum BannerState {
    Full = "banner-full",
    Input = "banner-input",
    Collapsed = "banner-collapsed",
}

interface BrandingAIComponentProps {
    // You can extend this interface to include other props as needed.
    onGenerateBrandingClick: () => void;
}

export const BrandingAIComponent: FunctionComponent<BrandingAIComponentProps> = (
    { onGenerateBrandingClick }: BrandingAIComponentProps
): ReactElement => {
    const [bannerState, setBannerState] = useState<BannerState>(BannerState.Full);
    const [websiteUrl, setWebsiteUrl] = useState<string>("https://www.demoblaze.com/");

    const handleExpandClick = () => {
        setBannerState(BannerState.Input);
    };

    const handleCollapseClick = () => {
        setBannerState(BannerState.Collapsed);
    };

    const handleGenerateClick = async () => {
        console.log("Generating branding for:", websiteUrl);
        onGenerateBrandingClick();
        try {
            const response = await axios.post('http://localhost:3000/generate', {
                website_url: websiteUrl
            }, {
                headers: {
                    'trace-id': 'custom'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Segment
            style={{ 
                background: bannerState === BannerState.Full ? 'radial-gradient(35% 100% at 0% 3.95%, rgb(255 160 0 / 27%) 0%, rgba(217, 217, 217, 0) 100%)' : 'none'
            }}
        >
            {bannerState === BannerState.Full && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '65px'
                }}>
                    <div>
                        <Header as="h3">Transform your branding with ease, try our new Branding AI</Header>
                        <p>Provide your website URL, and our AI will seamlessly create a branding theme that's both beautiful and brand-consistent.</p>
                    </div>
                    <Button onClick={handleExpandClick} color="secondary" variant="outlined">
                        <GenericIcon
                            icon={ AIIcon }
                            style={{ paddingRight: '5px' }}
                        />
                        Try Branding AI
                    </Button>
                </div>
            )}

            {bannerState === BannerState.Input && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    <Icon
                        name="dropdown"
                        onClick={handleCollapseClick}
                        style={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0 }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px' }}>
                        <div>
                            <Header as="h3" style={{ marginBottom: '5px' }}>Generate branding using Branding AI</Header>
                            <p>Provide your organization website URL to intuitively generate branding reflecting the essence of your brand.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px', justifyContent: 'space-between', paddingRight: '20px'}}>
                            <Input
                                placeholder="Enter website URL"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                style={{ width: '40%' }}
                            />
                            <Button
                                onClick={handleGenerateClick}
                                color="secondary"
                                variant="outlined"
                                style={{ marginLeft: 'auto'}}
                            >
                                <GenericIcon
                                    icon={ AIIcon }
                                    style={{ paddingRight: '5px' }}
                                />
                                Generate Branding
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {bannerState === BannerState.Collapsed && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
                    <div>
                        <Header as="h3" style={{ marginBottom: '5px' }}>Generate branding with a single click using Branding AI</Header>
                        <p>AI-powered branding recommendations that are crafted for a unified visual approach.
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
            )}
        </Segment>
    );
};

BrandingAIComponent.defaultProps = {
    // Define any default props here.
};
