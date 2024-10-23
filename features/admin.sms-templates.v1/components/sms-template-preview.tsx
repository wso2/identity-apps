/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Battery60Icon from "@mui/icons-material/Battery60";
import WifiIcon from "@mui/icons-material/Wifi";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants";
import { BrandingPreferenceUtils } from "@wso2is/admin.branding.v1/utils";
import { AppState } from "@wso2is/admin.core.v1";
import { BrandingPreferenceThemeInterface } from "@wso2is/common.branding.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SMSTemplate } from "../models/sms-templates";
import "./sms-template-preview.scss";

interface SMSTemplatePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Selected SMS template
     */
    smsTemplate: SMSTemplate;
}

/**
 * SMS customization preview component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Preview component of SMS Customization.
 */
const SMSTemplatePreview: FunctionComponent<SMSTemplatePreviewInterface> = (
    props: SMSTemplatePreviewInterface
): ReactElement => {
    const { smsTemplate, ["data-componentid"]: componentId = "sms-customization-preview" } = props;

    const [ predefinedThemes, setPredefinedThemes ] = useState<BrandingPreferenceThemeInterface>(
        BrandingPreferencesConstants.DEFAULT_PREFERENCE.theme
    );

    const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);

    /**
     * Resolves the theme variables on component mount.
     */
    useEffect(() => {
        if (!theme) {
            return;
        }

        BrandingPreferenceUtils.getPredefinedThemePreferences(theme).then(
            (response: BrandingPreferenceThemeInterface) => {
                setPredefinedThemes({
                    ...predefinedThemes,
                    ...response
                });
            }
        );
    }, [ theme ]);

    return (
        <div data-componentid={ componentId } className="sms-template-preview">
            <div className="mobile">
                <div className="display">
                    <Grid container columns={ 16 } className="status-bar">
                        <Grid xs={ 5 }>10:10</Grid>
                        <Grid xs={ 6 } textAlign="center">
                            <div className="island" />
                        </Grid>
                        <Grid xs={ 5 }>
                            <WifiIcon fontSize={ "small" } />
                            <Battery60Icon fontSize={ "small" } />
                        </Grid>
                    </Grid>
                    <div data-componentid={ `${componentId}-iframe-body-div` } className="message">
                        <Typography variant="h6" align="center">
                            Messages
                        </Typography>
                        <div className="line">
                            <AccountCircleIcon />
                            <div className="bubble">
                                <Typography variant="body2" className="preserve-newlines">
                                    { smsTemplate?.body }
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SMSTemplatePreview;
