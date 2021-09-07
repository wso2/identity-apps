/* eslint-disable sort-imports */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertInterface,
  AlertLevels,
  LoadableComponentInterface,
  TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
  ConfirmationModal,
  EmptyPlaceholder,
  ResourceList,
  ResourceListItem,
  PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Grid,
  List,
  SemanticWIDTHS
} from "semantic-ui-react";
import { EmptyPlaceholderIllustrations, UIConstants } from "../../core";
// import { deleteUser } from "../../users/api";
// import { AddUserWizard } from "../../users/components";
import { UserBasicInterface, UserListInterface } from "../../users/models";


interface MembersListInterface extends LoadableComponentInterface, TestableComponentInterface {
  /**
   * Width of the action panel column.
   */
  actionsColumnWidth?: SemanticWIDTHS;
  /**
   * Default list item limit.
   */
  defaultListItemLimit?: number;
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
  usersList: UserListInterface;
  /**
   * Width of the description area.
   */
  descriptionColumnWidth?: SemanticWIDTHS;
  /**
   * Width of the meta info area.
   */
  metaColumnWidth?: SemanticWIDTHS;

  userDiscriptionShow?: any;

  getUserList?: (limit: number, offset: number, filter: string, attribute: string, domain: string) => void;
  /**
   * 
   */
  organisation?: any;

  memberListItemLimit?: any;


  updateUserList: () => void;
  updateList: () => void;
  setShowAddUserWizard?: (show: boolean) => void;
}
export const MembersList: FunctionComponent<MembersListInterface>=(props: MembersListInterface): JSX.Element => {
  const {
    actionsColumnWidth,
    descriptionColumnWidth,
    defaultListItemLimit,
    metaColumnWidth,
    searchQuery,
    selection,
    showListItemActions,
    showMetaContent,
    [ "data-testid" ]: testId,
    userDiscriptionShow,
    isLoading,
    usersList,
    organisation,
    updateUserList,
    updateList,
    setShowAddUserWizard,
    getUserList,
    memberListItemLimit
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ selectedUser, setSelectedUser ] = useState({});
  const [ showWizard, setShowWizard ] = useState<boolean>(false);
  const [ isListUpdated, setListUpdated ] = useState(false);
  
  const [userView, setUserView] = useState<boolean>(false);
  const [userDelete, setUserDelete] = useState<boolean>(false);
  const [userUpdate, setUserUpdate] = useState<boolean>(false);


  const [ rolesList ] = useState([]);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal
  ] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<UserBasicInterface>(
    undefined
  );


