/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-keys */
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
import {
  AlertInterface,
  AlertLevels,
  TestableComponentInterface
} from "@wso2is/core/models";
import {
  Heading,
  LinkButton,
  PrimaryButton
} from "@wso2is/react-components";
import { Checkbox, Col, Row } from "antd";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { Pagination } from "../../../core";
import { assignRoleUsers, getUsersList } from "../../api";
import { UserListInterface } from "../../models";

interface AssignAdminRolesPropsInterface extends TestableComponentInterface {
  closeDetailWizard: () => void;
  listOffset: number;
  listItemLimit: number;
  onAlertFired: (alert: AlertInterface) => void;
  orgId: string;
  [ key: string ]: any;
  roleId: any;
}

export const AssignAdminRoles: FunctionComponent<AssignAdminRolesPropsInterface> = (
  props: AssignAdminRolesPropsInterface
): ReactElement => {
  const {
    closeDetailWizard,
    listOffset,
    listItemLimit,
    onAlertFired,
    orgId,
    roleId
  } = props;

  const [usersList, setUsersList] = useState<UserListInterface>();
  const [showhideFrom,setShowhideFrom] = useState<boolean>(true);
  const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
  const { t } = useTranslation();
  const [ selectedUsers, setSelectedUsers ] = useState<any>([]);
  const [ includeOption, setIncludeOption ] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [crPageStartIndex, setCrPageStartIndex] = useState<number>(1);
  const [ searchQuery, setSearchQuery ] = useState<string>("");
  const [ itemCounts, setItemCounts ] = useState<any>([]);
  const [ concatSelectedItems, setConcatSelectedItems ] = useState<any>([]);
  const [ concatSelectedIncludes, setConcatSelectedIncludes ] = useState<any>([]);
  

  const handleUserFilter = (query: string): void => {
    if (query === "userName sw ") {
      getUsersList(listItemLimit, listOffset, null, null, null).then((response) => {
        setUsersList(response);
      })
    }

    getUsersList(listItemLimit, listOffset, query, null, null).then((response) => {
      setUsersList(response);
      setSearchQuery(query);
    })
  };

  const showHideForm = (e) => {
    setShowhideFrom(!e);
  };

/**
* this method use to assign users to roles 
* params users:selected user list, include:selected include option, orgId:organisation id
*/
  const assignSelectedUsers = (users, include, orgId) => {
    
    const usersAttributes = [];

    if (localStorage.getItem("checkedValues") !== null) {
      localStorage.removeItem("checkedValues");
    }

    if (localStorage.getItem("includeValues") !== null) {
      localStorage.removeItem("includeValues");
    }

    if (users && users.length !== 0) {

    users.forEach(function (userId) {
      let includeSubOrgs = "false";
      if (include && include.length !== 0) {
      include.forEach(function (includeId) {
        if (userId === includeId) {
          includeSubOrgs = "true";
        }
      });
    }

      usersAttributes.push({
        userId,
        includeSubOrgs
      });
    });

    const sendData = {
      roleId: roleId,
      users: usersAttributes
    };
    assignRoleUsers(sendData, orgId)
      .then(() => {
        onAlertFired({
          description: "Assigned the role to the selected member(s) successfully",
          level: AlertLevels.SUCCESS,
          message: "Assigned role successfully"
        });
        closeDetailWizard();
      })
      .catch((err) => {
        onAlertFired({
          description: t("adminPortal:organisation.notifications."+ err +".message"),
          level: AlertLevels.WARNING,
          message: t("adminPortal:organisation.notifications."+ err +".description")
        });
      });
    } 
    else {
      onAlertFired({
        description: "No users selected",
        level: AlertLevels.ERROR,
        message: "Search and select a user to assign admin roles"
      });
    }
  };

  const pagenumberEdit = (e) => {
    return e;
  };

/**
* Pagination user list
*/
  const handlePaginationChange = (value, direction) => {
    
    let newStartIndex = 0;
    const number = value;
    let searchValue = null;

    localStorage.setItem("checkedValues", JSON.stringify(concatSelectedItems));
    localStorage.setItem("includeValues", JSON.stringify(concatSelectedIncludes));
    
    setPageNumber(number);
    if(searchQuery !== "" && searchQuery !== null){
        searchValue = searchQuery;
    }

    if(direction === "Next"){
        newStartIndex = crPageStartIndex + listItemLimit;
    }else{
        newStartIndex = crPageStartIndex - listItemLimit;
    }
    
    if(value === 1 && direction === "Previous"){
      getUsersList(listItemLimit, listOffset, null, null, null).then((response) => {
        setUsersList(response);
      })
    }else{
      getUsersList(listItemLimit, newStartIndex, searchValue, null, null).then((response) => {
        setUsersList(response);
      })
    }
    
    setCrPageStartIndex(newStartIndex);
};
/**
 * User checked values store in the local storage for pagination purpose
 * will be deleted the values once assigned donecd
 */
  const onChange = (checkedValues) => {
   if (pageNumber > 1) {
      const concatChecked = JSON.parse(localStorage.getItem("checkedValues")) || [];
      let concatArray = checkedValues.concat(concatChecked);
      concatArray = [...new Set([...checkedValues, ...concatChecked])];
      setConcatSelectedItems(concatArray);
      setSelectedUsers(concatArray);
      setItemCounts(concatArray.length);
    }
    else {
      setSelectedUsers(checkedValues);
      setItemCounts(checkedValues.length);
      setConcatSelectedItems(checkedValues);
    }
  };

/**
 * User include option values store in the local storage for pagination purpose
 * will be deleted the values once assigned done
 */
  const onChangeIncludeSub = (includeValues) => {

    if (pageNumber > 1) {
      const concatCheckedIncludes = JSON.parse(localStorage.getItem("includeValues")) || [];
      let concatArrayIncludes = includeValues.concat(concatCheckedIncludes);
      concatArrayIncludes = [...new Set([...includeValues, ...concatCheckedIncludes])]
      setConcatSelectedIncludes(concatArrayIncludes);
      setIncludeOption(concatArrayIncludes);
    }
    else {
      setIncludeOption(includeValues);
      setConcatSelectedIncludes(includeValues);
    }
  };

  const removeLocalStore = () => {
    if (localStorage.getItem("checkedValues") !== null) {
      localStorage.removeItem("checkedValues");
    }

    if (localStorage.getItem("includeValues") !== null) {
      localStorage.removeItem("includeValues");
    }
  };

  const userListData = () => {
    return(
        <>
        <div className="mng-serch-wrapper">
        <div className={ `search-dp-wrapper assign-user-dp-wrapper ${ !showhideFrom }` } 
        onClick={ () => showHideForm(showhideFrom) }>Search by Users 
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
                            // eslint-disable-next-line max-len
                            value: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled.accountDisabled"
                        }]
                    }       
                    filterAttributeOptionFive={ [{
                            key: 0,
                            text: "Start Date",
                            // eslint-disable-next-line max-len
                            value: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.accountDisabled.activeStartDate"
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
                    placeholder={ t("adminPortal:components.users.advancedSearch.placeholder") }
                    defaultSearchAttribute="userName"
                    defaultSearchOperator="co"
                    searchBoxShow={ false }
                    triggerClearQuery={ triggerClearQuery }
                />
        ):""} */}
            </div>
            
      <div className="user-list-wrapper assign-member-list-wrap">
          { usersList && usersList.Resources && usersList.totalResults > 0 ? (
            <div>
        <Row>
        <Col span={ 12 }>
        <Checkbox.Group onChange={ onChange } className="assign-member-list">
          { usersList.Resources.map((value,index) => ( 
                <Checkbox value={ value.id } key={ index }>
                  { value.displayName ? value.displayName: value.userName } <br/> 
                <div className="role-user-type"> { value.userType ? value.userType: value.userType } </div>
                </Checkbox>
              ))}
          </Checkbox.Group>
         
        </Col>
        <Col span={ 12 }>
        <Checkbox.Group onChange={ onChangeIncludeSub } className="assign-member-list include-sub-wrap">
          { usersList.Resources.map((value,index) => ( 
                <Checkbox value={ value.id } key={ index }>{ "Include Sub Organisation" }</Checkbox> 
              ))}
          </Checkbox.Group>
        
          </Col>
        </Row>
        <Row className="item-count-list">
        <Col span={ 12 }>
        <span className="assign-role-items">
            {usersList ? (
              usersList.itemsPerPage
            ): "0"}  {"Item(s)"}
        </span>
        <span className="assign-role-items-selected">
            { itemCounts && itemCounts > 0 ? (
              itemCounts
            ): "0"}  {"Item(s) Selected"}
            </span>
        </Col>
          </Row>
          <Pagination
          dataSource={ 10 }
          pageNo={ pageNumber }
          onPagination={ (pageNumber,direction) => handlePaginationChange(pageNumber,direction) }
          disabledNextButton={ usersList.itemsPerPage < listItemLimit ? "disable-button": "" }
          disabledPrevButton={ pageNumber === 1? "disable-button": "" }
          customClassName= { "assign-admin-pagination" }
          isEditable= { false }
          customPageNumber = { (e) => pagenumberEdit(e) }
         />
       </div>
        ): "" } 
        </div>
        </>
    );
}

  return (
    <Modal
      open={ true }
      className="wizard application-create-wizard assign-user-modal-wrap"
      dimmer="blurring"
      size="small"
      onClose={ closeDetailWizard }
      closeOnDimmerClick={ false }
      closeOnEscape={ false }
    >
      <Modal.Header className="wizard-header">
      { "Assign Users to Admin Roles" }
                <Heading as="h6">{ "Search and assign users to admin roles" }</Heading>
          </Modal.Header>
      <Modal.Content className="steps-container user-update-search-wrapper" scrolling>
      <div>
      { userListData() }

    </div>
      </Modal.Content>
        <Modal.Actions className="assign-roles-action">
        <LinkButton floated="left" onClick={ () => { closeDetailWizard(); removeLocalStore(); } }>
          Cancel
        </LinkButton>
        <PrimaryButton
          floated="right"
          onClick={ () => assignSelectedUsers(selectedUsers, includeOption, orgId) }
        >
          Assign
        </PrimaryButton>
      </Modal.Actions>
    </Modal>
  );
};

/**
 * Default props for the add user wizard.
 */
AssignAdminRoles.defaultProps = {
  currentStep: 0
};
