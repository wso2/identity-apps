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

import useDeploymentConfig from "@wso2is/admin.core.v1/hooks/use-deployment-configs";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { MarkdownGuide } from "@wso2is/admin.template-core.v1/components/markdown-guide";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";


interface SetupGuidePropsInterface extends IdentifiableComponentInterface {
    content: string;
    identityVerificationProviderId: string;
    isLoading?: boolean;
}

/**
 * An interface that includes all the data types which can be used in the markdown guide.
 */
interface MarkdownGuideDataInterface {
    productName: string;
    webhookUrl: string;
    identityVerificationProviderId: string;
}

const SetupGuide: FunctionComponent<SetupGuidePropsInterface> = (
    {
        content,
        identityVerificationProviderId,
        isLoading = false,
        ["data-componentid"]: componentId = "idvp-edit-setup-guide"
    }: SetupGuidePropsInterface
): ReactElement => {

    const { UIConfig } = useUIConfig();
    const { deploymentConfig: { serverHost } } = useDeploymentConfig();

    /**
     * Create a unified data object for the current application
     * by combining multiple API responses.
     */
    const data: MarkdownGuideDataInterface = useMemo(() => {
        if (isLoading ) {
            return null;
        }

        const markdownDataObject: MarkdownGuideDataInterface = {
            identityVerificationProviderId,
            productName: UIConfig?.productName,
            webhookUrl: `${serverHost}/idv/onfido/v1/${identityVerificationProviderId}/verify`
        };

        return markdownDataObject;
    }, [
        identityVerificationProviderId
    ]);

    return (
        <MarkdownGuide
            data={ data as unknown as Record<string, unknown> }
            content={ content }
            isLoading={ isLoading }
            data-componentid={ componentId }
        />
    );
};

export default SetupGuide;
