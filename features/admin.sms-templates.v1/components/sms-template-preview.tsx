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
import Typography from "@oxygen-ui/react/Typography";
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants";
import { BrandingPreferenceUtils } from "@wso2is/admin.branding.v1/utils";
import { AppState } from "@wso2is/admin.core.v1";
import { BrandingPreferenceThemeInterface } from "@wso2is/common.branding.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { SmsTemplate } from "../models/sms-templates";
import "./sms-template-preview.scss";

interface SmsTemplatePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Selected SMS template
     */
    smsTemplate: SmsTemplate;
}

/**
 * SMS customization preview component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Preview component of SMS Customization.
 */
export const SmsTemplatePreview: FunctionComponent<SmsTemplatePreviewInterface> = (
    props: SmsTemplatePreviewInterface
): ReactElement => {

    const {
        smsTemplate,
        ["data-componentid"]: testId
    } = props;

    const [
        predefinedThemes,
        setPredefinedThemes
    ] = useState<BrandingPreferenceThemeInterface>(BrandingPreferencesConstants.DEFAULT_PREFERENCE.theme);

    const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);

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
            className="sms-template-preview sms-template-mobile"
            data-componentid={ testId }
        >
            <div className="sms-template-mobile-display">
                <Grid className="sms-template-mobile-display-status-bar">
                    <Grid.Row>
                        <Grid.Column
                            mobile={ 5 }
                            computer={ 5 }
                        >
                            10:10
                        </Grid.Column>
                        <Grid.Column
                            mobile={ 6 }
                            computer={ 6 }
                            textAlign="center"
                        >
                            <div className="sms-template-mobile-island"/>
                        </Grid.Column>
                        <Grid.Column
                            mobile={ 5 }
                            computer={ 5 }
                        >
                            <WifiIcon fontSize={ "small" }/>
                            <Battery60Icon fontSize={ "small" }/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div
                    data-componentid={ `${ testId }-iframe-body-div` }
                    className="sms-template-mobile-message"
                >
                    <Typography variant="h6" align="center">Messages</Typography>
                    <div className="sms-template-mobile-message-line">
                        <AccountCircleIcon/>
                        <div className="sms-template-mobile-message-bubble">
                            <Typography variant="body2" className="preserve-newlines">{ smsTemplate?.body }</Typography>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
SmsTemplatePreview.defaultProps = {
    "data-componentid": "sms-customization-preview"
};
