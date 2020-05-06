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
import { ConfirmationModal, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { getIdentityProviderList, updateApplicationConfigurations } from "../../../../api";
import { EmptyPlaceholderIllustrations } from "../../../../configs";
import {
    ApplicationInterface,
    IdentityProviderInterface,
    OutboundProvisioningConfigurationInterface,
    ProvisioningConfigurationInterface
} from "../../../../models";
import { AuthenticatorAccordion } from "../../../shared";
import { OutboundProvisioningIdpCreateWizard, OutboundProvisioningWizardIdpForm } from "../../wizard";

/**
 *  Provisioning Configurations for the Application.
 */
interface OutboundProvisioningConfigurationPropsInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
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
 *
 * @return {ReactElement}
 */
export const OutboundProvisioningConfiguration: FunctionComponent<OutboundProvisioningConfigurationPropsInterface> = (
    props: OutboundProvisioningConfigurationPropsInterface
): ReactElement => {

    const {
        application,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ idpList, setIdpList ] = useState<IdentityProviderInterface[]>(undefined);

    const [
        deletingIdp,
        setDeletingIdp
    ] = useState<OutboundProvisioningConfigurationInterface>(undefined);

    /**
     * Fetch the IDP list.
     */
    useEffect(() => {
        if (idpList) {
            return;
        }

        getIdentityProviderList()
            .then((response) => {
                setIdpList(response.identityProviders);
            });
    }, []);

    const addIdentityProvider = (id: string, values: any) => {
        updateApplicationConfigurations(id, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(application.id);
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
            application?.provisioningConfigurations?.outboundProvisioningIdps;

        const editedIDP = outboundConfigs.find(idp =>
            (idp.idp === values.idp) && (idp.connector === values.connector));
        outboundConfigs.splice(outboundConfigs.indexOf(editedIDP), 1);
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
        addIdentityProvider(application.id, updateConfiguration(values));
    };

    const handleProvisioningIDPDelete = (deletingIDP: OutboundProvisioningConfigurationInterface): void => {
        const outboundConfigs: OutboundProvisioningConfigurationInterface[] =
            application?.provisioningConfigurations?.outboundProvisioningIdps;
        outboundConfigs.splice(outboundConfigs.indexOf(deletingIDP), 1);
        const newConfig = {
            provisioningConfigurations: {
                outboundProvisioningIdps: outboundConfigs
            }
        };

        addIdentityProvider(application.id, newConfig);
        setShowDeleteConfirmationModal(false);
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
                application?.provisioningConfigurations?.outboundProvisioningIdps?.length > 0 ? (
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
                                    application?.provisioningConfigurations?.outboundProvisioningIdps?.map(
                                        (provisioningIdp) => {
                                        return (
                                            <AuthenticatorAccordion
                                                globalActions={ [
                                                    {
                                                        icon: "trash alternate",
                                                        onClick: (): void => {
                                                            setShowDeleteConfirmationModal(true);
                                                            setDeletingIdp(provisioningIdp);
                                                        },
                                                        type: "icon"
                                                    }
                                                ] }
                                                authenticators={
                                                    [
                                                        {
                                                            content: (
                                                                <OutboundProvisioningWizardIdpForm
                                                                    initialValues={ provisioningIdp }
                                                                    triggerSubmit={ null }
                                                                    onSubmit={ (values): void => {
                                                                        updateIdentityProvider(values)
                                                                    } }
                                                                    idpList={ idpList }
                                                                    isEdit={ true }
                                                                />
                                                            ),
                                                            id: provisioningIdp?.idp,
                                                            title: provisioningIdp?.idp
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
                        onPrimaryActionClick={
                            (): void => handleProvisioningIDPDelete(deletingIdp)
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
                        application={ application }
                        onUpdate={ onUpdate }
                    />
                )
            }
        </>
    )
};
