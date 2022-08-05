/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, Link, MessageWithIcon, Text } from "@wso2is/react-components";
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
 * @param {PrerequisitesPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const Prerequisites: FunctionComponent<PrerequisitesPropsInterface> = (
    props: PrerequisitesPropsInterface
): ReactElement => {

    const {
        technology,
        [ "data-componentid" ]: componentId
    } = props;

    return (
        <div data-componentid={ componentId } className="mt-3 mb-6">
            <MessageWithIcon
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
                            (which includes <strong>npm</strong>), navigate to the official <Link
                            link="https://nodejs.org/en/download/">downloads</Link> page.
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
