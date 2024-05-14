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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement } from "react";
import AIText from "./ai-text";
import AIBannerBackground from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import "./ai-banner.scss";

/**
 * Interface for the AI banner component.
 */
interface AIBannerProps extends IdentifiableComponentInterface {
    title?: ReactElement;
    aiText?: ReactElement;
    description?: ReactElement;
    onActionButtonClick?: () => void;
    actionButtonText?: string;
    titleLabel?: ReactElement;
}

/**
 * AI banner component.
 */
const AIBanner = (props: AIBannerProps): ReactElement => {

    const {
        actionButtonText,
        aiText,
        description,
        onActionButtonClick,
        title,
        titleLabel
    } = props;

    return (
        <Box
            className="ai-banner"
            style={ {
                backgroundImage: `url(${ AIBannerBackground })`
            } }
        >
            <div className="ai-banner-text-container">
                <Typography
                    as="h3"
                    className="ai-banner-heading"
                >
                    { title }
                    <AIText>
                        { aiText }
                    </AIText>
                    {
                        titleLabel
                    }
                </Typography>
                <Typography className="ai-banner-sub-heading">
                    { description }
                </Typography>
            </div>
            {
                onActionButtonClick && actionButtonText && (
                    <Button
                        onClick={ onActionButtonClick }
                        color="primary"
                        variant="contained"
                    >
                        { actionButtonText }
                    </Button>
                )
            }
        </Box>
    );
};

export default AIBanner;