/**
     * Flatten the nested object to single object
     * 
     * @param {*} obj 
     * @returns {*} Object
     */
    const flattenObject = (obj: any) => {
      return Object.assign(
          {}, 
          ...function _flatten(o) { 
            return [].concat(...Object.keys(o)
              .map(k => 
                typeof o[k] === "object" ?
                  _flatten(o[k]) : 
                  ({ [k]: o[k] })
              )
            );
          }(obj)
        )
  }

  /**
   * Return Array with the provided condition for filter
   * @param {*} arr 
   * @param {String} condition 
   */
  const filterobject = (arr: any, condition: string) => {
      if(arr.length === 0) return []
      return arr.filter((number) => number.type === condition)
  }


  /**
   * This is called on open popup to see user details
   * 
   * @param {string} userId 
   */
  const handleUserEdit = (userId: string) => {
      const selectUser = usersList.Resources.filter((user) => (user.id === userId))[0]
      const flatObj = flattenObject(selectUser)
      
      flatObj.lastName = flatObj.familyName
      flatObj.firstName = flatObj.givenName
      flatObj.email = flatObj.userName
      flatObj.manager = selectUser["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.manager?.mid
      flatObj.managerName = selectUser["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.manager?.displayName
      // eslint-disable-next-line max-len
      flatObj.organization = selectUser["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.organization?.name
      flatObj.id = selectUser.id
      flatObj.welcomeEmailSent = selectUser["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.welcomeEmail
      flatObj.createNotifiedDate = selectUser["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.createNotifiedDate
      delete flatObj.emailOTPDisabled
      delete flatObj.smsOTPDisabled
      setSelectedUser(flatObj)
      setShowWizard(true)
  };

  useEffect(() => {
    permissions(organisation);
  },[organisation]);


  useEffect(() => {
    if (organisation?.id) {
      const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`;
      getUserList(
        memberListItemLimit,
        1,
        filter,
        null,
        null
      );
    }
  }, [organisation, memberListItemLimit]);

  /**
   * Dispatches the alert object to the redux store.
   *
   * @param {AlertInterface} alert - Alert object.
   */
  const handleAlerts = (alert: AlertInterface) => {
    dispatch(addAlert(alert));
  };

  const handleUserDelete = (userId: string): any => {
    // deleteUser(userId).then(() => {
    //   handleAlerts({
    //     description: t(
    //       "adminPortal:components.users.notifications.deleteUser.success.description"
    //     ),
    //     level: AlertLevels.SUCCESS,
    //     message: t(
    //       "adminPortal:components.users.notifications.deleteUser.success.message"
    //     )
    //   });
    //   setListUpdated(true);
    //   updateUserList();
    // }).catch((error) => {
    //   if (error && error.detail && error.status !== "500") {
    //      dispatch(addAlert({
    //      description: t( error.detail ),
    //      level: AlertLevels.ERROR,
    //      message: t(
    //          "Unexpected Error"
    //      )
    //    }));
    //   }else{
    //      dispatch(addAlert({
    //          description: t("There is a System error Please contact system administrator"),
    //      level: AlertLevels.ERROR,
    //      message: t("Unexpected Error")
    //    }));
    //   }
    //  });
  };

  const deleteUserValue = (id: string): void => {
    handleUserDelete(id);
    setDeletingUser(undefined);
    setShowDeleteConfirmationModal(false);
  };

  const userAvailableStatus = (value: any): any => {
    if(value){
      return "Disabled";
    }else{
      return "Active";
    }
  };


const permissions = (response) => {
  
  if(response !== [] && response.permissions !== undefined){
      response.permissions.map((value,index) => {
       if(value == "/permission/admin/manage/identity/usermgt/update"){
        setUserUpdate(true);
       }else if(value == "/permission/admin/manage/identity/usermgt/view"){
        setUserView(true);
       }

       if(value == "/permission/admin/manage/identity/usermgt/delete"){
        setUserDelete(true);
       }
    }
   )
  } 
};

const permissionsArray = (user) => {
  const permitionArray = [];
  const adminUserName = user?.userName.substring(0, user?.userName.lastIndexOf("@"));
  if(userUpdate){
    permitionArray.push(
      {
        "data-testid": `${testId}-edit-user-${user.userName}-button`,
        hidden: adminUserName === "admin",
        icon: "pencil alternate",
        onClick: () => handleUserEdit(user.id),
        popupText: t(
          "adminPortal:components.users.usersList.list" +
            ".iconPopups.edit"
        ),
        type: "button"
      }
    );
  }else if(userUpdate !== true && userView == true){
    permitionArray.push(
      {
      "data-testid": `${testId}-edit-user-${user.userName}-button`,
      hidden: adminUserName === "admin",
      icon: "eye",
      onClick: () => handleUserEdit(user.id),
      popupText: t(
        "adminPortal:components.users.usersList.list" +
          ".iconPopups.edit"
      ),
      type: "button"
    }
  );
  }

  if(userDelete){
    permitionArray.push(
    {
      "data-testid": `${testId}-delete-user-${user.userName}-button`,
      hidden: adminUserName === "admin",
      icon: "trash alternate",
      onClick: (): void => {
        setShowDeleteConfirmationModal(true);
        setDeletingUser(user);
      },
      popupText: t(
        "adminPortal:components.users.usersList.list" +
          ".iconPopups.delete"
      ),
      type: "button",
      // eslint-disable-next-line sort-keys
      disabled: !user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].accountDisabled
    }
    )
  }


  return permitionArray;
};  


  const listContent = (user: UserBasicInterface) => {
    if (user) {
      return (
        <Grid>
          <Grid.Column width={ 3 }>
            {/* <List.Content>
              {user.displayName ? (
                <List.Description className="list-item-meta">
                  {user.displayName}
                </List.Description>
              ) : (
                <List.Description className="list-item-meta"></List.Description>
              )}
            </List.Content> */}
          </Grid.Column>
          <Grid.Column width={ 3 }>
            <List.Content>
              {user.name && user.name.givenName ? (
                <List.Description className="list-item-meta">
                  {user.name.givenName}
                </List.Description>
              ) : (
                <List.Description className="list-item-meta"></List.Description>
              )}
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 3 }>
            <List.Content>
              {user.name && user.name.familyName ? (
                <List.Description className="list-item-meta">
                  {user.name.familyName}
                </List.Description>
              ) : (
                <List.Description className="list-item-meta"></List.Description>
              )}
            </List.Content>
          </Grid.Column>

          <Grid.Column width={ 3 }>
                    <List.Content>
                    {user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"] && user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].accountDisabled !== null?(    
                        <List.Description className="list-item-meta">
                            { user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].accountDisabled? "Disabled": "Active" }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>

                <Grid.Column width={ 2 }>
                    <List.Content>
                    {user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"] && user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].accountLocked !== null?(    
                        <List.Description className="list-item-meta">
                            { user["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].accountLocked? "Locked": "Unlocked" }
                        </List.Description>
                    ):(<List.Description className="list-item-meta"></List.Description>)}    
                    </List.Content>
                </Grid.Column>
        </Grid>
      );
    }
  };

  const listHeader = () => {
    return (
      <div
        role="listitem"
        className="item resource-list-item grid-header-wrapper"
        data-testid="resource-list-item"
      >
        <Grid>
          <Grid.Column width={ descriptionColumnWidth }>
            <List.Content>
              <List.Description className="list-item-meta">
                User Login
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ metaColumnWidth }>
            <Grid>
              <Grid.Column width={ 3 }>
                <List.Content>
                  <List.Description className="list-item-meta">
                    Display Name
                  </List.Description>
                </List.Content>
              </Grid.Column>

              <Grid.Column width={ 3 }>
                <List.Content>
                  <List.Description className="list-item-meta">
                    First Name
                  </List.Description>
                </List.Content>
              </Grid.Column>

              <Grid.Column width={ 3 }>
                <List.Content>
                  <List.Description className="list-item-meta">
                    Last Name
                  </List.Description>
                </List.Content>
              </Grid.Column>

   

              {/* <Grid.Column width={ 3 }>
              <List.Content>
                <List.Description className="list-item-meta">
                Email      
                </List.Description>
              </List.Content>
            </Grid.Column> */}
               <Grid.Column width={ 3 }>
              <List.Content>
                <List.Description className="list-item-meta">
                Identity Status          
                </List.Description>
              </List.Content>
            </Grid.Column>

              <Grid.Column width={ 2 }>
                <List.Content>
                  <List.Description className="list-item-meta list-column-nowrap">
                    Account Status
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
  };

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
          image={ EmptyPlaceholderIllustrations.emptySearch }
          imageSize="tiny"
          title={ t(
            "adminPortal:components.users.usersList.search.emptyResultPlaceholder.title"
          ) }
          subtitle={ [
            t(
              "adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.0",
              { query: searchQuery }
            ),
            t(
              "adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.1"
            )
          ] }
        />
      );
    }

    if ((!usersList?.Resources || usersList?.Resources?.length === 0) && userUpdate) {
      return (
        <EmptyPlaceholder
          data-testid={ `${testId}-empty-placeholder` }
          action={
            <PrimaryButton
            data-testid="user-mgt-user-list-add-user-button"
            onClick={ () => setShowAddUserWizard(true) }
          >
            { "Create User" }
          </PrimaryButton>
          }
          image={ EmptyPlaceholderIllustrations.newList }
          imageSize="tiny"
          title={ t(
            "adminPortal:components.users.usersList.list.emptyResultPlaceholder.title"
          ) }
          subtitle={ [
            t(
              "adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.0"
            ),
            t(
              "adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.1"
            ),
            t(
              "adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.2"
            )
          ] }
        />
      );
    }

    return null;
  };

  return (
    <>
      {/* {showWizard && (
        // <AddUserWizard
        //   data-testid="user-mgt-add-user-wizard-modal"
        //   closeWizard={ () => setShowWizard(false) }
        //   listOffset={ null }
        //   listItemLimit={ 10 }
        //   updateList={ () => updateList() }
        //   rolesList={ rolesList }
        //   initialUserValue={ selectedUser }
        //   isUserUpdate={ true }
        //   isOrganization= { true }
        //   userUpdateValue={ userUpdate }
        // />
      )} */}
      {/* <PageLayout> */}
      <ResourceList
        className="application-list organisation-list"
        isLoading={ isLoading }
        loadingStateOptions={ {
          count:
            defaultListItemLimit ??
            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
          imageType: "circular"
        } }
        fill={ !showPlaceholders() }
        celled={ false }
        divided={ true }
        selection={ selection }
      >
        {listHeader()}
        {usersList?.Resources &&
        usersList.Resources instanceof Array &&
        usersList.Resources.length > 0
          ? usersList.Resources.map((user, index) => (
              <ResourceListItem
                key={ index }
                actions={
                  showListItemActions
                    ? permissionsArray(user): []
                }
                actionsFloated="right"
                avatar={ <></> }
                itemHeader={
                  userDiscriptionShow
                    ? user.userName
                      ? user.userName
                      : ""
                    : null
                }
                itemDescription={ user.userName ? user.userName : "" }
                metaContent={ showMetaContent ? listContent(user) : null }
                metaColumnWidth={ metaColumnWidth }
                descriptionColumnWidth={ descriptionColumnWidth }
                actionsColumnWidth={ actionsColumnWidth }
                // onClick={ (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                //     if (!selection) {
                //         return;
                //     }

                //     handleUserEdit(user.id);
                //     onListItemClick(event, data);
                // } }
              />
            ))
          : showPlaceholders()}
      </ResourceList>
      {/* </PageLayout> */}
      {deletingUser && (
        <ConfirmationModal
          data-testid={ `${testId}-confirmation-modal` }
          onClose={ (): void => setShowDeleteConfirmationModal(false) }
          type="warning"
          open={ showDeleteConfirmationModal }
          assertion={ deletingUser.userName }
          assertionHint={
            <p>
              <Trans
                i18nKey={
                  "adminPortal:components.user.deleteUser.confirmationModal." +
                  "assertionHint"
                }
                tOptions={ { userName: deletingUser.userName } }
              >
                Please type <strong>{deletingUser.userName}</strong> to confirm.
              </Trans>
            </p>
          }
          assertionType="input"
          primaryAction="Confirm"
          secondaryAction="Cancel"
          onSecondaryActionClick={ (): void =>
            setShowDeleteConfirmationModal(false)
          }
          onPrimaryActionClick={ (): void => deleteUserValue(deletingUser.id) }
        >
          <ConfirmationModal.Header
            data-testid={ `${testId}-confirmation-modal-header` }
          >
            {t(
              "adminPortal:components.user.deleteUser.confirmationModal.header"
            )}
          </ConfirmationModal.Header>
          <ConfirmationModal.Message
            data-testid={ `${testId}-confirmation-modal-message` }
            attached
            warning
          >
            {t(
              "adminPortal:components.user.deleteUser.confirmationModal.message"
            )}
          </ConfirmationModal.Message>
          <ConfirmationModal.Content
            data-testid={ `${testId}-confirmation-modal-content` }
          >
            {t(
              "adminPortal:components.user.deleteUser.confirmationModal.content"
            )}
          </ConfirmationModal.Content>
        </ConfirmationModal>
      )}
    </>
  );
};

/**
 * Default props for the component.
 */
MembersList.defaultProps = {
  actionsColumnWidth: 2,
  descriptionColumnWidth: 3,
  metaColumnWidth: 11,
  showListItemActions: true,
  showMetaContent: true
};
