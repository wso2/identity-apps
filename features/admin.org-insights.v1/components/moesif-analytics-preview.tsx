/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Theme, styled } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import authenticationImage from "../assets/preview/moesif-analytics-authentication.png";
import overviewImage from "../assets/preview/moesif-analytics-overview.png";
import summaryImage from "../assets/preview/moesif-analytics-summary.png";

const MOESIF_TOS_URL_FALLBACK: string = "https://www.moesif.com/terms/";

const Screenshot: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    border: `1px solid ${ theme.palette.divider }`,
    borderRadius: theme.shape.borderRadius,
    display: "block",
    width: "100%"
}));

interface MoesifAnalyticsPreviewPropsInterface extends IdentifiableComponentInterface {
    moesifTermsOfServiceUrl?: string;
    termsOfServiceUrl?: string;
}

/**
 * Informational view shown before enabling advanced analytics: a short summary, the dashboards the
 * user gets, and the data-handling notes they should read first.
 */
const MoesifAnalyticsPreview: FunctionComponent<MoesifAnalyticsPreviewPropsInterface> = (
    {
        "data-componentid": componentId = "moesif-analytics-preview",
        moesifTermsOfServiceUrl = MOESIF_TOS_URL_FALLBACK,
        termsOfServiceUrl = ""
    }: MoesifAnalyticsPreviewPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    const shots: { caption: string; src: string }[] = [
        { caption: t("insights:advancedAnalytics.preview.overviewCaption"), src: overviewImage },
        { caption: t("insights:advancedAnalytics.preview.summaryCaption"), src: summaryImage },
        { caption: t("insights:advancedAnalytics.preview.authenticationCaption"), src: authenticationImage }
    ];

    return (
        <Box data-componentid={ componentId }>
            <Typography variant="h6" gutterBottom>
                { t("insights:advancedAnalytics.preview.heading") }
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
                { t("insights:advancedAnalytics.preview.lead") }
            </Typography>

            { shots.map((shot: { caption: string; src: string }) => (
                <Box key={ shot.src } sx={ { mb: 4 } }>
                    <Screenshot component="img" src={ shot.src } alt={ shot.caption } />
                    <Typography variant="body2" color="text.secondary" sx={ { mt: 1 } }>
                        { shot.caption }
                    </Typography>
                </Box>
            )) }

            <Typography variant="subtitle2" sx={ { mb: 1 } }>
                { t("insights:advancedAnalytics.dialog.intro") }
            </Typography>
            <Box component="ul" sx={ { m: 0, pl: 2.5 } }>
                <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                    <Trans
                        i18nKey="insights:advancedAnalytics.dialog.privacyPoint"
                        components={ {
                            1: <strong />,
                            3: <a href={ termsOfServiceUrl } target="_blank" rel="noopener noreferrer" />,
                            5: <a href={ moesifTermsOfServiceUrl } target="_blank" rel="noopener noreferrer" />
                        } }
                    />
                </Typography>
                <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                    <Trans
                        i18nKey="insights:advancedAnalytics.dialog.dataRetentionPoint"
                        components={ { 1: <strong /> } }
                    />
                </Typography>
                <Typography variant="body2" component="li">
                    <Trans
                        i18nKey="insights:advancedAnalytics.dialog.irreversiblePoint"
                        components={ { 1: <strong /> } }
                    />
                </Typography>
            </Box>

            <Alert
                data-componentid={ `${ componentId }-warning-alert` }
                severity="warning"
                sx={ { mt: 2.5 } }
            >
                { t("insights:advancedAnalytics.dialog.warning") }
            </Alert>
        </Box>
    );
};

export default MoesifAnalyticsPreview;
