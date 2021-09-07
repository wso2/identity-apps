/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, { ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, List, ListItemProps, SemanticWIDTHS } from "semantic-ui-react";
import { EmptyPlaceholderIllustrations } from "../../core";
// import organization from "../../data/disableOrganization";
import { OrganisationBasicInterface, OrganisationListInterface } from "../models";

/**
 * Prop types for the liked accounts component.
 */
interface SubOrganisationListProps extends LoadableComponentInterface, TestableComponentInterface {
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
    subOrganisationsList: OrganisationListInterface;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;

    listView?: boolean;

    setShowSubOrgDetails?: any;

    organisation?: any;

    setShowWizard?: (show: boolean) => void;

    suborganisationListGet?: (limit: number, offset: number, $filter: string, attribute: string, domain: string) => void;

    listItemLimit?: number;

    parentNameFilter?: string;

    typeAttribute?: string;

    listOffset?: number;

    isLoading?: boolean;

    parentName?: string;
}

/**
 * Users info page
 *
 * @return {ReactElement}
 */
export const SubOrganisationList: React.FunctionComponent<SubOrganisationListProps> = (props: SubOrganisationListProps): ReactElement => {
    const {
        actionsColumnWidth,
        descriptionColumnWidth,
        defaultListItemLimit,
        isLoading,
        handleOrganisationDelete,
        onSearchQueryClear,
        metaColumnWidth,
        searchQuery,
        selection,
        showListItemActions,
        showMetaContent,
        subOrganisationsList,
        organisation,
        listView,
        setShowSubOrgDetails,
        setShowWizard,
        suborganisationListGet,
        listItemLimit,
        parentNameFilter,
        typeAttribute,
        listOffset,
        parentName,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganisation, setDeletingOrganisation ] = useState<OrganisationBasicInterface>(undefined);
    const [organizationView, setOrganizationView] = useState<boolean>(false);
    const [organizationDelete, setOrganizationDelete] = useState<boolean>(false);
    const [organizationUpdate, setOrganizationUpdate] = useState<boolean>(false);

    const [organization] = useState([]);

    const deleteOrganisation = (id: string): void => {
        handleOrganisationDelete(id);
        setDeletingOrganisation(undefined);
        setShowDeleteConfirmationModal(false);
    };

    useEffect(() => {
        permissions(organisation);

    },[organisation]);

    useEffect(() => {
        if (parentNameFilter != "parentName eq 'undefined'") {
            suborganisationListGet(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
        }

      }, [organisation, parentName, listItemLimit]);

    // useEffect(() => {
    // suborganisationListGet(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
    // }, [listItemLimit]);

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

    const permissions = (response) => {
  
        if(response !== [] && response.permissions !== undefined){
            response.permissions.map((value,index) => {
             if(value == "/permission/admin/manage/identity/organizationmgt/update"){
                setOrganizationUpdate(true);
             }else if(value == "/permission/admin/manage/identity/organizationmgt/view"){
                setOrganizationView(true);
             }
      
             if(value == "/permission/admin/manage/identity/organizationmgt/delete"){
                setOrganizationDelete(true);
             }
          }
         )
        } 
      };

      const permissionsArray = (organisation) => {
        const permitionArray = [];
        

        if(organizationUpdate){
            permitionArray.push(
                  {
                   "data-testid": `${ testId }-edit-user-${ organisation.name }-button`,
                   icon: rootOrganizationDisable(organisation.name)? "pencil alternate": "eye",
                   onClick: () => setShowSubOrgDetails(organisation.id),
                   popupText: rootOrganizationDisable(organisation.name)? "Edit": "View",
                   type: "button"
                  }
            ); 
        }else if(!organizationUpdate && organizationView){
            permitionArray.push(
              {
                "data-testid": `${ testId }-edit-user-${ organisation.name }-button`,
                icon: "eye",
                onClick: () => setShowSubOrgDetails(organisation.id),
                popupText: "View",
                type: "button"
               }
            );
        }

        if(organizationDelete && rootOrganizationDisable(organisation.name)){
            permitionArray.push(
                {
                    "data-testid": `${ testId }-delete-user-${ organisation.name }-button`,
                    hidden: organisation.name === "admin",
                    icon: "trash alternate",
                    onClick: (): void => {
                        setShowDeleteConfirmationModal(true);
                        setDeletingOrganisation(organisation);
                    },
                    popupText: t("adminPortal:components.users.usersList.list" +
                        ".iconPopups.delete"),
                    type: "button"
                }
            );
        }

        return permitionArray;
      };    

    const listContent = (subOrganisationsList) => {

        if(subOrganisationsList){
            return (
                <Grid>
                
                <Grid.Column width={ 5 }>
                    <List.Content>
                    {subOrganisationsList.name?(
                        <List.Description className="list-item-meta">
                            {subOrganisationsList.parent.name}
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}  
                    </List.Content>
                </Grid.Column>
                <Grid.Column width={ 3 }>
                <List.Content>
                    { subOrganisationsList.attributes?(
                        <List.Description className="list-item-meta">
                            { subOrganisationsList.attributes[0]?.value }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>

                <Grid.Column width={ 4 }>
                    <List.Content>
                    {subOrganisationsList.status?(
                        <List.Description className="list-item-meta meta-status">
                            { subOrganisationsList.status }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>
                </Grid>
            )
        }
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
                <List.Description className="list-item-meta parent-name-meta">
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
       <Grid.Column width={ actionsColumnWidth }>
       <List.Content>
                <List.Description className="list-item-meta"></List.Description>
         </List.Content> 
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

        if (subOrganisationsList && organizationUpdate) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-placeholder` }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    action={
                        <PrimaryButton
                        data-testid="create-sub-org-button"
                        onClick={ () => setShowWizard(true) }
                      >
                        { "Create Sub Organisation" }
                      </PrimaryButton>
                      }
                    title={ "Create Sub Organisation" }
                    subtitle={ [
                        "There are currently sub organisations available.",
                        "You can add a new sub organisation easily by following the",
                        "steps in the sub organisation creation wizard."
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
                    count: listItemLimit,
                    imageType: "circular"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                selection={ selection }
            >
            { !listView ? listHeader() : null }
                {
                    subOrganisationsList && subOrganisationsList instanceof Array && subOrganisationsList.length > 0
                        ? subOrganisationsList.map((organisation, index) => (
                            <ResourceListItem
                                key={ index }
                                
                                actions={
                                    showListItemActions
                                        ? permissionsArray(organisation): []
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
                                itemDescription={ listView ? organisation.type : null }
                                metaContent={ showMetaContent ? listContent(organisation) : null }
                                metaColumnWidth={ metaColumnWidth }
                                descriptionColumnWidth={ descriptionColumnWidth }
                                actionsColumnWidth={ actionsColumnWidth }
                                onClick={ (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                    if (!selection) {
                                        return;
                                    }

                                    setShowSubOrgDetails(organisation.id);
                                    //onListItemClick(event, data);
                                } }
                            />
                        ))
                        : showPlaceholders()
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
SubOrganisationList.defaultProps = {
    actionsColumnWidth: 2,
    descriptionColumnWidth: 3,
    metaColumnWidth: 11,
    showListItemActions: true,
    showMetaContent: true
};
