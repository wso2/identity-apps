/* eslint-disable max-len */
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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Icon, List, ListItemProps, SemanticWIDTHS } from "semantic-ui-react";
import { AppConstants, EmptyPlaceholderIllustrations, UIConstants, history } from "../../core";
// import organization from "../../data/disableOrganization";
import { OrganisationBasicInterface, OrganisationListInterface } from "../models";
/**
 * Prop types for the liked accounts component.
 */
interface OrganisationListProps extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Width of the action panel column.
     */
    actionsColumnWidth?: SemanticWIDTHS;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * User delete callback.
     *
     * @param {string} userId - ID of the deleting user.
     */
    handleOrganisationDelete?: (userId: string) => void;
    /**
     * Callback to be fired when the empty list placeholder action is clicked.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    organisationsList: OrganisationListInterface;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;

    listView?: boolean;
}

/**
 * Users info page.
 *
 * @return {ReactElement}
 */
export const OrganisationList: React.FunctionComponent<OrganisationListProps> = (props: OrganisationListProps): ReactElement => {
    const {
        actionsColumnWidth,
        descriptionColumnWidth,
        isLoading,
        handleOrganisationDelete,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        metaColumnWidth,
        searchQuery,
        selection,
        showListItemActions,
        showMetaContent,
        organisationsList,
        listView,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganisation, setDeletingOrganisation ] = useState<OrganisationBasicInterface>(undefined);
    const [organization] = useState([]);

    const deleteOrganisation = (id: string): void => {
        handleOrganisationDelete(id);
        setDeletingOrganisation(undefined);
        setShowDeleteConfirmationModal(false);
    };

    const handleOrganisationEdit = (userId: string) => {
        history.push(AppConstants.PATHS.get("ORGANISATION_EDIT").replace(":id", userId));
    };

    /**
     * The following function generate the meta list items by mapping the
     * meta content columns selected by the user to the user details.
     *
     * @param user - OrganisationBasicInterface
     */

    const listContent = (organisationsList) => {

        if(organisationsList){
            return (
                <Grid>
                
                <Grid.Column width={ 5 }>
                    <List.Content>
                    { organisationsList.parent?(
                        <List.Description className="list-item-meta">
                            { organisationsList.parent.name }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}  
                    </List.Content>
                </Grid.Column>
                <Grid.Column width={ 3 }>
                    <List.Content>
                    { organisationsList.attributes?(
                        <List.Description className="list-item-meta">
                            { organisationsList.attributes[0]?.value }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>
                <Grid.Column width={ 4 }>
                    <List.Content>
                    { organisationsList.status?(
                        <List.Description className="list-item-meta meta-status">
                            { organisationsList.status }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>
                </Grid>
            )
        }

    };

    const rootOrganizationDisable = (orgName) => {
        let organizationEdit = true
        organization.map((value) => {
          if(orgName == value.value)
          {
            organizationEdit = false;
          }
        })
        return organizationEdit;
    };

    const editDeleteFunctions = () => {
        
        return(
            organisationsList && organisationsList instanceof Array && organisationsList.length > 0
                        ? organisationsList.map((organisation, index) => (
                            <ResourceListItem
                                key={ index }
                                
                                actions={
                                    showListItemActions
                                        ? 
                                        permissions(organisation.permissions, organisation.name, organisation.id, organisation): []
                                }
                                actionsFloated="right"
                                avatar={ listView ? (
                                    <UserAvatar
                                        name={ organisation.name ? organisation.name: "" }
                                        size="mini"
                                        floated="left"
                                    />
                                ) : null }
                                itemHeader={ organisation.name ? organisation.name: "" }
                                itemDescription={ listView ? organisation.name : null }
                                metaContent={ showMetaContent ? listContent(organisation) : null }
                                metaColumnWidth={ metaColumnWidth }
                                descriptionColumnWidth={ descriptionColumnWidth }
                                actionsColumnWidth={ actionsColumnWidth }
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                onClick={ (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                    if (!selection) {
                                        return;
                                    }

                                    handleOrganisationEdit(organisation.id);
                                    //onListItemClick(event, data);
                                } }
                            />
                        ))
                        : showPlaceholders()
        )

     };

     const permissions = (response, orgName, OrgId, organisation) => {
         const permitionArray = [];
         let userUpdate = false;
         let userView = false;
         let userDelete = false;
       
       if(response && response.length > 0){
          response.map((value) => {
             if(value == "/permission/admin/manage/identity/organizationmgt/update"){
                userUpdate = true;
             }else if(value == "/permission/admin/manage/identity/organizationmgt/view"){
                userView = true;
             }else if(value == "/permission/admin/manage/identity/organizationmgt/delete"){
                userDelete = true;
             }
          }
         )
         if(userUpdate && userView){
            permitionArray.push(
                {
                    "data-testid": `${ testId }-edit-user-${ orgName }-button`,
                    icon: rootOrganizationDisable(orgName)? "pencil alternate": "eye",
                    onClick: () => handleOrganisationEdit(OrgId),
                    popupText: rootOrganizationDisable(orgName)? "Edit": "View",
                    type: "button"
                }
            );
         }else if(!userUpdate && userView){
            permitionArray.push(
                    {
                        "data-testid": `${ testId }-edit-user-${ orgName }-button`,
                        icon: "eye",
                        onClick: () => handleOrganisationEdit(OrgId),
                        popupText: "View",
                        type: "button"
                    }
                )
         }
         
         if(userDelete && rootOrganizationDisable(orgName)){
            permitionArray.push(
                {
                    "data-testid": `${ testId }-delete-user-${ orgName }-button`,
                    hidden: orgName === "admin",
                    icon: "trash alternate",
                    onClick: (): void => {
                        setShowDeleteConfirmationModal(true);
                        setDeletingOrganisation(organisation);
                    },
                    popupText: t("adminPortal:components.users.usersList.list" +
                                ".iconPopups.delete"),
                    type: "button"
                }
            )
         }

        } 
        return permitionArray;
     };

    const listHeader = () => {
        return(
            <div role="listitem" className="item resource-list-item grid-header-wrapper" data-testid="resource-list-item">
        <Grid>    
       <Grid.Column width={ metaColumnWidth }>
        <Grid>
    
            <Grid.Column width={ 4 }>
              <List.Content>
                <List.Description className="list-item-meta">
                Organisation Name      
                </List.Description>
              </List.Content>
            </Grid.Column>
            
            <Grid.Column width={ 5 }>
              <List.Content>
                <List.Description className="list-item-meta meta-pare parent-name-meta">
                Parent Organisation Name
                </List.Description>
              </List.Content>
            </Grid.Column>

            <Grid.Column width={ 3 }>
              <List.Content>
                <List.Description className="list-item-meta org-list-head">
                Type
                </List.Description>
              </List.Content>
            </Grid.Column>

            <Grid.Column width={ 4 }>
              <List.Content>
                <List.Description className="list-item-meta org-list-head status-head">
                Organisation Status     
                </List.Description>
              </List.Content>
            </Grid.Column>
       </Grid>    
       </Grid.Column>
       </Grid>    
       </div>
        );
    }

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (organisationsList.length < 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ testId }-empty-placeholder-add-organisation-button` }
                            onClick={ () => onEmptyListPlaceholderActionClick() }
                        >
                            <Icon name="add"/>
                            { "Create Organisation" }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Create Sub Organisation" }
                    subtitle={ [
                        "There are currently organisations available.",
                        "You can add a new organisation easily by following the",
                        "steps in the organisation creation wizard."
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="application-list organisation-list"
                isLoading={ isLoading }
                
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                selection={ selection }
            >
            { !listView ? listHeader() : null }
                {
                    editDeleteFunctions()
                }
            </ResourceList>
          { 
                deletingOrganisation && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingOrganisation.name }
                        assertionHint={
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "adminPortal:components.user.deleteUser.confirmationModal." +
                                        "assertionHint" }
                                        tOptions={ { userName: deletingOrganisation.name } }
                                    >
                                        Please type <strong>{ deletingOrganisation.name }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => deleteOrganisation(deletingOrganisation.id) }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("adminPortal:components.user.deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { "This action is irreversible and will permanently delete the organisation." }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-confirmation-modal-content` }>
                            { "If you delete this organisation, you will not be able to get it back. Please proceed with caution." }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
OrganisationList.defaultProps = {
    actionsColumnWidth: 2,
    descriptionColumnWidth: 3,
    metaColumnWidth: 11,
    showListItemActions: true,
    showMetaContent: true
};
