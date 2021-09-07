/* eslint-disable max-len */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, ListLayout, PrimaryButton, ResourceList, ResourceListItem } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Checkbox,
  DropdownProps,
  Grid,
  List,
  Modal,
  SemanticWIDTHS
} from "semantic-ui-react";
import ConfirmWindow from "./confirmWindow";
import { Pagination, UIConstants } from "../../../core";
import { includeSubOrg } from "../../api";

interface RoleUsersInterface extends TestableComponentInterface {
  closeRoleUserPopup: () => void;
  roleMembers: any;
  roleName?: string;
  listOffset: number;
  listItemLimit: number;
  roleID: string;
  revokeUser: (id: string) => void;
  setRoleUsersLimit: (limit: number) => void;
  getUsersList: (listItemLimit: number, listOffset: number, id: string, query: string) => void;
  actionsColumnWidth?: SemanticWIDTHS;
  descriptionColumnWidth?: SemanticWIDTHS;
  metaColumnWidth?: SemanticWIDTHS;
  assignRoleDelete?: boolean;
  orgId?: string;
}

const RoleUsers: FunctionComponent<RoleUsersInterface> = (
  props: RoleUsersInterface
): ReactElement => {
  const {
    closeRoleUserPopup,
    roleMembers,
    roleName,
    listOffset,
    roleID,
    orgId,
    revokeUser,
    getUsersList,
    actionsColumnWidth,
    setRoleUsersLimit,
    listItemLimit,
    descriptionColumnWidth,
    metaColumnWidth,
    assignRoleDelete,
    ["data-testid"]: testId
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showhideFrom,setShowhideFrom] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [selectRevokeUser, setSelectRevokeUser] = useState<string>("");
  const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [crPageStartIndex, setCrPageStartIndex] = useState<number>(1);

  const handleUserFilter = (query: string): void => {
    getUsersList(listItemLimit, listOffset, roleID, query);
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  const revokeUserRole = (userId: string) => {
    setSelectRevokeUser(userId);
    setDeleteConfirm(true);
  };

  const confirmRevokeUser = () => {
    setDeleteConfirm(false);
    revokeUser(selectRevokeUser)
  };

  const handleAlerts = (alert: AlertInterface) => {
    dispatch(addAlert<AlertInterface>(alert));
  };



  const patchIncludeSub = (orgId: string, roleId: string, userId: string, action: boolean) => {

    const operation = [
      {
          "op" : "replace",
          "path" : "/includeSubOrgs",
          "value" : action
      }
    ]

      includeSubOrg(orgId, roleId, userId, operation).then(() => {
        handleAlerts({
                description: "Included sub organisation operation successfully updated",
                level: AlertLevels.SUCCESS,
                message: "Included sub organisation successfully"
            });
     
    }).catch((error) => {
        if (error && error.detail) {
            dispatch(addAlert({
                description: "Included sub organisation operation is failed",
                level: AlertLevels.ERROR,
                message: "Operation is failed"
            }));
        }
        else {
            dispatch(addAlert({
                description: "Please check the conditions and try again",
                level: AlertLevels.ERROR,
                message: "Organisation Update is failed"
            }));
        }
    });
    };


/**
* Pagination user list
*/
  const handlePaginationChange = (value, direction) => {
    let newStartIndex = 0;
    const number = value;

    setPageNumber(number);


    if (direction === "Next") {
      newStartIndex = crPageStartIndex + listItemLimit;
    } else {
      newStartIndex = crPageStartIndex - listItemLimit;
    }

    if (value === 1 && direction === "Previous") {
      getUsersList(listItemLimit, listOffset, roleID, null);
    } else {
      getUsersList(listItemLimit, newStartIndex, roleID, null);
    }

    setCrPageStartIndex(newStartIndex);
  };


  const deleteFunction = (user, orgId) => {
    const permissionReturns = [];
    if(assignRoleDelete){
       permissionReturns.push(
        {
         icon: "times circle outline",
         onClick: () => { revokeUserRole(user.id) },
         popupText: t(
          orgId === user.assignedMeta[0].assignedAt.orgId ? "Revoke member" : "Member can revoke at " + user.assignedMeta[0].assignedAt.orgName
         ),
         type: "button"
        }
      );
    }
    return permissionReturns;
  };

  const showHideForm = (e) => {
    setShowhideFrom(!e);
  };

  const pagenumberEdit = (e) => {
    return e;
  }

  const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
    setRoleUsersLimit(data.value as number);
};

  const listHeader = () => {
    return (
      <>
      <div className="mng-serch-wrapper-search role-member-search-wrap">
          <div className={ `search-dp-wrapper assign-user-dp-wrapper role-member-search ${ showhideFrom }` } onClick={ () => showHideForm(showhideFrom) }>Search by Users 
          <i aria-hidden="true" className="dropdown icon"></i></div>
        {/* { showhideFrom && showhideFrom?(
                <AdvancedSearchWithBasicFilters
                onFilter={ handleUserFilter }
                    filterAttributeOptionOne={ [
                      {
                        key: 0,
                        text: "User Login",
                        value: "userName"
                       }]
                    }
                    filterAttributeOptionTwo={ [ {
                      key: 0,
                      text: "First Name", 
                      value: "name.givenName"
                      }]
                    }
                    filterAttributeOptionThree={ [{
                      key: 0,
                      text: "Last Name",
                      value: "name.familyName"
                      }]
                    }    
                    filterAttributeOptionFour={ [{
                      key: 0,
                      text: "Identity Status",
                      value:"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled.accountDisabled"
                      }]
                    }       
                    filterAttributeOptionFive={ [{
                      key: 0,
                      text: "Start Date",
                      value:"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled.activeStartDate"
                        }]
                    }    
                    filterAttributeOptionSix={ [{
                      key: 0,
                      text: "End Date",
                      value: "activeEndDate"
                        }]
                    }  
                    filterAttributeOptionSeven={ [{
                      key: 0,
                      text: "Organisation",
                      value: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled.organization"
                    }]
                } 
                    filterAttributePlaceholder={
                        t("adminPortal:components.users.advancedSearch.form.inputs.filterAttribute.placeholder")
                    }
                    filterConditionsPlaceholder={
                        t("adminPortal:components.users.advancedSearch.form.inputs.filterCondition" +
                            ".placeholder")
                    }
                    filterValuePlaceholder={
                        t("adminPortal:components.users.advancedSearch.form.inputs.filterValue" +
                            ".placeholder")
                    }
                    placeholder={ "Search by Username" }
                    defaultSearchAttribute="userName"
                    defaultSearchOperator="co"
                    searchBoxShow={ false }
                    triggerClearQuery={ triggerClearQuery }
                />
        ):""} */}
            </div>
      <div
        role="listitem"
        className="item resource-list-item grid-header-wrapper"
        data-testid="resource-list-item"
      >
        <Grid>
            <Grid.Column width={ 4 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                User Login
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 2 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                First Name
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 2 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                Last Name
              </List.Description>
            </List.Content>
          </Grid.Column>
          <Grid.Column width={ 4 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                Email
              </List.Description>
            </List.Content>
          </Grid.Column>
            <Grid.Column width={ 2 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                Include Sub-Organisations
              </List.Description>
            </List.Content>
          </Grid.Column>
          { assignRoleDelete ?(
          <Grid.Column width={ 2 }>
            <List.Content>
              <List.Description className="list-item-meta-column">
                Revoke
              </List.Description>
            </List.Content>
          </Grid.Column>
          ):null }
        </Grid>
      </div>
      </>
    );
  };

  const listContent = (user) => {
    return (
      <Grid>
        <Grid.Column  width={ 3 }>
          <List.Content>
            { user.name && user.name.givenName ? (
              <List.Description className="list-item-meta-column font-weight-normal ellipsis-field">
              { user.name?.givenName }
            </List.Description>
            ) : (
              <List.Description className="list-item-meta-column font-weight-normal"></List.Description>
            )}
            </List.Content>
        </Grid.Column>
        <Grid.Column  width={ 3 }>
          <List.Content>
          { user.name && user.name.familyName ? (
            <List.Description className="list-item-meta-column font-weight-normal ellipsis-field">
            { user.name?.familyName }
          </List.Description>
          ) : (
            <List.Description className="list-item-meta-column font-weight-normal"></List.Description>
          )}
            </List.Content>
        </Grid.Column>
        <Grid.Column  width={ 6 }>
          <List.Content>
            { user.userName ? (
              <List.Description className="list-item-meta-column font-weight-normal ellipsis-field">
              { user.userName }
            </List.Description>
            ) : (
              <List.Description className="list-item-meta-column font-weight-normal"></List.Description>
            )} 
            </List.Content>
        </Grid.Column>
        <Grid.Column width={ 2 }>
        <Checkbox 
          className="checkbox-role-member"
          defaultChecked={ user.assignedMeta[0].includeSubOrgs ? user.assignedMeta[0].includeSubOrgs : false }
          onClick={ () => patchIncludeSub(orgId, roleID, user.id, !user.assignedMeta[0].includeSubOrgs) }
          disabled={ orgId !== user.assignedMeta[0].assignedAt.orgId }
         />
          </Grid.Column>
      </Grid>
    );
  };

  return (
    <Modal
      data-testid={ testId }
      open={ true }
      className="wizard application-create-wizard-medium role-member-modal"
      dimmer="blurring"
      size="small"
      onClose={ closeRoleUserPopup }
      closeOnDimmerClick={ false }
      closeOnEscape={ false }
    >
      <Modal.Header className="wizard-header">

      { roleName ? (
              roleName
            ): "Admin Roles" }  
        <Heading as="h6">{ " " }</Heading>
      </Modal.Header>
      <Modal.Content className="role-members-body">
        
      <ListLayout
           currentListSize={ listItemLimit }
           listItemLimit={ listItemLimit }
           onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
           data-testid="role-mgt-user-list-layout"
           onPageChange={ handlePaginationChange }
           showPagination={ true }
           showTopActionPanel={ false }
           totalPages={ Math.ceil(roleMembers.length / listItemLimit) }
           totalListSize={ roleMembers.length }
      >
        <ResourceList
          className="application-list organisation-list border-box-role-member"
          celled={ true }
          divided={ true }
        >
          { listHeader() }
          { roleMembers?.length > 0 ? roleMembers.map((user, index) => (
           user.status != "404" ? (
            <ResourceListItem
              key={ index }
              actions={ deleteFunction(user, orgId) }
              itemHeader={
                user.userName
              }
              metaContent={ listContent(user) }
              metaColumnWidth={ metaColumnWidth }
              descriptionColumnWidth={ descriptionColumnWidth }
              actionsColumnWidth={ actionsColumnWidth } 
            />
          ) : ""))
            : "" }
        </ResourceList>
        <Pagination
          dataSource={ listItemLimit }
          pageNo={ pageNumber }
          onPagination={ (pageNumber,direction) => handlePaginationChange(pageNumber,direction) }
          disabledNextButton={ roleMembers?.length < listItemLimit ? "disable-button": "" }
          disabledPrevButton={ pageNumber === 1? "disable-button": "" }
          customClassName= { "role-users-pagination" }
          isEditable= { false }
          customPageNumber = { (e) => pagenumberEdit(e) }
          />
        </ListLayout>

        
        { deleteConfirm && (
          <ConfirmWindow onCancel={ cancelDelete } onConfirm={ confirmRevokeUser } />
        ) }
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Row column={ 1 }>
            <Grid.Column>
            <PrimaryButton
              data-testid={ `${testId}-close-button` }
              floated="right"
              onClick={ () => closeRoleUserPopup() }
            >
              Close
            </PrimaryButton>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};
export default RoleUsers;

RoleUsers.defaultProps = {
  actionsColumnWidth: 1,
  assignRoleDelete: false,
  descriptionColumnWidth: 4,
  metaColumnWidth: 11
}

