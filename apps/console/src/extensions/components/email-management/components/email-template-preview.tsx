/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Iframe } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useSelector } from "react-redux";
import { AppState, store } from "../../../../features/core";
import { useBrandingPreference } from "../../branding/api";
import { BrandingPreferencesConstants } from "../../branding/constants";
import { BrandingPreferenceThemeInterface } from "../../branding/models";
import { BrandingPreferenceUtils } from "../../branding/utils";
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
    } = useBrandingPreference(organizationName);

    const emailTemplateBody: string = useMemo(() => {
        if (emailTemplate?.body) {
            return EmailCustomizationUtils.getTemplateBody(
                organizationName,
                brandingPreference?.preference,
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
                    dangerouslySetInnerHTML={ { __html: emailTemplateBody } }
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
