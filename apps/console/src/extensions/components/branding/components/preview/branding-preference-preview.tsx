/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Iframe } from "@wso2is/react-components";
import get from "lodash-es/get";
import React, {
    FunctionComponent,
    ReactElement,
    useState
} from "react";
import { LoginScreenSkeleton } from "./login-screen-skeleton";
import { BrandingPreferenceMeta } from "../../meta";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Proptypes for the Branding preference preview component.
 */
interface BrandingPreferencePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
    /**
     * Should the component render as loading.
     */
    isLoading: boolean;
}

/**
 * Branding Preference Preview.
 *
 * @param {BrandingPreferencePreviewInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const BrandingPreferencePreview: FunctionComponent<BrandingPreferencePreviewInterface> = (
    props: BrandingPreferencePreviewInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference,
        isLoading
    } = props;

    const [ isIframeReady, setIsIframeReady ] = useState<boolean>(false);

    return (
        <div className="branding-preference-preview-container" data-componentid={ componentId }>
            <Iframe
                cloneParentStyleSheets
                injectStyleNodeAfterParentStyles
                styles={ BrandingPreferenceMeta.getThemeSkeleton(brandingPreference.theme) }
                styleNodeInjectionStrategy="prepend"
                stylesheets={ [
                    get(brandingPreference, "stylesheets.accountApp")
                ] }
                isReady={ (status: boolean) => {
                    setIsIframeReady(status);
                } }
                zoom={ 60 }
                isLoading={ !isLoading || !isIframeReady }
                data-componentid={ `${ componentId }-iframe` }
            >
                {
                    !isLoading && isIframeReady
                        ? (
                            <LoginScreenSkeleton
                                brandingPreference={ brandingPreference }
                                data-componentid="branding-preference-preview-login-skeleton"
                            />
                        )
                        : <ContentLoader data-componentid={ `${ componentId }-loader` } />
                }
            </Iframe>
        </div>
    );
};

/**
 * Default props for the component.
 */
BrandingPreferencePreview.defaultProps = {
    "data-componentid": "branding-preference-preview"
};
