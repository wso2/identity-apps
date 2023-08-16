/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import parse, { Element } from "html-react-parser";
import React, { FunctionComponent, ReactElement } from "react";
import { LoginBox } from "./login-box";
import { ProductFooter } from "./product-footer";
import { ProductHeader } from "./product-header";
import { BrandingPreferenceInterface } from "../../models";


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
 * @param {BrandingPreferencePreviewInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
                                    <LoginBox
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
