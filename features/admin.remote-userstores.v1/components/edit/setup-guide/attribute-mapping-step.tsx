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

import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans } from "react-i18next";
import { RemoteUserStoreEditTabIDs } from "../../../constants/ui-constants";

type AttributeMappingsStepPropsInterface = IdentifiableComponentInterface;

/**
 * Attribute mappings component for remote user store edit setup guide.
 */
const AttributeMappingsStep: FunctionComponent<AttributeMappingsStepPropsInterface> = ({
    ["data-componentid"]: componentId = "attribute-mappings-step"
}: AttributeMappingsStepPropsInterface): ReactElement => {
    return (
        <Typography component="p" data-componentid={ `${componentId}-description` }>
            <Trans i18nKey="remoteUserStores:pages.edit.guide.steps.attributeMapping.description">
                Update the <Link href={ `#tab=${RemoteUserStoreEditTabIDs.CONFIGURATIONS}` }>attribute mappings</Link>
                according to remote user store that you connected. Make sure to review the mapped attributes otherwise
                it may cause errors in the user listings.
            </Trans>
        </Typography>
    );
};

export default AttributeMappingsStep;
