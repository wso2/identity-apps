/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, DocumentationLink, Message, Text, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans } from "react-i18next";
import { SupportedSPATechnologyTypes } from "../models";

/**
 * Interface for the Prerequisites component props.
 */
interface PrerequisitesPropsInterface extends IdentifiableComponentInterface {

    /**
     * Technology of the SDK.
     */
    technology: SupportedSPATechnologyTypes;
}

/**
 * Integrate SDKs common Prerequisites step.
 * 
 * @param props - Props injected into the component.
 * @returns Prerequisites component.
 */
export const Prerequisites: FunctionComponent<PrerequisitesPropsInterface> = (
    props: PrerequisitesPropsInterface
): ReactElement => {

    const {
        technology,
        [ "data-componentid" ]: componentId
    } = props;

    const { getLink } = useDocumentation();

    return (
        <div data-componentid={ componentId } className="mt-3 mb-6">
            <Message
                type="info"
                header="Prerequisite"
                content={ (
                    <Text className="message-info-text">
                        <Trans
                            i18nKey="extensions:develop.applications.quickstart.spa.common.prerequisites.node"
                        >
                            You will need to have <strong>Node.js</strong> and <strong>npm</strong> installed on
                            your environment to try out the SDK.

                            To download the Long Term Support (LTS) version of <strong>Node.js </strong>
                            (which includes <strong>npm</strong>), navigate to the official <DocumentationLink
                                link={ getLink("develop.applications.editApplication." + 
                                    "singlePageApplication.quickStart.nodejsDownload") }
                                showEmptyLinkText
                            >downloads</DocumentationLink> page.
                        </Trans>
                    </Text>
                ) }
            />
            {
                technology === SupportedSPATechnologyTypes.ANGULAR && (
                    <Text>
                        <Trans
                            i18nKey="extensions:develop.applications.quickstart.spa.common.prerequisites.angular"
                        >
                            <strong>Note: </strong>The SDK currently doesn&apos;t support Angular 11 applications
                            in the <Code>Strict Mode</Code>. We are working on making the SDK compatible.
                        </Trans>
                    </Text>
                )
            }
        </div>
    );
};

/**
 * Default props for the component
 */
Prerequisites.defaultProps = {
    "data-componentid": "spa-sdk-integrate-prerequisites"
};
