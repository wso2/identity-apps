/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, LinkButton, ListLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Grid, Modal, ModalProps, PaginationProps } from "semantic-ui-react";
import { getApplicationList } from "../../../features/applications/api";
import { ApplicationList } from "../../../features/applications/components";
import { ApplicationListInterface } from "../../../features/applications/models";
import { AppConstants, UIConstants, history } from "../../../features/core";

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
 * @param {ApplicationSelectionModalInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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

    const dispatch = useDispatch();

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
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {

        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response) => {
                setAppList(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchApplications" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplications." +
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
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {

        setListItemLimit(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
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
