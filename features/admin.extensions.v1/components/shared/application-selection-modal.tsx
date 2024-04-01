/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { AxiosError } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Grid, Modal, ModalProps, PaginationProps } from "semantic-ui-react";
import { getApplicationList } from "../../../admin-applications-v1/api";
import { ApplicationList } from "../../../admin-applications-v1/components/application-list";
import { ApplicationListInterface } from "../../../admin-applications-v1/models";
import { AppConstants, UIConstants, history } from "../../../admin-core-v1";

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
 *
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

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ isApplicationListRequestLoading, setApplicationListRequestLoading ] = useState<boolean>(false);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getAppLists(listItemLimit, listOffset, null);
    }, [ listOffset, listItemLimit ]);

    /**
     * Retrieves the list of applications.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {

        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response: ApplicationListInterface) => {
                setAppList(response);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplications." +
                        "genericError.message")
                }));
            })
            .finally(() => {
                setApplicationListRequestLoading(false);
            });
    };

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
                    currentListSize={ appList.count }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    showPagination={ appList?.totalResults !== 0 }
                    totalPages={ Math.ceil(appList.totalResults / listItemLimit) }
                    totalListSize={ appList.totalResults }
                    data-testid={ `${ testId }-list-layout` }
                    showTopActionPanel={ false }
                >
                    <ApplicationList
                        isSetStrongerAuth
                        isLoading={ isApplicationListRequestLoading }
                        list={ appList }
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

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationSelectionModal;
