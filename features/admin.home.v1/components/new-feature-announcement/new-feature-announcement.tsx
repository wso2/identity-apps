/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import useNewRegistrationPortalFeatureStatus from
    "@wso2is/admin.registration-flow-builder.v1/api/use-new-registration-portal-feature-status";
import AIText from "@wso2is/common.ai.v1/components/ai-text";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import BackgroundBlob from "./background-blob.png";
import SignUpBox from "./sign-up-box";
import { ReactComponent as PreviewFeaturesIcon } from "../../../themes/default/assets/images/icons/flask-icon.svg";
import "./new-feature-announcement.scss";

/**
 * Props interface of {@link NewFeatureAnnouncement}
 */
export interface NewFeatureAnnouncementProps extends IdentifiableComponentInterface {}

/**
 * Section to display new feature announcements.
 *
 * @param props - Props injected to the component.
 * @returns NewFeatureAnnouncement component.
 */
const NewFeatureAnnouncement: FunctionComponent<NewFeatureAnnouncementProps> = ({
    "data-componentid": componentId = "new-feature-announcement",
    ...rest
}: NewFeatureAnnouncementProps): ReactElement => {
    const { setShowPreviewFeaturesModal } = useFeatureGate();

    const { data: isNewRegistrationPortalEnabled } = useNewRegistrationPortalFeatureStatus();

    return (
        <Paper
            className={ classNames("new-feature-announcement") }
            data-componentid={ componentId }
            variant="outlined"
            { ...rest }
        >
            <Box className="new-feature-announcement-content">
                <Box>
                    <Typography variant="h3">Design seamles self-registration experience</Typography>
                    <Typography variant="body2">
                        Design your user&apos;s self-registration flow with the new visual registration flow designer
                        tool powered with AI
                        <AIText />
                    </Typography>
                </Box>
            </Box>
            <Box
                className="login-box-overlay"
                sx={ {
                    backgroundImage: `url(${BackgroundBlob})`
                } }
            ></Box>
            <Box className="login-box">
                <SignUpBox />
            </Box>
            <Box className="new-feature-announcement-actions">
                { isNewRegistrationPortalEnabled ? (
                    <Button
                        variant="contained"
                        onClick={ () => history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER")) }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            Try Out <ChevronRightIcon />
                        </Box>
                    </Button>
                ) : (
                    <Button variant="contained" onClick={ () => setShowPreviewFeaturesModal(true) }>
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            <PreviewFeaturesIcon /> Enable and try out
                        </Box>
                    </Button>
                ) }
            </Box>
        </Paper>
    );
};

export default NewFeatureAnnouncement;
