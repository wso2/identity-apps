/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { OutboundProvisioningRoles } from "./outbound-provisioning";
import {
    getOutboundProvisioningConnector,
    getOutboundProvisioningConnectorMetadata,
    updateIDPRoleMappings,
    updateOutboundProvisioningConnector
} from "../../../api";
import {
    IdentityProviderRolesInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface,
    OutboundProvisioningConnectorsInterface
} from "../../../models";
import { OutboundProvisioningConnectorFormFactory } from "../forms";

/**
 * Proptypes for the provisioning settings component.
 */
interface ProvisioningSettingsPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * Outbound connector details of the IDP
     */
    outboundConnectors: OutboundProvisioningConnectorsInterface;

    /**
     * Outbound provisioning roles of the IDP
     */
    idpRoles: IdentityProviderRolesInterface;

    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;

    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider provisioning settings component.
 *
 * @param { ProvisioningSettingsPropsInterface } props - Props injected to the component.
 * @return { ReactElement }
 */
export const OutboundProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        idpId,
        outboundConnectors,
        idpRoles,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [triggerSubmission, setTriggerSubmission] = useTrigger();

    const [connectorMeta, setConnectorMeta] = useState<OutboundProvisioningConnectorMetaInterface>(undefined);

    const [connectorDetails, setConnectorDetails] = useState<OutboundProvisioningConnectorInterface>(undefined);

    /**
     * Handles the connector config form submit action.
     *
     * @param values - Form values.
     */
    const handleConnectorConfigFormSubmit = (values: OutboundProvisioningConnectorInterface): void => {
        updateOutboundProvisioningConnector(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the outbound provisioning connector.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(idpId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the outbound provisioning connector.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    const handleOutboundProvisioningRoleMapping = (outboundProvisioningRoles: string[]) => {
        updateIDPRoleMappings(idpId, {
                ...idpRoles,
                outboundProvisioningRoles: outboundProvisioningRoles
            }
        ).then(() => {
            dispatch(addAlert(
                {
                    description: "Successfully updated outbound provisioning role configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while updating outbound provisioning role " +
                        "configurations",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }
            ));
        })
    }

    useEffect(() => {
        if (outboundConnectors.defaultConnectorId) {
            getOutboundProvisioningConnector(idpId, outboundConnectors.defaultConnectorId)
                .then(response => {
                    setConnectorDetails(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the outbound provisioning connector details.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });

            getOutboundProvisioningConnectorMetadata(outboundConnectors.defaultConnectorId)
                .then(response => {
                    setConnectorMeta(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the outbound provisioning connector metadata.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        }
    }, [props]);

    return (
        !isLoading ?
            <>
                {
                    connectorMeta && connectorDetails && outboundConnectors?.defaultConnectorId &&
                    <OutboundProvisioningConnectorFormFactory
                        metadata={ connectorMeta }
                        initialValues={ connectorDetails }
                        triggerSubmit={ triggerSubmission }
                        onSubmit={ handleConnectorConfigFormSubmit }
                        type={ connectorMeta?.name }
                        enableSubmitButton={ false }
                    />
                }

                {
                    idpRoles &&
                    <OutboundProvisioningRoles
                        onSubmit={ handleOutboundProvisioningRoleMapping }
                        triggerSubmit={ triggerSubmission }
                        initialRoles={ idpRoles?.outboundProvisioningRoles }
                    />
                }

                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Button
                                primary
                                size="small"
                                onClick={ setTriggerSubmission }
                            >
                                Update
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
            : <ContentLoader/>
    );
};
