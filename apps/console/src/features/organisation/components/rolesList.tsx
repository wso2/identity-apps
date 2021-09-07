/* eslint-disable max-len */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useEffect, useState } from "react";
import { AlertInterface, AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { useDispatch } from "react-redux";
import { UIConstants } from "../../core";
import { addAlert } from "@wso2is/core/store";
import {
  ResourceList,
  ResourceListItem
} from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import {
  Grid,
  List
} from "semantic-ui-react";
import { AssignAdminRoles } from "./wizard/assign-admin-roles";
import RoleUsers from "./wizard/roleUsers";
import { getMembersByRole, revokeUserFromRole } from "../api";
import { OrganisationConstants } from "../constants";
import systemAdministrator from "../../data/system_Administrator_Roles";

interface RolesListInterface extends LoadableComponentInterface, TestableComponentInterface {
  organisation?: any;
  roleList?: any;
  onAlertFired?: (alert: AlertInterface) => void;
  defaultListItemLimit?: number;
  getRoleListFun?: (domain: string, attributes: string) => void;
  
}

export const RolesList: FunctionComponent<RolesListInterface> = (props: RolesListInterface): JSX.Element => {

  const { organisation,
          roleList,
          onAlertFired,
          isLoading,
          defaultListItemLimit,
          getRoleListFun
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [roleUserList, setRoleUserList] = useState();
  const [roleUserPopup, setRoleUserPopup] = useState<boolean>(false);
  const [clickedRole, setClickedRole] = useState<string>("");
  const [roleID, setRoleID] = useState<string>("");
  const [showAssignAdminRoles, setShowAssignAdminRoles] = useState<boolean>(false);
  const [listOffset, setListOffset] = useState<number>(0);
  const [assignRoleCreate, setAssignRoleCreate] = useState<boolean>(false);
  const [assignRoleView, setAssignRoleView] = useState<boolean>(false);
  const [assignRoleDelete, setAssignRoleDelete] = useState<boolean>(false);
  const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
  const [systemAdminHide, setSystemAdminHide] = useState<boolean>(false);


  const getUsersList = (listItemLimit: number, listOffset: number, roleId: string, query: string) => {
    const attributes = OrganisationConstants.DEFAULT_ROLE_LIST_ATTRIBUTES.toString();
    getMembersByRole(listItemLimit, listOffset, query, organisation?.id, roleId, attributes).then((response) => {
      setRoleUserList(response);
      setRoleUserPopup(true);
    })
  }

  const handleAssignRoleAlert = (alert: AlertInterface) => {
    dispatch(addAlert<AlertInterface>(alert));
  };

  const setRoleUsersLimit = (limit) => {
    setListItemLimit(limit);
    getUsersList(limit,listOffset,roleID,null);
  };

  const showMemberList = (roleID: string, roleName: string) => {
    if (roleID) {
      setRoleID(roleID);
      setClickedRole(roleName.split("/").pop());
      getUsersList(listItemLimit,0,roleID,null);
    }
  }

  const revokeUser = (userId: string) => {
    revokeUserFromRole(organisation.id, roleID, userId).then(() => {
      onAlertFired({
        description: "Revoke the user role successfully",
        level: AlertLevels.SUCCESS,
        message: "Revoke the role to the selected member successfully"
      });
      getUsersList(10,0,roleID,null);
    })
    .catch(() => {
      onAlertFired({
        description: "Revoke the user role Failed",
        level: AlertLevels.ERROR,
        message: "Error in Revoking the user role"
      });
    });
    
  };

  useEffect(() => {
    roleCreatePermission(organisation);
    const domain = "Internal";
    const attributes = "displayName";
    getRoleListFun(domain, attributes);
   
    systemAdministrator && systemAdministrator.map((value) => {
      if(organisation?.name == value.value)
      {
        setSystemAdminHide(true);
      }
    });

  },[organisation]);

  const roleCreatePermission = (organisation) => {
    if(organisation !== [] && organisation.permissions !== undefined){
      organisation.permissions.map((value) => {
        if(value == "/permission/admin/manage/identity/userrolemgt/create"){
          setAssignRoleCreate(true);
        }
        
        if(value == "/permission/admin/manage/identity/userrolemgt/view"){
          setAssignRoleView(true);
        }

        if(value == "/permission/admin/manage/identity/userrolemgt/delete"){
          setAssignRoleDelete(true);
        }

      });
    }
  };

  const rolePermission = (role , roleName) => {
    const permissionArray = [];

  if(assignRoleView){
    permissionArray.push(
      {
        icon: "users",
        onClick: () => showMemberList(role, roleName),
        popupText: t(
          "View Members"
        ),
        type: "button"
      }
    );
  }  

  if(assignRoleCreate){
    permissionArray.push(
      {
        icon: "add user",
        onClick: () => setShowAssignAdminRoles(role),
        popupText: t(
            "Assign Members"
        ),
        type: "button"
      }
    );
  }

    return permissionArray;
  };

  const listContent = (role) => {
    return (
      <Grid>
        <Grid.Column width= { 9 }>
          <List.Content>
            <List.Description>
              { role.description }
            </List.Description>
          </List.Content>
        </Grid.Column>
      </Grid>
    );
  };

  const listHeader = () => {
    return (
      <div
        role="listitem"
        className="item resource-list-item grid-header-wrapper"
        data-testid="resource-list-item"
      >
        <Grid>
          <Grid.Column width={ 5 }>
            <List.Content>
              <List.Description className="list-item-meta">
                Admin Role Name
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 9 }>
            <List.Content>
              <List.Description className="list-item-meta">
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 2 }>
            <List.Content>
              <List.Description className="list-item-meta">
                Actions
              </List.Description>
            </List.Content>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  return (
    <ResourceList
      className="application-list organisation-list"
      isLoading={ isLoading }
        loadingStateOptions={ {
          count: listItemLimit,
          imageType: "circular"
        } }
  //  fill={ !showPlaceholders() }
      celled={ false }
      divided={ true }
    >
      {listHeader() }
      {roleList?.length > 0 ? roleList.map((role, index) => (
        role.displayName == "Internal/System_Administrator"?(
          systemAdminHide?(
           <ResourceListItem
            className = "organisation-list-view-members"
            key={ index }
            actions={
             rolePermission(role.id, role.displayName)
            }
            itemHeader={
             role.displayName.split("/").pop()
             }
            // itemDescription={ role.description }
            metaContent={ listContent(role) }
            metaColumnWidth={ 9 }
            descriptionColumnWidth={ 5 }
            actionsColumnWidth={ 2 }
           />
          ):""
        ):(
         role.displayName == "Internal/Adminrole_Administrator"?(
          systemAdminHide === false?(
            <ResourceListItem
              className = "organisation-list-view-members"
              key={ index }
              actions={
               rolePermission(role.id, role.displayName)
              }
              itemHeader={
                role.displayName.split("/").pop()
              }
             // itemDescription={ role.description }
              metaContent={ listContent(role) }
              metaColumnWidth={ 9 }
              descriptionColumnWidth={ 5 }
              actionsColumnWidth={ 2 }
            />
           ):""
         ):(
          <ResourceListItem
          className = "organisation-list-view-members"
          key={ index }
          actions={
            rolePermission(role.id, role.displayName)
          }
          itemHeader={
            role.displayName.split("/").pop()
          }
          // itemDescription={ role.description }
          metaContent={ listContent(role) }
          metaColumnWidth={ 9 }
          descriptionColumnWidth={ 5 }
          actionsColumnWidth={ 2 }
         />
         )
        )
      ))
        : "" }
      {roleUserPopup && 
      <RoleUsers revokeUser={ revokeUser } 
        roleName={ clickedRole }
        roleID = { roleID }
        roleMembers={ roleUserList }
        listOffset={ listOffset }
        closeRoleUserPopup={ () => setRoleUserPopup(false) } 
        assignRoleDelete={ assignRoleDelete }
        getUsersList = { getUsersList }
        setRoleUsersLimit = { setRoleUsersLimit }
        listItemLimit = { listItemLimit }
        orgId = { organisation.id }
      /> }
    
      { showAssignAdminRoles && (
      <AssignAdminRoles
        data-testid="organisation-mgt-assign-users-wizard"
        closeDetailWizard={ () => setShowAssignAdminRoles(false) }
        listOffset={ listOffset }
        listItemLimit={ 10 }
        onAlertFired={ handleAssignRoleAlert }
        orgId= { organisation.id }
        roleId = { showAssignAdminRoles }
      />
) }
    </ResourceList>
  )
}
