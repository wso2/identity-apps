/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { Iframe } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useSelector } from "react-redux";
import useGetBrandingPreference from "../../branding/api/use-get-branding-preference";
import { BrandingPreferencesConstants } from "../../branding/constants";
import useBrandingPreference from "../../branding/hooks/use-branding-preference";
import { BrandingPreferenceThemeInterface } from "../../branding/models";
import { BrandingPreferenceUtils } from "../../branding/utils";
import { AppState, store } from "../../core";
import { EmailTemplate } from "../models";
import { EmailCustomizationUtils } from "../utils";

interface EmailTemplatePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Selected Email template
     */
    emailTemplate: EmailTemplate;
}

/**
 * Email customization preview component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Preview component of Email Customization.
 */
export const EmailTemplatePreview: FunctionComponent<EmailTemplatePreviewInterface> = (
    props: EmailTemplatePreviewInterface
): ReactElement => {

    const {
        emailTemplate,
        ["data-componentid"]: testId
    } = props;

    const { customText } = useBrandingPreference();

    const [ , setIsIframeReady ] = useState(false);
    const [
        predefinedThemes,
        setPredefinedThemes
    ] = useState<BrandingPreferenceThemeInterface>(BrandingPreferencesConstants.DEFAULT_PREFERENCE.theme);

    const organizationName: string = store.getState().auth.tenantDomain;
    const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);

    const {
        data: brandingPreference,
        isLoading: isBrandingPreferenceLoading
    } = useGetBrandingPreference(organizationName);

    const emailTemplateBody: string = useMemo(() => {
        if (emailTemplate?.body) {
            return EmailCustomizationUtils.getTemplateBody(
                organizationName,
                brandingPreference?.preference,
                customText,
                emailTemplate?.body,
                predefinedThemes
            );
        }

        return "";
    }, [
        emailTemplate?.body,
        organizationName,
        brandingPreference?.preference,
        isBrandingPreferenceLoading,
        predefinedThemes
    ]);

    /**
     * Resolves the theme variables on component mount.
     */
    useEffect(() => {
        if (!theme) {
            return;
        }

        BrandingPreferenceUtils.getPredefinedThemePreferences(theme)
            .then((response: BrandingPreferenceThemeInterface) => {
                setPredefinedThemes({
                    ...predefinedThemes,
                    ...response
                });
            });
    }, [ theme ]);

    return (
        <div
            className="email-template-preview"
            data-componentid={ testId }
        >
            <Iframe
                isReady={ setIsIframeReady }
                data-componentid={ `${ testId }-iframe` }
                className="email-template-preview-iframe"
            >
                <div
                    dangerouslySetInnerHTML={ { __html: StringUtils.sanitizeHTMLString(emailTemplateBody) } }
                    data-componentid={ `${ testId }-iframe-body-div` }
                />
            </Iframe>
        </div>
    );
};

/**
 * Default props for the component.
 */
EmailTemplatePreview.defaultProps = {
    "data-componentid": "email-customization-preview"
};
