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
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import BackgroundBlob from "./background-blob.png";
import "./user-survey-banner.scss";

/**
 * Section to display user survey banner.
 *
 * @param props - Props injected to the component.
 * @returns UserSurveyBanner component.
 */
export const UserSurveyBanner: FunctionComponent<IdentifiableComponentInterface> = ({
    "data-componentid": componentId = "user-survey-banner",
    ...rest
}: IdentifiableComponentInterface): ReactElement => {

    const surveyURL: string = useSelector((state: AppState) => state?.config?.ui?.userSurveyBanner?.url);
    const title: string = useSelector((state: AppState) => state?.config?.ui?.userSurveyBanner?.title);
    const description: string = useSelector((state: AppState) => state?.config?.ui?.userSurveyBanner?.description);

    return (
        <div
            style={ {
                height: "200px",
                overflow: "hidden",
                position: "relative",
                width: "100%"
            } }
        >
            <Paper
                className={ classNames("user-survey-banner") }
                data-componentid={ componentId }
                variant="outlined"
                { ...rest }
            >
                <Box className="user-survey-banner-content">
                    <Box>
                        <Typography variant="h3">
                            { title }
                        </Typography>
                        <Typography variant="body2">
                            { description }
                        </Typography>
                    </Box>
                </Box>
                <Box
                    className="login-box-overlay"
                    sx={ {
                        backgroundImage: `url(${BackgroundBlob})`
                    } }
                ></Box>
                <Box className="user-survey-banner-actions">
                    <Button
                        variant="contained"
                        onClick={ () => {
                            window.open(surveyURL, "_blank", "noopener,noreferrer");
                        } }
                    >
                        <Box display="flex" alignItems="center" gap={ 1 }>
                            <>
                                Take the Survey
                            </>
                        </Box>
                    </Button>
                </Box>
            </Paper>
        </div>
    );
};
