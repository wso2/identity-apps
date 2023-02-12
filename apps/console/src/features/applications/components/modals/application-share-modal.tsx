/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Hint,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import differenceBy from "lodash-es/differenceBy";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FormEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Divider,
    Modal,
    ModalProps,
    Radio,
    Segment
} from "semantic-ui-react";
import { AppState, EventPublisher } from "../../../core";
import {
    shareApplication,
    stopSharingApplication,
    unshareApplication
} from "../../../organizations/api";
import {
    OrganizationInterface,
    OrganizationResponseInterface,
    ShareApplicationRequestInterface
} from "../../../organizations/models";
import { ShareWithOrgStatus } from "../../constants";

enum ShareType {
    SHARE_ALL,
    SHARE_SELECTED,
    UNSHARE
}

export interface ApplicationShareModalPropsInterface
    extends ModalProps,
    IdentifiableComponentInterface {
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
    /**
     * Callback when the application sharing completed.
     */
    onApplicationSharingCompleted: () => void;
    /**
     * Specifies if the application is shared with all suborganizations.
     */
    isSharedWithAll?: ShareWithOrgStatus;
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
        onApplicationSharingCompleted,
        isSharedWithAll,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const [ tempOrganizationList, setTempOrganizationList ] = useState<
        OrganizationInterface[]
    >([]);
    const [
        checkedUnassignedListItems,
        setCheckedUnassignedListItems
    ] = useState<OrganizationInterface[]>([]);
    const [ shareType, setShareType ] = useState<ShareType>(
        ShareType.SHARE_SELECTED
    );
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (isSharedWithAll === ShareWithOrgStatus.TRUE) {
            setShareType(ShareType.SHARE_ALL);
        } else if ((!sharedOrganizationList || sharedOrganizationList?.length === 0) &&
            isSharedWithAll === ShareWithOrgStatus.FALSE
        ) {
            setShareType(ShareType.UNSHARE);
        } else {
            setShareType(ShareType.SHARE_SELECTED);
        }
    }, [ isSharedWithAll, sharedOrganizationList ]);

    useEffect(() => setTempOrganizationList(subOrganizationList || []), [
        subOrganizationList
    ]);

    useEffect(
        () => setCheckedUnassignedListItems(sharedOrganizationList || []),
        [ sharedOrganizationList ]
    );

    const handleShareApplication: () => Promise<void> = useCallback(async () => {
        let shareAppData: ShareApplicationRequestInterface;
        let removedOrganization: OrganizationInterface[];

        if (shareType === ShareType.SHARE_ALL) {
            shareAppData = {
                shareWithAllChildren: true
            };
        } else if (shareType === ShareType.SHARE_SELECTED) {
            let addedOrganizations: string[];

            if (isSharedWithAll === ShareWithOrgStatus.TRUE) {
                addedOrganizations = checkedUnassignedListItems.map((org: OrganizationInterface) => org.id);

                await unshareApplication(applicationId, currentOrganization.id);

            } else {
                addedOrganizations = differenceBy(
                    checkedUnassignedListItems,
                    sharedOrganizationList,
                    "id"
                ).map((organization: OrganizationInterface) => organization.id);

                removedOrganization = differenceBy(
                    sharedOrganizationList,
                    checkedUnassignedListItems,
                    "id"
                );
            }

            shareAppData = {
                shareWithAllChildren: false,
                sharedOrganizations: addedOrganizations
            };
        }

        if(shareType === ShareType.SHARE_ALL || shareType === ShareType.SHARE_SELECTED) {
            shareApplication(
                currentOrganization.id,
                applicationId,
                shareAppData
            )
                .then(() => {
                    onClose(null, null);
                    dispatch(
                        addAlert({
                            description: t(
                                "console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.success.message"
                            )
                        })
                    );
                    eventPublisher.publish("application-share", {
                        "client-id": clientId
                    });
                })
                .catch((error: AxiosError) => {
                    onClose(null, null);
                    if (error.response.data.message) {
                        dispatch(
                            addAlert({
                                description: error.response.data.message,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    } else {
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    }
                    eventPublisher.publish("application-share-error", {
                        "client-id": clientId
                    });
                })
                .finally(() => onApplicationSharingCompleted());

            removedOrganization?.forEach((removedOrganization: OrganizationInterface) => {
                stopSharingApplication(
                    currentOrganization.id,
                    applicationId,
                    removedOrganization.id
                )
                    .then(() => {
                        onClose(null, null);
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".stopSharingNotification.success.description",
                                    { organization: removedOrganization.name }
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".stopSharingNotification.success.message"
                                )
                            })
                        );
                        eventPublisher.publish("application-share", {
                            "client-id": clientId
                        });
                    })
                    .catch((error: AxiosError) => {
                        onClose(null, null);
                        if (error.response.data.message) {
                            dispatch(
                                addAlert({
                                    description: error.response.data.message,
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "console:develop.features.applications.edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.message"
                                    )
                                })
                            );
                        } else {
                            dispatch(
                                addAlert({
                                    description: t(
                                        "console:develop.features.applications.edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.description",
                                        {
                                            organization:
                                                removedOrganization.name
                                        }
                                    ),
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "console:develop.features.applications.edit.sections.shareApplication" +
                                        ".stopSharingNotification.genericError.message"
                                    )
                                })
                            );
                        }
                        eventPublisher.publish("application-share-error", {
                            "client-id": clientId
                        });
                    });
            });
        } else if (shareType === ShareType.UNSHARE) {
            unshareApplication(applicationId, currentOrganization.id)
                .then(() => {
                    onClose(null, null);
                    dispatch(
                        addAlert({
                            description: t(
                                "console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "console:develop.features.applications.edit.sections.shareApplication" +
                                ".addSharingNotification.success.message"
                            )
                        })
                    );
                    eventPublisher.publish("application-share", {
                        "client-id": clientId
                    });
                })
                .catch((error: AxiosError) => {
                    onClose(null, null);
                    if (error.response.data.message) {
                        dispatch(
                            addAlert({
                                description: error.response.data.message,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    } else {
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:develop.features.applications.edit.sections.shareApplication" +
                                    ".addSharingNotification.genericError.message"
                                )
                            })
                        );
                    }
                    eventPublisher.publish("application-share-error", {
                        "client-id": clientId
                    });
                })
                .finally(() => onApplicationSharingCompleted());
        }
    }, [
        sharedOrganizationList,
        checkedUnassignedListItems,
        stopSharingApplication,
        dispatch,
        currentOrganization.id,
        applicationId,
        onClose,
        shareType
    ]);

    const handleUnselectedListSearch = (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch: boolean = false;
        const filteredOrganizationList: OrganizationInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            subOrganizationList &&
                subOrganizationList.map((organization: OrganizationInterface) => {
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

    const handleUnassignedItemCheckboxChange = (organization: OrganizationInterface) => {
        const checkedOrganizations: OrganizationInterface[] = [ ...checkedUnassignedListItems ];
        const index: number = checkedOrganizations.findIndex(
            (org: OrganizationInterface) => org.id === organization.id
        );

        if (index !== -1) {
            checkedOrganizations.splice(index, 1);
            setCheckedUnassignedListItems(checkedOrganizations);
        } else {
            checkedOrganizations.push(organization);
            setCheckedUnassignedListItems(checkedOrganizations);
        }
    };

    const handleHeaderCheckboxChange: () => void = useCallback(() => {
        if (checkedUnassignedListItems.length === subOrganizationList.length) {
            setCheckedUnassignedListItems([]);

            return;
        }

        setCheckedUnassignedListItems(subOrganizationList);
    }, [
        subOrganizationList,
        setTempOrganizationList,
        checkedUnassignedListItems
    ]);

    return (
        <Modal
            closeOnDimmerClick
            dimmer="blurring"
            size="tiny"
            closeOnDocumentClick={ true }
            closeOnEscape={ true }
            data-testid={ `${ componentId }-share-application-modal` }
            { ...rest }
        >
            <Modal.Header>
                { t(
                    "console:develop.features.applications.edit.sections.shareApplication.heading"
                ) }
            </Modal.Header>
            <Modal.Content>
                <Segment basic>
                    <Radio
                        label={ t(
                            "console:manage.features.organizations.shareWithSelectedOrgsRadio"
                        ) }
                        onChange={ () => setShareType(ShareType.SHARE_SELECTED) }
                        checked={ shareType === ShareType.SHARE_SELECTED }
                        data-componentid={ `${ componentId }-share-with-all-checkbox` }
                    />
                    <TransferComponent
                        disabled={ shareType !== ShareType.SHARE_SELECTED }
                        selectionComponent
                        searchPlaceholder={ t(
                            "console:manage.features.transferList.searchPlaceholder",
                            { type: "organizations" }
                        ) }
                        handleUnelectedListSearch={
                            handleUnselectedListSearch
                        }
                        data-componentId="application-share-modal-organization-transfer-component"
                        className="share-app-modal"
                    >
                        <TransferList
                            disabled={
                                shareType !== ShareType.SHARE_SELECTED
                            }
                            isListEmpty={
                                !(tempOrganizationList?.length > 0)
                            }
                            handleHeaderCheckboxChange={
                                handleHeaderCheckboxChange
                            }
                            isHeaderCheckboxChecked={
                                checkedUnassignedListItems?.length ===
                                    subOrganizationList?.length
                            }
                            listType="unselected"
                            listHeaders={ [
                                t(
                                    "console:manage.features.transferList.list.headers.1"
                                ),
                                ""
                            ] }
                            emptyPlaceholderContent={ t(
                                "console:manage.features.transferList.list.emptyPlaceholders." +
                                    "groups.unselected",
                                { type: "organizations" }
                            ) }
                            data-testid="application-share-modal-organization-transfer-component-all-items"
                            emptyPlaceholderDefaultContent={ t(
                                "console:manage.features.transferList.list." +
                                    "emptyPlaceholders.default"
                            ) }
                        >
                            { tempOrganizationList?.map(
                                (organization: OrganizationInterface, index: number) => {
                                    const organizationName: string =
                                            organization?.name;
                                    const isChecked: boolean =
                                            checkedUnassignedListItems.findIndex(
                                                (org: OrganizationInterface) =>
                                                    org.id === organization.id
                                            ) !== -1;

                                    return (
                                        <TransferListItem
                                            disabled={
                                                shareType !==
                                                    ShareType.SHARE_SELECTED
                                            }
                                            handleItemChange={ () =>
                                                handleUnassignedItemCheckboxChange(
                                                    organization
                                                )
                                            }
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
                                }
                            ) }
                        </TransferList>
                    </TransferComponent>
                    <Divider hidden />
                    <Radio
                        label={ t(
                            "console:manage.features.organizations.shareApplicationRadio"
                        ) }
                        onChange={ () => setShareType(ShareType.SHARE_ALL) }
                        checked={ shareType === ShareType.SHARE_ALL }
                        data-componentid={ `${ componentId }-share-with-all-checkbox` }
                    />
                    <Hint>
                        { t(
                            "console:manage.features.organizations.shareApplicationInfo"
                        ) }
                    </Hint>
                    <Divider hidden />
                    <Radio
                        label={ t(
                            "console:manage.features.organizations.unshareApplicationRadio"
                        ) }
                        onChange={ () => setShareType(ShareType.UNSHARE) }
                        checked={ shareType === ShareType.UNSHARE }
                        data-componentid={ `${ componentId }-share-with-all-checkbox` }
                    />
                    <Hint>
                        { t(
                            "console:manage.features.organizations.unshareApplicationInfo"
                        ) }
                    </Hint>
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ () => onClose(null, null) }>
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={ 
                        !checkedUnassignedListItems || 
                        (shareType === ShareType.SHARE_SELECTED && !subOrganizationList) 
                    }
                    onClick={ () => {
                        handleShareApplication();
                    } }
                    data-testid={ `${ componentId }-save-button` }
                >
                    { t(
                        "console:develop.features.applications.edit.sections.shareApplication.shareApplication"
                    ) }
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
