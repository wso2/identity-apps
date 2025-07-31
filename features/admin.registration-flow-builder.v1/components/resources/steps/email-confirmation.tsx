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
import Card from "@oxygen-ui/react/Card";
import { Theme } from "@oxygen-ui/react/models/theme";
import { useTheme } from "@oxygen-ui/react/theme";
import Typography from "@oxygen-ui/react/Typography";
import { EnvelopeAtIcon } from "@oxygen-ui/react-icons";
import VisualFlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/visual-flow-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position } from "@xyflow/react";
import React, { FC, ReactElement, memo } from "react";
import { useTranslation } from "react-i18next";
import { RegistrationStaticStepTypes } from "../../../models/flow";

/**
 * Props interface of {@link EmailConfirmation}
 */
export type EmailConfirmationPropsInterface = IdentifiableComponentInterface;

/**
 * Email confirmation node component.
 *
 * @param props - Props injected to the component.
 * @returns Email confirmation node component.
 */
const EmailConfirmationNode: FC<EmailConfirmationPropsInterface> = memo(({
    ["data-componentid"]: componentId = "email-confirmation"
}: EmailConfirmationPropsInterface): ReactElement => {
    const theme: Theme = useTheme();
    const { t } = useTranslation();

    return (
        <Card
            data-componentid={ componentId }
            sx={ {
                backgroundColor: (theme as any).colorSchemes.dark.palette.background.default,
                color: (theme as any).colorSchemes.dark.palette.text.primary
            } }
        >
            <Handle
                type="target"
                id={ RegistrationStaticStepTypes.EMAIL_CONFIRMATION +
                    VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX }
                position={ Position.Left }
            />
            <Box display="flex" gap={ 1 } justifyContent="center" data-componentid={ componentId }>
                <EnvelopeAtIcon size={ 25 } />
                <Typography variant="body1">{ t("flows:registrationFlow.steps.emailConfirmation") }</Typography>
            </Box>
            <Handle
                type="source"
                id={ RegistrationStaticStepTypes.EMAIL_CONFIRMATION +
                    VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX }
                position={ Position.Right }
            />
        </Card>
    );
}, () => true);

export default EmailConfirmationNode;
