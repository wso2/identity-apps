/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import {
    IdentifiableComponentInterface,
    ProductReleaseTypes,
    ProductVersionConfigInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Label, SemanticCOLORS } from "semantic-ui-react";
import { Heading } from "../typography";

/**
 * Product brand component Prop types.
 */
export interface ProductBrandPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * App name.
     */
    appName?: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Product logo.
     */
    logo?: any;
    /**
     * Product name.
     */
    productName?: string;
    /**
     * Custom styles object.
     */
    style?: CSSProperties | undefined;
    /**
     * Product version.
     */
    version?: string;
    /**
     * Product version config settings.
     */
    versionUISettings?: ProductVersionConfigInterface;
    /**
     * Mobile view switch.
     */
    mobile?: boolean;
}

/**
 * Product Brand component.
 *
 * @param {React.PropsWithChildren<ProductBrandPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ProductBrand: FunctionComponent<PropsWithChildren<ProductBrandPropsInterface>> = (
    props: PropsWithChildren<ProductBrandPropsInterface>
): ReactElement => {

    const {
        appName,
        children,
        className,
        logo,
        productName,
        style,
        version,
        versionUISettings,
        mobile,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const mainClasses = classNames(
        className,
        "product-title"
    );

    const versionLabelClasses = classNames(
        "version-label",
        {
            "preview-label": version === "PREVIEW",
            "primary" : (version !== "PREVIEW" && !versionUISettings.labelColor),
            [ versionUISettings.labelColor ]: (versionUISettings.labelColor === "primary"
                || versionUISettings.labelColor === "secondary")
        }
    );

    /**
     * Resolves the version label color.
     *
     * @return {SemanticCOLORS} Resolved color.
     */
    const resolveVersionLabelColor = (releaseType: ProductReleaseTypes): SemanticCOLORS => {
        // The label color will be resolved via label class applied.
        if (version === "PREVIEW") {
            return null;
        }

        if (versionUISettings?.labelColor
            && !(versionUISettings.labelColor === "auto"
                || versionUISettings.labelColor === "primary"
                || versionUISettings.labelColor === "secondary")) {

            return versionUISettings.labelColor as SemanticCOLORS;
        }

        if (versionUISettings.labelColor === "primary" || versionUISettings.labelColor === "secondary") {
            return "grey";
        }

        if (releaseType === ProductReleaseTypes.ALPHA) {
            return "red";
        } else if (releaseType === ProductReleaseTypes.BETA) {
            return "teal";
        } else if (releaseType === ProductReleaseTypes.RC) {
            return "green";
        } else if (releaseType === ProductReleaseTypes.MILESTONE) {
            return "violet";
        }

        return "grey";
    };

    /**
     * Resolves the release version.
     *
     * @return {string} Resolved release version.
     */
    const resolveReleaseVersionLabel = (): ReactNode => {

        const [
            versionNumber,
            release,
            releaseType
        ] = CommonUtils.parseProductVersion(version, versionUISettings.allowSnapshot);

        let constructed = `${ versionNumber ?? "" } ${ release ?? "" }`;

        if (versionUISettings) {
            if (versionUISettings.textCase === "lowercase") {
                constructed = constructed.toLowerCase();
            } else if (versionUISettings.textCase === "uppercase") {
                constructed = constructed.toUpperCase();
            }
        }

        const productTitleMetaClasses = classNames(
            "product-title-meta",
            {
                "absolute": (versionUISettings?.labelPosition === "absolute")
            }
        );

        return (
            <div className={ productTitleMetaClasses }>
                <Label
                    color={ resolveVersionLabelColor(releaseType) }
                    className={ versionLabelClasses }
                    size="mini"
                    data-componentid={ `${ componentId }-version` }
                    data-testid={ `${ testId }-version` }
                >
                    { constructed }
                </Label>
            </div>
        );
    };

    return (
        <div className={ mainClasses } style={ style } data-testid={ testId } data-componentid={ componentId }>
            { version && resolveReleaseVersionLabel() }
            <div className={ `product-title-main ${ mobile ? "mt-4" : "" }` }>
                { logo && logo }
                {
                    (appName || productName) && (
                        <>
                            <Heading
                                className={ "product-title-text" }
                                style={ style }
                                data-componentid={ `${ componentId }-title` }
                                data-testid={ `${ testId }-title` }
                                compact
                            >
                                { productName }
                                { !mobile && appName && <span className="app-name">{ appName }</span> }
                            </Heading>
                            { mobile && appName && <span className="app-name display-inline-block">{ appName }</span> }
                        </>
                    )
                }
                { children }
            </div>
        </div>
    );
};

/**
 * Default props for the product brand component.
 */
ProductBrand.defaultProps = {
    "data-componentid": "product-brand",
    "data-testid": "product-brand",
    versionUISettings: {
        allowSnapshot: false,
        labelColor: "primary",
        textCase: "uppercase"
    }
};
