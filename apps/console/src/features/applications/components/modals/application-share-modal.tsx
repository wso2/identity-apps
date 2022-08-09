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
import { LinkButton, PrimaryButton, TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import differenceBy from "lodash-es/differenceBy";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, ModalProps } from "semantic-ui-react";
import { AppState, EventPublisher } from "../../../core";
import { shareApplication, stopSharingApplication } from "../../../organizations/api";
import { OrganizationInterface } from "../../../organizations/models";

export interface ApplicationShareModalPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * ID of the application to be shared
     */
    applicationId: string;
    /**
     * ClientId of the application
     */
    clientId?: string;
    /**
     * Sub Organization list of the current organization.
     */
    subOrganizationList: Array<OrganizationInterface>;
    /**
     * List of organization that this application is shared with.
     */
    sharedOrganizationList: Array<OrganizationInterface>;
}

export const ApplicationShareModal: FunctionComponent<ApplicationShareModalPropsInterface> = (
    props: ApplicationShareModalPropsInterface
) => {

    const {
        applicationId,
        subOrganizationList,
        sharedOrganizationList,
        clientId,
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const currentOrganization = useSelector((state: AppState) => state.organization.organization);

    const [ tempOrganizationList, setTempOrganizationList ] = useState<OrganizationInterface[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<OrganizationInterface[]>([]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => setTempOrganizationList(subOrganizationList || []),
        [ subOrganizationList ]);

    useEffect(() => setCheckedUnassignedListItems(sharedOrganizationList || []),
        [ sharedOrganizationList ]);

    const handleShareApplication = useCallback(() => {
        const addedOrganizations = differenceBy(checkedUnassignedListItems, sharedOrganizationList, "id")
            .map((organization) => organization.id);
        const removedOrganization = differenceBy(sharedOrganizationList, checkedUnassignedListItems, "id");

        if (addedOrganizations.length > 0) {
            shareApplication(currentOrganization.id, applicationId, addedOrganizations)
                .then((_response) => {
                    onClose(null, null);
                    dispatch(addAlert({
                        description: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".addSharingNotification.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".addSharingNotification.success.message")
                    }));
                    eventPublisher.publish("application-share", {
                        "client-id": clientId
                    });
                })
                .catch((error) => {
                    onClose(null, null);
                    if (error.response.data.message) {
                        dispatch(addAlert({
                            description: error.response.data.message,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.genericError.message")
                        }));
                    } else {
                        dispatch(addAlert({
                            description: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.genericError.description"),
                            level: AlertLevels.ERROR,
                            message:t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.genericError.message")
                        }));
                    }
                    eventPublisher.publish("application-share-error", {
                        "client-id": clientId
                    });
                });
        }

        removedOrganization.forEach((removedOrganization) => {
            stopSharingApplication(currentOrganization.id, applicationId, removedOrganization.id)
                .then((_response) => {
                    onClose(null, null);
                    dispatch(addAlert({
                        description: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".stopSharingNotification.success.description", { organization: removedOrganization.name }),
                        level: AlertLevels.SUCCESS,
                        message: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".stopSharingNotification.success.message")
                    }));
                    eventPublisher.publish("application-share", {
                        "client-id": clientId
                    });
                })
                .catch((error) => {
                    onClose(null, null);
                    if (error.response.data.message) {
                        dispatch(addAlert({
                            description: error.response.data.message,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".stopSharingNotification.genericError.message")
                        }));
                    } else {
                        dispatch(addAlert({
                            description: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".stopSharingNotification.genericError.description",
                            { organization: removedOrganization.name }
                            ),
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".stopSharingNotification.genericError.message")
                        }));
                    }
                    eventPublisher.publish("application-share-error", {
                        "client-id": clientId
                    });
                });
        });
    }, [ sharedOrganizationList, checkedUnassignedListItems, shareApplication, stopSharingApplication, dispatch,
        currentOrganization.id, applicationId, onClose ]);

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredOrganizationList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            subOrganizationList && subOrganizationList.map((organization) => {
                isMatch = re.test(organization.name);
                if (isMatch) {
                    filteredOrganizationList.push(organization);
                }
            });

            setTempOrganizationList(filteredOrganizationList);
        } else {
            setTempOrganizationList(subOrganizationList);
        }
    };

    const handleUnassignedItemCheckboxChange = (organization) => {
        const checkedOrganizations = [ ...checkedUnassignedListItems ];
        const index = checkedOrganizations.findIndex((org) => org.id === organization.id);

        if (index !== -1) {
            checkedOrganizations.splice(index, 1);
            setCheckedUnassignedListItems(checkedOrganizations);
        } else {
            checkedOrganizations.push(organization);
            setCheckedUnassignedListItems(checkedOrganizations);
        }
    };

    const handleHeaderCheckboxChange = useCallback(() => {
        if (checkedUnassignedListItems.length === subOrganizationList.length) {
            setCheckedUnassignedListItems([]);

            return;
        }

        setCheckedUnassignedListItems(subOrganizationList);
    }, [ subOrganizationList, setTempOrganizationList, checkedUnassignedListItems ]);

    return (
        <Modal
            closeOnDimmerClick
            dimmer="blurring"
            size="tiny"
            closeOnDocumentClick={ true }
            closeOnEscape={ true }
            data-testid={ `${componentId}-share-application-modal` }
            { ...rest }
        >
            <Modal.Header>
                { t("console:develop.features.applications.edit.sections.shareApplication.heading") }
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <TransferComponent
                        selectionComponent
                        searchPlaceholder={ t("console:manage.features.transferList.searchPlaceholder",
                            { type: "organizations" }) }
                        handleUnelectedListSearch={ handleUnselectedListSearch }
                        data-componentId="application-share-modal-organization-transfer-component"
                    >
                        <TransferList
                            isListEmpty={ !(tempOrganizationList?.length > 0) }
                            handleHeaderCheckboxChange={ handleHeaderCheckboxChange }
                            isHeaderCheckboxChecked={ checkedUnassignedListItems.length === subOrganizationList.length }
                            listType="unselected"
                            listHeaders={ [
                                t("console:manage.features.transferList.list.headers.1"), ""
                            ] }
                            emptyPlaceholderContent={ t("console:manage.features.transferList.list.emptyPlaceholders." +
                                "groups.unselected", { type: "organizations" }) }
                            data-testid="application-share-modal-organization-transfer-component-all-items"
                            emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                + "emptyPlaceholders.default") }
                        >
                            {
                                tempOrganizationList?.map((organization, index) => {
                                    const organizationName = organization?.name;
                                    const isChecked = checkedUnassignedListItems.findIndex((org) =>
                                        org.id === organization.id) !== -1;

                                    return (
                                        <TransferListItem
                                            handleItemChange={ () => handleUnassignedItemCheckboxChange(organization) }
                                            key={ index }
                                            listItem={ organizationName }
                                            listItemId={ organization.id }
                                            listItemIndex={ index }
                                            isItemChecked={ isChecked }
                                            showSecondaryActions={ false }
                                            data-testid="application-share-modal-organization-transfer-component
                                            -unselected-organizations"
                                        />
                                    );
                                })
                            }
                        </TransferList>
                    </TransferComponent>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ () => onClose(null, null) }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={ !checkedUnassignedListItems }
                    onClick={ () => {
                        handleShareApplication();
                    } }
                    data-testid={ `${componentId}-save-button` }
                >
                    { t("console:develop.features.applications.edit.sections.shareApplication.shareApplication") }
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
