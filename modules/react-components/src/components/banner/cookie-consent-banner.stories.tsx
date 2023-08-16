/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { CookieConsentBanner } from "./cookie-consent-banner";
import { meta } from "./cookie-consent-banner.stories.meta";

export default {
    parameters: {
        component: CookieConsentBanner,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Cookie Consent"
};

/**
 * Story to display the default Cookie consent banner.
 *
 * @returns the story to display the default Cookie consent banner.
 */
export const DefaultVariation = (): ReactElement => {
    return (
        <CookieConsentBanner
            title={ (
                <div className="title">
                    We use cookies to ensure that you get the best overall experience. These
                    cookies are used to maintain an uninterrupted session whilst
                    providing smooth and personalized services. To learn more about how we
                    use cookies, refer our <a
                        href="https://wso2.com/cookie-policy"
                        target="_blank"
                        rel="noopener noreferrer">Cookie Policy</a>.
                </div>
            ) }
            confirmButtonText="Got it"
        />
    );
};

DefaultVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the inverted Cookie consent banner.
 *
 * @returns the story to display the inverted Cookie consent banner.
 */
export const InvertedVariation = (): ReactElement => {
    return (
        <CookieConsentBanner
            inverted
            title={ (
                <div className="title">
                    We use cookies to ensure that you get the best overall experience. These
                    cookies are used to maintain an uninterrupted session whilst
                    providing smooth and personalized services. To learn more about how we
                    use cookies, refer our <a
                        href="https://wso2.com/cookie-policy"
                        target="_blank"
                        rel="noopener noreferrer">Cookie Policy</a>.
                </div>
            ) }
            confirmButtonText="Got it"
        />
    );
};

InvertedVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
