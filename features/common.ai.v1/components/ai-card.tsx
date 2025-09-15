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

import Stack from "@mui/material/Stack";
import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
import React, { ReactElement } from "react";
import "./ai-generation-modal.scss";
import { Card, CardContent } from "semantic-ui-react";
import AIText from "./ai-text";
import AIBannerBackground from "../../themes/wso2is/assets/images/illustrations/ai-banner-background-white.svg";
import "./ai-card.scss";

const AICard = ({ resource, onAdd }): ReactElement => {
    return (
        <Card
            style={ {
                backgroundImage: `url(${ AIBannerBackground })`,
                backgroundPostion: "right",
                marginBottom: "0"
            } }
            className="ai-card"
            variant="elevation"
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={ 1 }>
                    <Stack direction="row" spacing={ 1 }>
                        <Avatar
                            className="ai-card-avatar"
                            src={ resource?.display?.image }
                            variant="square"
                            sx={ { width: "20px", height: "20px", marginTop: "3px" } }
                        />
                        <Stack direction="column" spacing={ 0.5 }>
                            <Typography sx={ { fontWeight: "bold" } }>
                                <AIText>
                                    { resource?.display?.label }
                                </AIText>
                            </Typography>
                            { resource?.display?.description && (
                                <Typography variant="body2">{ resource?.display?.description }</Typography>
                            ) }
                        </Stack>
                        { onAdd && (
                            <IconButton
                                className="ai-card-add-button"
                                onClick={ () => onAdd(resource) }
                            >
                                <PlusIcon size={ 14 } />
                            </IconButton>
                        ) }
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AICard;
