/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { GenericIconProps, GenericIconSizes } from "@wso2is/react-components";
import { IdentifiableComponentInterface, TestableComponentInterface } from "modules/core/src/models";
import BiometricIcon from "modules/theme/src/themes/default/assets/images/icons/fingerprint.svg";
import MagicLinkIcon from "modules/theme/src/themes/default/assets/images/icons/magic-link-icon.svg";
import TOTPIcon from "modules/theme/src/themes/default/assets/images/icons/outline-icons/clock-outline.svg";
import EmailIcon from "modules/theme/src/themes/default/assets/images/icons/solid-icons/email-solid.svg";
import SMSIcon from "modules/theme/src/themes/default/assets/images/icons/solid-icons/sms-solid.svg";
import React, { ReactNode } from "react";
import { Card, CardProps, Label } from "semantic-ui-react";

/**
 * Proptypes for the info card component.
 */
export interface InfoCardPropsInterface extends CardProps, IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Action for the card
     */
    action?: ReactNode;
    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Side of the image.
     */
    fluidImageSize?: GenericIconSizes;
    /**
     * Is card used to display a github repo info.
     */
    githubRepoCard?: boolean;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image for the card.
     */
    image?: any;
    /**
     * Side of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Extra options for the card image.
     */
    imageOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Disable hovering effect.
     */
    noHover?: boolean;
    /**
     * If the card is selected.
     */
    selected?: boolean;
    /**
     * Card sub header.
     */
    subHeader?: string;
    /**
     * Show an attached label as a ribbon.
     */
    ribbon?: ReactNode;
    /**
     * Set of tags.
     */
    tags?: string[];
    /**
     * Text alignment.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * If the card should be inline.
     */
    inline?: boolean;
    /**
     * Show/Hide tooltips.
     */
    showTooltips?: boolean | { header:boolean; description:boolean; };
}

export type DataType = {
    title:string;
    subtitle:string;
    description:string;
    tag:string;
    image:any;

}

export const CardData : DataType[] = [
    {
        description:"Two-factor authentication using One-Time passcode sent via email.",
        image: TOTPIcon,
        subtitle:"Predefined",
        tag:"#MFA ",
        title:"TOTP"
          
    },
    {
        description:"Two-factor authentication using Time-Based One Time generated passcode.",
        image:EmailIcon,
        subtitle:"Predefined",
        tag:"#MFA ",
        title:"Email OTP"      
    },
    {
        description:"Two-factor authentication using SMS One-Time generated passcode.",
        image:SMSIcon,
        subtitle:"Predefined",
        tag:"#MFA",  
        title:"SMS OTP"
    },
    {
        description:"Provides an email that uses a magic link to log in passwordless with convienience",
        image:MagicLinkIcon,
        subtitle:"Predefined",
        tag:"#Passwordless",  
        title:"Magic Link"       
    },
    {
        description:"Provide secure and fast passwordless login experience using FIDO2.",
        image:BiometricIcon,
        subtitle:"Predefined",
        tag:"#Passwordless",   
        title:"FIDO2"
        
    }    
];

const CardSection = (): any => {
    return (
        <div className="card-grid">
            <div className="static-standard-title">
                Standard Intergrations
            </div>
            <div className="grid-container-section">
                { CardData.map(( items , i )=>{
                    return(
                        <div key={ i } className="standard-card-grid">
                            <Card className="card-container">
                                <Card.Header className="static-card-header">
                                    <div className="static-card-icon">
                                        <img src={ items.image } alt="icon"></img>
                                    </div>
                                    { items.title }
                                </Card.Header>
                                <Card.Meta className="card-static-meta">{ items.subtitle }</Card.Meta>
                                <Card.Description className="card-static-description"> 
                                    { items.description }
                                </Card.Description>
                                <Label className="card-static-label">
                                    { items.tag } 
                                </Label>
                            </Card>
                        </div>
                    );
                }) }
            </div>
            
        </div>
    );
};

export default CardSection;
