/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, LinkButton, ListLayout } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Grid, Modal, ModalProps, PaginationProps } from "semantic-ui-react";
import { useApplicationList } from "@wso2is/admin.applications.v1/api";
import { ApplicationList } from "@wso2is/admin.applications.v1/components/application-list";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import {
    ApplicationListInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import { AppConstants, UIConstants, history } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";

/**
 * Proptypes for the application selection modal component.
 */
interface ApplicationSelectionModalInterface extends ModalProps,
    TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Heading for the modal.
     */
    heading?: ReactNode;
    /**
     * Sub Heading for the modal.
     */
    subHeading?: ReactNode;
}

/**
 * Application selection modal component.
 *
 * @param props - Props injected to the component.
 * @returns Application selection modal component.
 */
const ApplicationSelectionModal: FunctionComponent<ApplicationSelectionModalInterface> = (
    props: ApplicationSelectionModalInterface
): ReactElement => {

    const {
        open,
        onClose,
        heading,
        subHeading,
        [ "data-testid" ]: testId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { UIConfig } = useUIConfig();

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList("clientId", listItemLimit, listOffset, null);

    /**
     * Handles the application list fetch request error.
     */
    useEffect(() => {

        if (!applicationListFetchRequestError) {
            return;
        }

        if (applicationListFetchRequestError?.response
                && applicationListFetchRequestError?.response?.data
                && applicationListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: applicationListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchApplications.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplications" +
                    ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplications.genericError.message")
        }));
    }, [ applicationListFetchRequestError ]);

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {

        setListItemLimit(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {

        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Filter out the system apps from the application list.
     *
     * @returns Filtered application list.
     */
    const filteredApplicationList: ApplicationListInterface = useMemo(() => {
        if (applicationList?.applications) {
            const appList: ApplicationListInterface = cloneDeep(applicationList);

            // Remove the system apps from the application list.
            if (!UIConfig?.legacyMode?.applicationListSystemApps) {
                appList.applications = appList.applications.filter((item: ApplicationListItemInterface) =>
                    !ApplicationManagementConstants.SYSTEM_APPS.includes(item.name)
                    && !ApplicationManagementConstants.DEFAULT_APPS.includes(item.name)
                );
                appList.count = appList.count - (applicationList.applications.length - appList.applications.length);
                appList.totalResults = appList.totalResults -
                    (applicationList.applications.length - appList.applications.length);
            }

            return appList;
        }

        return {
            applications: [],
            count: 0,
            startIndex: 1,
            totalResults: 0
        };
    }, [ applicationList ]);

    return (
        <Modal
            data-testid={ testId }
            open={ open }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="large"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { heading }
                <Heading as="h6">
                    { subHeading }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                <ListLayout
                    isLoading={ isApplicationListFetchRequestLoading }
                    currentListSize={ filteredApplicationList?.count }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    showPagination={ filteredApplicationList?.totalResults !== 0 }
                    totalPages={ Math.ceil(filteredApplicationList?.totalResults / listItemLimit) }
                    totalListSize={ filteredApplicationList?.totalResults }
                    data-testid={ `${ testId }-list-layout` }
                    showTopActionPanel={ false }
                >
                    <ApplicationList
                        isSetStrongerAuth
                        isLoading={ isApplicationListFetchRequestLoading }
                        list={ filteredApplicationList }
                        onEmptyListPlaceholderActionClick={ () => {
                            history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                        } }
                        isRenderedOnPortal={ true }
                        data-testid={ `${ testId }-list` }
                        data-componentid={ componentId }
                    />
                </ListLayout>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${ testId }-cancel-button` }
                                floated="left"
                                onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {
                                    onClose(e, null);
                                } }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
ApplicationSelectionModal.defaultProps = {
    "data-componentid": "application",
    "data-testid": "application-selection-modal",
    heading: "Add strong authentication",
    subHeading: "Select an application you want to add stronger authentication"
};

export default ApplicationSelectionModal;
