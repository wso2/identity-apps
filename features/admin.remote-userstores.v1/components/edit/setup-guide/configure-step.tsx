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

import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";

interface ConfigureStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * Key to resolve the documentation link.
     */
    docLinkKey: string;
}

/**
 * Configure step component for the remote user store setup guide.
 */
const ConfigureStep: FunctionComponent<ConfigureStepPropsInterface> = (
    {
        docLinkKey,
        ["data-componentid"]: componentId = "configure-step"
    }: ConfigureStepPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    return (
        <div data-componentid={ componentId }>
            <Typography component="p" marginBottom={ 2 }>
                { t("remoteUserStores:pages.edit.guide.steps.configure.description") }
            </Typography>
            <Typography component="p">
                <Trans
                    i18nKey={ "remoteUserStores:pages.edit.guide.steps.configure.docsDescription" }
                >
                    See the
                    <DocumentationLink
                        link={ getLink(docLinkKey) }>
                        Asgardeo documentation
                    </DocumentationLink> for more details on configuring the user store agent.
                </Trans>
            </Typography>
        </div>
    );
};

export default ConfigureStep;
