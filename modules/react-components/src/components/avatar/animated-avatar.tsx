/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Image, ImageProps } from "semantic-ui-react";

/**
 * Prop types of the component
 */
export interface AnimatedAvatarPropsInterface extends ImageProps, IdentifiableComponentInterface {
    /**
     * Sets if the avatar is of primary color or not
     */
    primary?: boolean;
    /**
     * Name to be passed in.
     */
    name?: string;
}

/**
 * Animated avatar component.
 * This is a mosaic of 6x6 squares with random opacity values between `0.8` and `1`.
 *
 * @param {AnimatedAvatarPropsInterface} props - Props injected in to the component.
 * @return {React.ReactElement}
 */
export const AnimatedAvatar: FunctionComponent<AnimatedAvatarPropsInterface> = (
    props: AnimatedAvatarPropsInterface
): ReactElement => {

    const {
        name,
        primary,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;
    
    const AnimatedSVGBackground = () => (
        <svg
            className="claims-avatar-background"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
            data-componentid={ componentId }
        >
            <g>
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M0.08504+0L170.638+0C170.732+0+170.808+0.0760688+170.808+0.169904L170.808+170.723C170" +
                        ".808+170.817+170.732+170.893+170.638+170.893L0.08504+170.893C-0.00879569+170.893-0." +
                        "0848645+170.817-0.0848645+170.723L-0.0848645+0.169904C-0.0848645+0.0760688-" +
                        "0.00879569+0+0.08504+0Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M170.978+0L341.532+0C341.625+0+341.701+0.0760688+341.701+0.169904L341.701+170.723C341." +
                        "701+170.817+341.625+170.893+341.532+170.893L170.978+170.893C170.884+170.893+170.808+" +
                        "170.817+170.808+170.723L170.808+0.169904C170.808+0.0760688+170.884+0+170.978+0Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M341.277+0L511.83+0C511.924+0+512+0.0760688+512+0.169904L512+170.723C512+170.817+511.924+170" +
                        ".893+511.83+170.893L341.277+170.893C341.183+170.893+341.107+170.817+341.107+170.723L341." +
                        "107+0.169904C341.107+0.0760688+341.183+0+341.277+0Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M512.17+0L682.723+0C682.817+0+682.893+0.0760688+682.893+0.169904L682.893+170.723C682.893" +
                        "+170.817+682.817+170.893+682.723+170.893L512.17+170.893C512.076+170.893+512+170.817+" +
                        "512+170.723L512+0.169904C512+0.0760688+512.076+0+512.17+0Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M683.063+0L853.616+0C853.71+0+853.786+0.0760688+853.786+0.169904L853.786+170.723C853.786+" +
                        "170.817+853.71+170.893+853.616+170.893L683.063+170.893C682.969+170.893+682.893+170.817+" +
                        "682.893+170.723L682.893+0.169904C682.893+0.0760688+682.969+0+683.063+0Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M853.956+0L1024.51+0C1024.6+0+1024.68+0.0760688+1024.68+0.169904L1024.68+170.723C1024.68+" +
                        "170.817+1024.6+170.893+1024.51+170.893L853.956+170.893C853.862+170.893+853.786+170.817+853." +
                        "786+170.723L853.786+0.169904C853.786+0.0760688+853.862+0+853.956+0Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M0.169904+170.893L170.723+170.893C170.817+170.893+170.893+170.969+170.893+171.063L170.893+" +
                        "341.616C170.893+341.71+170.817+341.786+170.723+341.786L0.169904+341.786C0.0760688+341." +
                        "786+0+341.71+0+341.616L0+171.063C0+170.969+0.0760688+170.893+0.169904+170.893Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M171.063+170.893L341.616+170.893C341.71+170.893+341.786+170.969+341.786+171.063L341.786+341." +
                        "616C341.786+341.71+341.71+341.786+341.616+341.786L171.063+341.786C170.969+341.786+170.893+" +
                        "341.71+170.893+341.616L170.893+171.063C170.893+170.969+170.969+170.893+171.063+170.893Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M341.362+170.893L511.915+170.893C512.009+170.893+512.085+170.969+512.085+171.063L512.085" +
                        "+341.616C512.085+341.71+512.009+341.786+511.915+341.786L341.362+341.786C341.268+341." +
                        "786+341.192+341.71+341.192+341.616L341.192+171.063C341.192+170.969+341.268+170." +
                        "893+341.362+170.893Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M512.255+170.893L682.808+170.893C682.902+170.893+682.978+170.969+682.978+171.063L682." +
                        "978+341.616C682.978+341.71+682.902+341.786+682.808+341.786L512.255+341.786C512.161+341." +
                        "786+512.085+341.71+512.085+341.616L512.085+171.063C512.085+170.969+512.161+170." +
                        "893+512.255+170.893Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M683.148+170.893L853.701+170.893C853.795+170.893+853.871+170.969+853.871+171.063L853." +
                        "871+341.616C853.871+341.71+853.795+341.786+853.701+341.786L683.148+341.786C683.054+341." +
                        "786+682.978+341.71+682.978+341.616L682.978+171.063C682.978+170.969+683.054+170." +
                        "893+683.148+170.893Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M854.041+170.893L1024.59+170.893C1024.69+170.893+1024.76+170.969+1024.76+171.063L1024" +
                        ".76+341.616C1024.76+341.71+1024.69+341.786+1024.59+341.786L854.041+341.786C853.947+341." +
                        "786+853.871+341.71+853.871+341.616L853.871+171.063C853.871+170.969+853.947+170." +
                        "893+854.041+170.893Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M-0.594375+341.786L169.959+341.786C170.053+341.786+170.129+341.862+170.129+341.956L170." +
                        "129+512.51C170.129+512.603+170.053+512.679+169.959+512.679L-0.594375+512.679C-0." +
                        "688211+512.679-0.76428+512.603-0.76428+512.51L-0.76428+341.956C-0.76428+341.862-0." +
                        "688211+341.786-0.594375+341.786Z"
                    } 
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round"
                />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M170.299+341.786L340.852+341.786C340.946+341.786+341.022+341.862+341.022+341.956L341." +
                        "022+512.51C341.022+512.603+340.946+512.679+340.852+512.679L170.299+512.679C170.205+512." +
                        "679+170.129+512.603+170.129+512.51L170.129+341.956C170.129+341.862+170.205+341." +
                        "786+170.299+341.786Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M340.597+341.786L511.151+341.786C511.245+341.786+511.321+341.862+511.321+341.956L511." +
                        "321+512.51C511.321+512.603+511.245+512.679+511.151+512.679L340.597+512.679C340.504+512." +
                        "679+340.427+512.603+340.427+512.51L340.427+341.956C340.427+341.862+340.504+341.786+340." +
                        "597+341.786Z"
                    }
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M511.49+341.786L682.044+341.786C682.138+341.786+682.214+341.862+682.214+341.956L682.214+" +
                        "512.51C682.214+512.603+682.138+512.679+682.044+512.679L511.49+512.679C511.397+512.679+" +
                        "511.321+512.603+511.321+512.51L511.321+341.956C511.321+341.862+511.397+341.786+" +
                        "511.49+341.786Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M682.384+341.786L852.937+341.786C853.031+341.786+853.107+341.862+853.107+341.956L853." +
                        "107+512.51C853.107+512.603+853.031+512.679+852.937+512.679L682.384+512.679C682.29+" +
                        "512.679+682.214+512.603+682.214+512.51L682.214+341.956C682.214+341.862+682.29+341." +
                        "786+682.384+341.786Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M853.277+341.786L1023.83+341.786C1023.92+341.786+1024+341.862+1024+341.956L1024+512." +
                        "51C1024+512.603+1023.92+512.679+1023.83+512.679L853.277+512.679C853.183+512.679+853." +
                        "107+512.603+853.107+512.51L853.107+341.956C853.107+341.862+853.183+341.786+853.277+341.786Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M-0.891651+512.679L169.662+512.679C169.756+512.679+169.832+512.755+169.832+512." +
                        "849L169.832+683.403C169.832+683.496+169.756+683.573+169.662+683.573L-0.891651+683." +
                        "573C-0.985486+683.573-1.06155+683.496-1.06155+683.403L-1.06155+512.849C-1.06155+512." +
                        "755-0.985486+512.679-0.891651+512.679Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M170.001+512.679L340.555+512.679C340.649+512.679+340.725+512.755+340.725+512.849L340." +
                        "725+683.403C340.725+683.496+340.649+683.573+340.555+683.573L170.001+683.573C169." +
                        "908+683.573+169.832+683.496+169.832+683.403L169.832+512.849C169.832+512.755+169." +
                        "908+512.679+170.001+512.679Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M340.3+512.679L510.853+512.679C510.947+512.679+511.023+512.755+511.023+512.849L511." +
                        "023+683.403C511.023+683.496+510.947+683.573+510.853+683.573L340.3+683.573C340.206+683." +
                        "573+340.13+683.496+340.13+683.403L340.13+512.849C340.13+512.755+340.206+512.679+340." +
                        "3+512.679Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M511.193+512.679L681.747+512.679C681.84+512.679+681.916+512.755+681.916+512.849L681." +
                        "916+683.403C681.916+683.496+681.84+683.573+681.747+683.573L511.193+683.573C511." +
                        "099+683.573+511.023+683.496+511.023+683.403L511.023+512.849C511.023+512.755+511." +
                        "099+512.679+511.193+512.679Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M682.086+512.679L852.64+512.679C852.734+512.679+852.81+512.755+852.81+512.849L852." +
                        "81+683.403C852.81+683.496+852.734+683.573+852.64+683.573L682.086+683.573C681.993+683." +
                        "573+681.916+683.496+681.916+683.403L681.916+512.849C681.916+512.755+681.993+512." +
                        "679+682.086+512.679Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M852.979+512.679L1023.53+512.679C1023.63+512.679+1023.7+512.755+1023.7+512." +
                        "849L1023.7+683.403C1023.7+683.496+1023.63+683.573+1023.53+683.573L852.979+683." +
                        "573C852.886+683.573+852.81+683.496+852.81+683.403L852.81+512.849C852.81+512.755+852." +
                        "886+512.679+852.979+512.679Z"
                    }
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M-0.127371+683.573L170.426+683.573C170.52+683.573+170.596+683.649+170.596+683.7" +
                        "42L170.596+854.296C170.596+854.39+170.52+854.466+170.426+854.466L-0.127371+854." +
                        "466C-0.221207+854.466-0.297275+854.39-0.297275+854.296L-0.297275+683.742C-0.297275+" +
                        "683.649-0.221207+683.573-0.127371+683.573Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M170.766+683.573L341.319+683.573C341.413+683.573+341.489+683.649+341.489+683.742L341." +
                        "489+854.296C341.489+854.39+341.413+854.466+341.319+854.466L170.766+854.466C170.672+" +
                        "854.466+170.596+854.39+170.596+854.296L170.596+683.742C170.596+683.649+170." +
                        "672+683.573+170.766+683.573Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M341.064+683.573L511.618+683.573C511.712+683.573+511.788+683.649+511.788+683.742L511." +
                        "788+854.296C511.788+854.39+511.712+854.466+511.618+854.466L341.064+854.466C340.971+854." +
                        "466+340.894+854.39+340.894+854.296L340.894+683.742C340.894+683.649+340.971+683." +
                        "573+341.064+683.573Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M511.957+683.573L682.511+683.573C682.605+683.573+682.681+683.649+682.681+683.742L682." +
                        "681+854.296C682.681+854.39+682.605+854.466+682.511+854.466L511.957+854.466C511." +
                        "864+854.466+511.788+854.39+511.788+854.296L511.788+683.742C511.788+683.649+511." +
                        "864+683.573+511.957+683.573Z"
                    }
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M682.851+683.573L853.404+683.573C853.498+683.573+853.574+683.649+853.574+683.742L853." +
                        "574+854.296C853.574+854.39+853.498+854.466+853.404+854.466L682.851+854.466C682.757+854." +
                        "466+682.681+854.39+682.681+854.296L682.681+683.742C682.681+683.649+682.757+683.573+" +
                        "682.851+683.573Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M853.744+683.573L1024.3+683.573C1024.39+683.573+1024.47+683.649+1024.47+683.742L1024." +
                        "47+854.296C1024.47+854.39+1024.39+854.466+1024.3+854.466L853.744+854.466C853.65+854." +
                        "466+853.574+854.39+853.574+854.296L853.574+683.742C853.574+683.649+853.65+683." +
                        "573+853.744+683.573Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M0.169904+853.107L170.723+853.107C170.817+853.107+170.893+853.183+170.893+853.277L170." +
                        "893+1023.83C170.893+1023.92+170.817+1024+170.723+1024L0.169904+1024C0.0760688+1024" +
                        "+0+1023.92+0+1023.83L0+853.277C0+853.183+0.0760688+853.107+0.169904+853.107Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M171.063+853.107L341.616+853.107C341.71+853.107+341.786+853.183+341.786+853.277L341." +
                        "786+1023.83C341.786+1023.92+341.71+1024+341.616+1024L171.063+1024C170.969+1024+170." +
                        "893+1023.92+170.893+1023.83L170.893+853.277C170.893+853.183+170.969+853.107+171." +
                        "063+853.107Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M341.362+853.107L511.915+853.107C512.009+853.107+512.085+853.183+512.085+853.277L512." +
                        "085+1023.83C512.085+1023.92+512.009+1024+511.915+1024L341.362+1024C341.268+1024+" +
                        "341.192+1023.92+341.192+1023.83L341.192+853.277C341.192+853.183+341.268+853." +
                        "107+341.362+853.107Z"
                    } 
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M512.255+853.107L682.808+853.107C682.902+853.107+682.978+853.183+682.978+853.277" +
                        "L682.978+1023.83C682.978+1023.92+682.902+1024+682.808+1024L512.255+1024C512.161" +
                        "+1024+512.085+1023.92+512.085+1023.83L512.085+853.277C512.085+853.183+512.161" +
                        "+853.107+512.255+853.107Z"
                    }
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M683.148+853.107L853.701+853.107C853.795+853.107+853.871+853.183+853.871+853." +
                        "277L853.871+1023.83C853.871+1023.92+853.795+1024+853.701+1024L683.148+1024C683." +
                        "054+1024+682.978+1023.92+682.978+1023.83L682.978+853.277C682.978+853.183+683." +
                        "054+853.107+683.148+853.107Z"
                    }
                    strokeLinecap="round" 
                    opacity={ (Math.random() * 0.2) + 0.8 } 
                    strokeLinejoin="round" />
                <path
                    className={ `fill ${primary ? "primary" : "secondary"}` }
                    d={
                        "M854.041+853.107L1024.59+853.107C1024.69+853.107+1024.76+853.183+1024.76+" +
                        "853.277L1024.76+1023.83C1024.76+1023.92+1024.69+1024+1024.59+1024L854.041+1024C853" +
                        ".947+1024+853.871+1023.92+853.871+1023.83L853.871+853.277C853.871+853.183+853.947+853." +
                        "107+854.041+853.107Z"
                    }
                    strokeLinecap="round"
                    opacity={ (Math.random() * 0.2) + 0.8 }
                    strokeLinejoin="round" />
            </g>
        </svg>
    );

    /**
     * Generates the initials for the avatar.
     *
     * @return {string}
     */
    const generateInitials = (name): string => {
        return name.charAt(0).toUpperCase();
    };

    return (
        name
            ? (
                <Image
                    rounded
                    centered
                    className="animated-avatar"
                    data-componentid={ `${ componentId }-with-initials` }
                    { ...rest }
                >
                    <AnimatedSVGBackground/>
                    <span data-componentid={ `${ componentId }-initials` } className="initial">
                        { generateInitials(name) }
                    </span>
                </Image>
            )
            : <AnimatedSVGBackground />
    );
};

AnimatedAvatar.defaultProps = {
    "data-componentid": "animated-avatar",
    size: "mini",
    verticalAlign: "middle"
};
