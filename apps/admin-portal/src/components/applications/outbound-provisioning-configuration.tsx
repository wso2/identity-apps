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

import { AuthenticatorAccordion } from "../shared";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { ConfirmationModal, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import {
    ApplicationInterface,
    OutboundProvisioningConfigurationInterface,
    ProvisioningConfigurationInterface
} from "../../models";
import { AlertLevels } from "@wso2is/core/dist/src/models";
import { getApplicationDetails, updateApplicationConfigurations } from "../../api";
import { addAlert } from "@wso2is/core/dist/src/store";
import { useDispatch } from "react-redux";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { OutboundProvisioningIdpCreateWizard } from "./wizard/outbound-provisioning-idp-creation-wizard";
import { OutboundProvisioningWizardIdpForm } from "./wizard/outbound-provisioining-idp-wizard-form";

/**
 *  Provisioning Configurations for the Application.
 */
interface OutboundProvisioningConfigurationsPropsInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Current advanced configurations.
     */
    provisioningConfigurations: ProvisioningConfigurationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Provisioning configurations form component.
 *
 * @param {ProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const OutboundProvisioningConfigurations: FunctionComponent<OutboundProvisioningConfigurationsPropsInterface> = (
    props: OutboundProvisioningConfigurationsPropsInterface
): ReactElement => {

    const {
        appId,
        onUpdate,
    } = props;

    const dispatch = useDispatch();

    const [ editingApp, setEditingApp ] = useState<ApplicationInterface>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const [
        deletingIdp,
        setDeletingIdp
    ] = useState<OutboundProvisioningConfigurationInterface>(undefined);

    useEffect(() => {
        if (editingApp) {
            return;
        }

        getApplicationDetails(appId)
            .then((response: ApplicationInterface) => {
                setEditingApp(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving application details",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
    }, []);

    const addIdentityProvider = (id: string, values: any) => {
        updateApplicationConfigurations(id, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            })
    };

    const updateConfiguration = (values: any) => {
        const outboundConfigs: OutboundProvisioningConfigurationInterface[] =
            editingApp?.provisioningConfigurations?.outboundProvisioningIdps;
        outboundConfigs.push(values);
        return {
            provisioningConfigurations: {
                outboundProvisioningIdps: outboundConfigs
            }
        }
    };

    /**
     * Handles the final wizard submission.
     */
    const updateIdentityProvider = (values: any): void => {
        addIdentityProvider(editingApp.id, updateConfiguration(values));
    };

    return (
        <>
        <Heading as="h4">
            Outbound Provisioning
            <Heading subHeading as="h6">
                Configure an identity provider to outbound provision the users of this application.
            </Heading>
        </Heading>
        <Divider hidden/>
            {
                editingApp?.provisioningConfigurations?.outboundProvisioningIdps?.length > 0 ? (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <PrimaryButton floated="right" onClick={ () => setShowWizard(true) }>
                                    <Icon name="add"/>
                                    New Identity Provider
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    editingApp?.provisioningConfigurations?.outboundProvisioningIdps?.map((provisioningIdp) => {
                                        return (
                                            <AuthenticatorAccordion
                                                globalActions={ [
                                                    {
                                                        icon: "trash alternate",
                                                        onClick: null,
                                                        type: "icon"
                                                    }
                                                ] }
                                                authenticators={
                                                    [
                                                        {
                                                            content: (
                                                                <OutboundProvisioningWizardIdpForm
                                                                    initialValues={ {
                                                                        idp: provisioningIdp?.idp,
                                                                        connector: provisioningIdp?.connector,
                                                                        blocking: provisioningIdp?.blocking ? "blocking" : "",
                                                                        rules: provisioningIdp?.rules ? "rules" : "",
                                                                        jit: provisioningIdp?.jit ? "jit" : ""
                                                                    } }
                                                                    triggerSubmit={ null }
                                                                    onSubmit={ (values): void => {
                                                                        updateIdentityProvider(values)
                                                                    } }
                                                                    idpList={ null }
                                                                    isEdit={ true }
                                                                />
                                                            ),
                                                            id: provisioningIdp?.idp,
                                                            title: provisioningIdp?.idp,
                                                        }
                                                    ]
                                                }
                                            />
                                        )
                                    })
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 8 }>
                                <Segment>
                                    <EmptyPlaceholder
                                        title="No outbound provisioning IDPs"
                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                        subtitle={ [ "This Application has no outbound provisioning IDPs configured." +
                                        " Add an IDP to view it here." ] }
                                        imageSize="tiny"
                                        action={ (
                                            <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                <Icon name="add"/>
                                                New IDP
                                            </PrimaryButton>
                                        ) }
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            {
                deletingIdp && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIdp?.idp }
                        assertionHint={ (
                            <p>Please type <strong>{ deletingIdp?.idp }</strong> to confirm.</p>
                        ) }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ null
                            // (): void => handleDeleteConnector(deletingIdp)
                        }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will remove the IDP.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this outbound provisioning IDP, you will not be able to get it back.
                            Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showWizard && (
                    <OutboundProvisioningIdpCreateWizard
                        closeWizard={ () => setShowWizard(false) }
                        application={ editingApp }
                        onUpdate={ onUpdate }
                    />
                )
            }
        </>
    )
};
