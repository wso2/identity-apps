/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
