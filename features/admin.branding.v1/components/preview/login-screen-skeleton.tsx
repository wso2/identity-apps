/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { BrandingPreferenceInterface } from "@wso2is/common.branding.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import parse, { Element } from "html-react-parser";
import React, { FunctionComponent, ReactElement } from "react";
import { ProductFooter } from "./product-footer";
import { ProductHeader } from "./product-header";
import SignInBox from "./sign-in-box/sign-in-box";


/**
 * Proptypes for the Branding preference preview component.
 */
interface LoginScreenSkeletonInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
    /**
     * Layout HTML Content.
     */
    layoutContent: string;
}

/**
 * Branding Preference Preview.
 *
 * @param props - Props injected to the component.
 * @returns Branding preference preview component.
 */
export const LoginScreenSkeleton: FunctionComponent<LoginScreenSkeletonInterface> = (
    props: LoginScreenSkeletonInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference,
        layoutContent
    } = props;

    return (
        <div data-componentid={ componentId } className="login-portal layout authentication-portal-layout">
            {
                parse(layoutContent, {
                    replace: (domNode: Element) => {
                        if (domNode.name === "section" && domNode.attribs) {
                            if (domNode.attribs.id === "productHeader") {
                                return (
                                    <ProductHeader
                                        brandingPreference={ brandingPreference }
                                        data-componentid={ `${ componentId }-product-header` }
                                    />
                                );
                            }
                            if (domNode.attribs.id === "mainSection") {
                                return (
                                    <SignInBox
                                        brandingPreference={ brandingPreference }
                                        data-componentid={ `${ componentId }-login-box` }
                                    />
                                );
                            }
                            if (domNode.attribs.id === "productFooter") {
                                return (
                                    <ProductFooter
                                        brandingPreference={ brandingPreference }
                                        data-componentid={ `${ componentId }-product-footer` }
                                    />
                                );
                            }
                        }
                    }
                })
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
LoginScreenSkeleton.defaultProps = {
    "data-componentid": "login-screen-skeleton"
};
