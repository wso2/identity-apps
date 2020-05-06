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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    EmptyPlaceholder,
    GenericIconProps,
    PrimaryButton,
    UserAvatar
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import { InboundFormFactory } from "./forms";
import { ApplicationCreateWizard } from "./wizard";
import {
    deleteProtocol,
    getAuthProtocolMetadata,
    regenerateClientSecret,
    revokeClientSecret,
    updateAuthProtocolConfig
} from "../../api";
import { EmptyPlaceholderIllustrations, InboundProtocolLogos } from "../../configs";
import { FeatureConfigInterface, SupportedAuthProtocolMetaTypes, SupportedAuthProtocolTypes } from "../../models";
import { AppState } from "../../store";
import { setAuthProtocolMeta } from "../../store/actions";
import { AuthenticatorAccordion } from "../shared";

/**
 * Proptypes for the applications settings component.
 */
interface AccessConfigurationPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Currently editing application name.
     */
    appName: string;
    /**
     * Protocol configurations.
     */
    inboundProtocolConfig: any;
    /**
     *  Currently configured inbound protocols.
     */
    inboundProtocols: string[];
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     *  Is inbound protocol config request is still loading.
     */
    isInboundProtocolConfigRequestLoading: boolean;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param {AccessConfigurationPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AccessConfiguration: FunctionComponent<AccessConfigurationPropsInterface> = (
    props: AccessConfigurationPropsInterface
): ReactElement => {

    const {
        appId,
        appName,
        featureConfig,
        inboundProtocolConfig,
        inboundProtocols,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ protocolToDelete, setProtocolToDelete ] = useState<string>(undefined);

    /**
     * Handles the inbound config delete action.
     *
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be deleted.
     */
    const handleInboundConfigDelete = (protocol: string): void => {
        deleteProtocol(appId, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: `Successfully deleted the ${ protocol } protocol configurations.`,
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: "Delete error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting inbound protocol configurations.",
                    level: AlertLevels.ERROR,
                    message: "Delete error"
                }));
            });
    };

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be updated.
     */
    const handleInboundConfigFormSubmit = (values: any, protocol: string): void => {
        updateAuthProtocolConfig(appId, values, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the inbound protocol configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating inbound protocol configurations.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    /**
     *  Regenerate application.
     */
    const handleApplicationRegenerate = (): void => {
        regenerateClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully regenerated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Regenerate successful"
                }));
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Regenerate Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while regenerating the application",
                    level: AlertLevels.ERROR,
                    message: "Application Regenerate Error"
                }));
            });
    };

    /**
     * Revokes application.
     */
    const handleApplicationRevoke = (): void => {
        revokeClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully revoked the application",
                    level: AlertLevels.SUCCESS,
                    message: "Revoke successful"
                }));
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application revoke Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while revoking the application",
                    level: AlertLevels.ERROR,
                    message: "Application Revoke Error"
                }));
            });
    };

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     * @param {string} name - Protocol name.
     */
    const handleProtocolDeleteOnClick = (e: MouseEvent<HTMLDivElement>, name: string): void => {
        if (!name) {
            return;
        }

        const deletingProtocol = inboundProtocols
            .find((protocol) => protocol === name);

        if (!deletingProtocol) {
            return;
        }

        setProtocolToDelete(deletingProtocol);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Resolves the corresponding protocol config form when a
     * protocol is selected.
     * @return {React.ReactElement}
     */
    const resolveInboundProtocolSettingsForm = (): ReactElement => {
        return (inboundProtocolConfig
                ?
                <AuthenticatorAccordion
                    globalActions={ [
                        {
                            icon: "trash alternate",
                            onClick: handleProtocolDeleteOnClick,
                            type: "icon"
                        }
                    ] }
                    authenticators={
                        Object.keys(inboundProtocolConfig).map((protocol) => {
                            if (Object.values(SupportedAuthProtocolTypes)
                                .includes(protocol as SupportedAuthProtocolTypes)) {
                                return {
                                    actions: [],
                                    content: (
                                        <InboundFormFactory
                                            metadata={ authProtocolMeta[protocol] }
                                            initialValues={
                                                _.isEmpty(inboundProtocolConfig[protocol])
                                                    ? undefined : inboundProtocolConfig[protocol]
                                            }
                                            onSubmit={
                                                (values: any) => handleInboundConfigFormSubmit(values,
                                                    protocol)
                                            }
                                            type={ protocol as SupportedAuthProtocolTypes }
                                            onApplicationRegenerate={ handleApplicationRegenerate }
                                            onApplicationRevoke={ handleApplicationRevoke }
                                            readOnly={
                                                !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update
                                                )
                                            }
                                        />
                                    ),
                                    icon: { icon: InboundProtocolLogos[protocol], size: "micro" } as GenericIconProps,
                                    id: protocol,
                                    title: _.upperCase(protocol)
                                }
                            } else {
                                return {
                                    actions: [],
                                    content: (
                                        <InboundFormFactory
                                            metadata={ authProtocolMeta[protocol] }
                                            initialValues={
                                                _.isEmpty(inboundProtocolConfig[protocol])
                                                    ? undefined : inboundProtocolConfig[protocol]
                                            }
                                            onSubmit={
                                                (values: any) => handleInboundConfigFormSubmit(values,
                                                    protocol)
                                            }
                                            type={ SupportedAuthProtocolTypes.CUSTOM }
                                            readOnly={
                                                !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update
                                                )
                                            }
                                        />
                                    ),
                                    icon: {
                                        icon: (
                                            <UserAvatar
                                                name={ protocol }
                                                size="mini"
                                            />
                                        ),
                                        size: "nano"
                                    } as GenericIconProps,
                                    id: protocol,
                                    title: _.upperCase(protocol)
                                }
                            }
                        })
                    }
                /> : <ContentLoader/>
        )
    };

    /**
     * Use effect hook to be run when an inbound protocol is selected.
     */
    useEffect(() => {
        if (_.isEmpty(inboundProtocols)) {
            return;
        }

        inboundProtocols.map((selected) => {

            if (selected === SupportedAuthProtocolTypes.WS_FEDERATION) {
                return
            }

            const selectedProtocol = selected as SupportedAuthProtocolMetaTypes;

            // Check if the metadata for the selected auth protocol is available in redux store.
            // If not, fetch the metadata related to the selected auth protocol.
            if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedProtocol)) {
                getAuthProtocolMetadata(selectedProtocol)
                    .then((response) => {
                        dispatch(setAuthProtocolMeta(selectedProtocol, response));
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: "Retrieval error"
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: "An error occurred retrieving the protocol metadata.",
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));
                    });
            }
        })
    }, [ inboundProtocols ]);

    return (
        !isLoading
            ? (
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            {
                                inboundProtocols.length > 0
                                    ? hasRequiredScopes(
                                    featureConfig?.applications,
                                    featureConfig?.applications?.scopes?.update) && (
                                    <Button
                                        floated="right"
                                        primary
                                        onClick={ () => setShowWizard(true) }
                                    >
                                        <Icon name="add"/>New Protocol
                                    </Button>
                                )
                                    : (
                                        <EmptyPlaceholder
                                            action={
                                                hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update) && (
                                                    <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                        <Icon name="add"/>
                                                        New Protocol
                                                    </PrimaryButton>
                                                )
                                            }
                                            image={ EmptyPlaceholderIllustrations.newList }
                                            imageSize="tiny"
                                            title={ "Add a protocol" }
                                            subtitle={ [
                                                "There are currently no protocols available.",
                                                "You can add protocol easily by using the",
                                                "predefined templates."
                                            ] }
                                        />
                                    )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            { inboundProtocols?.length > 0 && resolveInboundProtocolSettingsForm() }
                        </Grid.Column>
                    </Grid.Row>
                    {
                        showWizard && (
                            <ApplicationCreateWizard
                                title={ "Add Protocol" }
                                subTitle={ `Add new protocol to ${ appName } application` }
                                closeWizard={ (): void => setShowWizard(false) }
                                addProtocol={ true }
                                selectedProtocols={ inboundProtocols }
                                onUpdate={ onUpdate }
                                appId={ appId }
                            />
                        )
                    }
                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="warning"
                                open={ showDeleteConfirmationModal }
                                assertion={ protocolToDelete }
                                assertionHint={ (
                                    <p>Please type <strong>{ protocolToDelete }</strong> to confirm.</p>
                                ) }
                                assertionType="input"
                                primaryAction="Confirm"
                                secondaryAction="Cancel"
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={
                                    (): void => {
                                        handleInboundConfigDelete(protocolToDelete);
                                        setShowDeleteConfirmationModal(false);
                                    }
                                }
                            >
                                <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                                <ConfirmationModal.Message attached warning>
                                    This action is irreversible and will permanently delete the protocol.
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content>
                                    If you delete this protocol, you will not be able to get it back. All the
                                    applications depending on this also might stop working. Please proceed with caution.
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </Grid>
            )
            : <ContentLoader/>
    );
};
