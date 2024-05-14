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

import IconButton from "@mui/material/IconButton";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon }from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import AIText from "./ai-text";
import AIBannerBackgroundTall
    from "../../themes/wso2is/assets/images/illustrations/ai-banner-input-background-tall.png";
import AIBot
    from "../../themes/wso2is/assets/images/illustrations/ai-bot.svg";
import "./ai-banner.scss";
import "./ai-banner-tall.scss";

/**
 * Interface for the AI banner component.
 */
interface AIBannerTallProps extends IdentifiableComponentInterface {
    title?: ReactElement;
    aiText?: ReactElement;
    description?: ReactElement;
    titleLabel?: ReactElement;
}

/**
 * Tall AI banner component.
 */
const AIBannerTall = (props: PropsWithChildren<AIBannerTallProps>): ReactElement => {

    const {
        aiText,
        children,
        description,
        title,
        titleLabel
    } = props;

    const [ showContent, setShowContent ] = useState<boolean>(true);

    return (
        <Accordion
            className="ai-banner-container"
            defaultExpanded
            disableGutters
            elevation={ 0 }
            sx={ {
                "&:before": {
                    display: "none"
                }
            } }
            style={ {
                backgroundImage: `url(${ AIBot }), url(${ AIBannerBackgroundTall })`
            } }
            onChange={ () => setShowContent(!showContent) }

        >
            <AccordionSummary
                className="ai-banner-content"
                expandIcon={ (
                    <IconButton
                        className="ai-banner-collapse-button"
                    >
                        <ChevronDownIcon
                            className="ai-banner-caret-icon"
                            size={ 14 }
                            fill="black"
                        />
                    </IconButton>
                ) }
            >
                <Box className="ai-banner-text-container">
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
                </Box>
            </AccordionSummary>
            <Box className="ai-banner-children">
                { children }
            </Box>
        </Accordion>
    );
};

export default AIBannerTall;
