/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, Heading, Text } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement } from "react";
import { Card, Divider, Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../core";
import { ProtocolCard } from "../../../../core/components";
import { getSAMLModeIcons } from "../../../configs";
import { SAMLConfigModes } from "../../../models";
import { ApplicationManagementUtils } from "../../../utils";

/**
 * Proptypes for the saml configuration mode content interface.
 */
interface SAMLConfigModeInterface {
    name: string;
    image?: any;
    mode: SAMLConfigModes;
}

/**
 * Proptypes for the  SAML Selection Landing landing component.
 */
interface SAMLSelectionLandingPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Set mode of configuration in SAML protocol.
     */
    setSAMLProtocol: (protocol: SAMLConfigModes) => void;
}

/**
 * Landing component for SAML configurations mode.
 *
 * @param {SAMLSelectionLandingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SAMLSelectionLanding: FunctionComponent<SAMLSelectionLandingPropsInterface> = (
    props: SAMLSelectionLandingPropsInterface
): ReactElement => {

    const {
        setSAMLProtocol,
        ["data-testid"]: testId
    } = props;


    const resolveSAMLMode = (): SAMLConfigModeInterface[] => {
        const samlModeList: SAMLConfigModeInterface[] = [
            {
                image: getSAMLModeIcons().manual,
                mode: SAMLConfigModes.MANUAL,
                name: ApplicationManagementUtils.resolveSAMLConfigModeDisplayName(SAMLConfigModes.MANUAL)
            },
            {
                image: getSAMLModeIcons().fileBased,
                mode: SAMLConfigModes.META_FILE,
                name: ApplicationManagementUtils.resolveSAMLConfigModeDisplayName(SAMLConfigModes.META_FILE)
            },
            {
                image: getSAMLModeIcons().URLBased,
                mode: SAMLConfigModes.META_URL,
                name: ApplicationManagementUtils.resolveSAMLConfigModeDisplayName(SAMLConfigModes.META_URL)
            }
        ];

        return samlModeList;
    };

    const resolveContent = (): ReactElement => {

        const samlModeList: SAMLConfigModeInterface[] = resolveSAMLMode();

        return (
            <Grid.Row className="protocol-selection-wrapper check" textAlign="center">
                <Grid.Column width={ 16 }>
                    <div data-testid={ testId }>
                        <Heading as="h2" className="mb-1" compact>
                            Which mode are you using?
                        </Heading>
                        <Text muted>
                            Select the mode of configuration for your SAML application.
                        </Text>
                        <Divider hidden/>
                        {
                            (!isEmpty(samlModeList) && Array.isArray(samlModeList)
                                && samlModeList.length > 0) && (
                                <Card.Group
                                    centered
                                    className="tech-selection-cards mt-3"
                                    itemsPerRow={ 9 }
                                >
                                    {
                                        samlModeList.map((mode: SAMLConfigModeInterface, index: number) => (
                                            <ProtocolCard
                                                key={ index }
                                                raised={ false }
                                                data-testid={
                                                    mode["data-testid"]
                                                    ?? `technology-card-${kebabCase(mode.name)}`
                                                }
                                                onClick={ () => setSAMLProtocol(mode.mode) }
                                                displayName={ mode.name }
                                                overlayOpacity={ 0.6 }
                                                image={ mode.image }
                                                className={ "protocol-card" }
                                                iconClass={ mode.mode === SAMLConfigModes.META_FILE }
                                            />
                                        ))
                                    }
                                </Card.Group>
                            )
                        }
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <EmphasizedSegment
            basic
            data-testid={ testId }
        >
            <Grid>
                { resolveContent() }
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the SAML Selection Landing component.
 */
SAMLSelectionLanding.defaultProps = {
    "data-testid": "protocol-saml-configuration-mode-landing"
};
