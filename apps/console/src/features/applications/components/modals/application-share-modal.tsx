/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
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
    Segment,
    Transition
} from "semantic-ui-react";
import { AppState, EventPublisher } from "../../../core";
import {
    getOrganizations,
    getSharedOrganizations,
    shareApplication,
    stopSharingApplication,
    unshareApplication
} from "../../../organizations/api";
import {
    OrganizationInterface,
    OrganizationListInterface,
    OrganizationResponseInterface,
    ShareApplicationRequestInterface
} from "../../../organizations/models";

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
     * Callback when the application sharing completed.
     */
    onApplicationSharingCompleted: () => void;
}

export const ApplicationShareModal: FunctionComponent<ApplicationShareModalPropsInterface> = (
    props: ApplicationShareModalPropsInterface
) => {
    const {
        applicationId,
        clientId,
        onApplicationSharingCompleted,
        onClose,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const [ tempOrganizationList, setTempOrganizationList ] = useState<OrganizationInterface[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<OrganizationInterface[]>([]);
    const [ shareType, setShareType ] = useState<ShareType>(ShareType.SHARE_ALL);
    const [ subOrganizationList, setSubOrganizationList ] = useState<Array<OrganizationInterface>>([]);
    const [ sharedOrganizationList, setSharedOrganizationList ] = useState<Array<OrganizationInterface>>([]);
    const [ filter, setFilter ] = useState<string>();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => setTempOrganizationList(subOrganizationList || []), [
        subOrganizationList
    ]);

    useEffect(
        () => setCheckedUnassignedListItems(sharedOrganizationList || []),
        [ sharedOrganizationList ]
    );

    /**
     * Load the list of sub organizations under the current organization & list of already shared organizations of the
     * application for application sharing.
     */
    useEffect(() => {
        if (!open || !isOrganizationManagementEnabled) {
            return;
        }

        getOrganizations(
            null,
            null,
            null,
            null,
            true,
            false
        ).then((response: OrganizationListInterface) => {
            setSubOrganizationList(response.organizations);
        }).catch((error: IdentityAppsError) => {
            if (error?.description) {
                dispatch(
                    addAlert({
                        description: error.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "organizations:notifications." +
                                "getOrganizationList.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t(
                        "organizations:notifications.getOrganizationList" +
                            ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "organizations:notifications." +
                            "getOrganizationList.genericError.message"
                    )
                })
            );
        });

        getSharedOrganizations(
            currentOrganization.id,
            applicationId
        ).then((response: AxiosResponse) => {
            setSharedOrganizationList(response.data.organizations);
        }).catch((error: IdentityAppsApiException) => {
            if (error.response.data.description) {
                dispatch(
                    addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.edit.sections.shareApplication" +
                                ".getSharedOrganizations.genericError.message")
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".getSharedOrganizations.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.edit.sections.shareApplication" +
                            ".getSharedOrganizations.genericError.message")
                })
            );
        }
        );
    }, [ getOrganizations, open ]);

    const handleShareApplication: () => Promise<void> = useCallback(async () => {
        let shareAppData: ShareApplicationRequestInterface;
        let removedOrganization: OrganizationInterface[];

        if (shareType === ShareType.SHARE_ALL) {
            shareAppData = {
                shareWithAllChildren: true
            };
        } else if (shareType === ShareType.SHARE_SELECTED) {
            let addedOrganizations: string[];

            if (shareType) {
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
            setFilter(value);
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
            isLoading={ true }
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
                <Heading ellipsis as="h6">
                    { t("organizations:shareApplicationSubTitle") }
                </Heading>
                <Segment basic>
                    <Radio
                        label={ t(
                            "organizations:shareApplicationRadio"
                        ) }
                        onChange={ () => setShareType(ShareType.SHARE_ALL) }
                        checked={ shareType === ShareType.SHARE_ALL }
                        data-componentid={ `${ componentId }-share-with-all-checkbox` }
                    />
                    <Hint popup inline>
                        { t(
                            "organizations:shareApplicationInfo"
                        ) }
                    </Hint>
                    <Divider hidden className="mb-1 mt-0" />
                    <Radio
                        label={ t(
                            "organizations:shareWithSelectedOrgsRadio"
                        ) }
                        onChange={ () => setShareType(ShareType.SHARE_SELECTED) }
                        checked={ shareType === ShareType.SHARE_SELECTED }
                        data-componentid={ `${ componentId }-share-with-all-checkbox` }
                    />
                    <Transition
                        visible={ shareType === ShareType.SHARE_SELECTED }
                        animation="slide down"
                        duration={ 1000 }
                    >
                        <TransferComponent
                            className="pl-2"
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
                                emptyPlaceholderContent={
                                    t("console:develop.placeholders.emptySearchResult.subtitles.0",
                                        { query: filter }) + ". " +
                                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                                }
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
                    </Transition>
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    data-testid={ `${ componentId }-cancel-button` }
                    onClick={ () => onApplicationSharingCompleted() }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={
                        shareType === ShareType.SHARE_SELECTED &&
                        (checkedUnassignedListItems?.length == 0 || !subOrganizationList)
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
