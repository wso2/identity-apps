/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, Form, Modal, ModalProps } from "semantic-ui-react";
import { AppState } from "../../../core";
import { shareApplication } from "../../../organizations/api";
import { OrganizationInterface } from "../../../organizations/models";

export interface ApplicationShareModalPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * ID of the application to be shared
     */
    applicationId: string;
    /**
     * Sub Organization list of the current organization.
     */
    subOrganizationList: Array<OrganizationInterface>
}

export const ApplicationShareModal: FunctionComponent<ApplicationShareModalPropsInterface> = (
    props: ApplicationShareModalPropsInterface
) => {

    const {
        applicationId,
        subOrganizationList,
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const dispatch = useDispatch();
    const currentOrganization = useSelector((state: AppState) => state.organization.organization);

    const [ selectedOrganization, setSelectedOrganization ] = useState<Array<string>>([]);

    const handleShareApplication = useCallback(() => {
        if (!selectedOrganization) {
            return;
        }

        shareApplication(currentOrganization.id, applicationId, selectedOrganization)
            .then((_response) => {
                onClose(null, null);
                dispatch(addAlert({
                    description: "Application Shared with the organization(s) successfully",
                    level: AlertLevels.SUCCESS,
                    message: "Application shared!"
                }));
            }).catch((error) => {
                onClose(null, null);
                if (error.response.data.message) {
                    dispatch(addAlert({
                        description: error.response.data.message,
                        level: AlertLevels.ERROR,
                        message: "Application sharing failed!"
                    }));
                } else {
                    dispatch(addAlert({
                        description: "Application sharing failed. Please try again",
                        level: AlertLevels.ERROR,
                        message: "Application sharing failed!"
                    }));
                }
            });
    }, [ selectedOrganization ]);

    return (
        <Modal
            closeOnDimmerClick
            dimmer="blurring"
            size="tiny"
            closeOnDocumentClick={ true }
            closeOnEscape={ true }
            data-testid={ `${componentId}-view-certificate-modal` }
            { ...rest }
        >
            <Modal.Header>
                Share Application
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Select
                        options={ subOrganizationList?.map((subOrganization) => {
                            return {
                                key: subOrganization.id,
                                text: subOrganization.name,
                                value: subOrganization.id
                            } as DropdownItemProps;
                        }) }
                        value={ selectedOrganization }
                        placeholder={ "Select Organization(s)" }
                        onChange={
                            (event, data) => {
                                setSelectedOrganization(data.value as string[]);
                            }
                        }
                        search
                        multiple
                        fluid
                        label={ "Select the list of organization to be shared with" }
                        data-testid={ `${componentId}-role-select-dropdown` }
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ () => onClose(null, null) }
                >
                    Cancel
                </LinkButton>
                <PrimaryButton
                    disabled={ !selectedOrganization }
                    onClick={ () => {
                        handleShareApplication();
                    } }
                    data-testid={ `${componentId}-save-button` }
                >
                    Share Application
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );

};

/**
 * Default props for the component.
 */
ApplicationShareModal.defaultProps = {
    "data-componentid": "application-share-modal"
};
