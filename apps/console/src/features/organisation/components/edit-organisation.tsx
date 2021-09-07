/* eslint-disable max-len */
/* eslint-disable sort-imports */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Button, ListLayout, PageLayout, PrimaryButton, ResourceTab } from "@wso2is/react-components"
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, Popup } from "semantic-ui-react";
import { MembersList } from "./index";
import { OrganisationProfile } from "./organisation-profile";
import { SubOrganisationList } from "./sub-organisation-list";
import { Pagination, UIConstants } from "../../core";
import { OrganisationListInterface } from "../../organisation/models";
import { deleteOrganisation, getOrganisationList, getRolesList } from "../api";
import { AddOrganization, OrganisationListOptionsComponent, RolesList, SubOrganisationDetails } from "../components";
import { OrganisationConstants } from "../constants";

interface EditOrganisationPropsInterface {
  organisation;
  handleOrganisationUpdate: (userId: string) => void;
}

/**
 * Application edit component.
 *
 * @return {JSX.Element}
 */
export const EditOrganisation: FunctionComponent<EditOrganisationPropsInterface> = (
  props: EditOrganisationPropsInterface
): JSX.Element => {

  const {
    organisation,
    handleOrganisationUpdate
  } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [usersList, setUsersList] = useState({});
    const [createSubOrganization, setCreateSubOrganization] = useState<boolean>(false);
    const [createNewUsers, setCreateNewUsers] = useState<boolean>(false);

  const handleAlerts = (alert: AlertInterface) => {
    dispatch(addAlert<AlertInterface>(alert));
  };

  const [subOrganisation, setSubOrganisation] = useState<OrganisationListInterface>({});
  const [listItemLimit, setListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
  const [parentName, setParentName] = useState<string>("");
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [showSubOrgDetails, setShowSubOrgDetails] = useState<boolean>(false);
  const [listOffset, setListOffset] = useState<number>(0);
  const [organisationListMetaContent, setOrganisationListMetaContent] = useState(undefined);
  const [isListUpdated, setListUpdated] = useState(false);
  const typeAttribute = OrganisationConstants.DEFAULT_ORG_LIST_ATTRIBUTES[0];
  const parentNameFilter = "parentName eq " + "'" + organisation.name + "'";
  const [parentOrgList, setParentOrgList] = useState<OrganisationListInterface>({});
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumberSubOrg, setPageNumberSubOrg] = useState<number>(1);
  const [crPageStartIndex, setCrPageStartIndex] = useState<number>(1);
  const [crPageStartIndexMember, setCrPageStartIndexMember] = useState<number>(1);
  const [crPageStartIndexOrg, setCrPageStartIndexOrg] = useState<number>(1);
  const [disablePagination, setDisablePagination] = useState<string>("");
  const [memberPageNo, setMemberPageNo] = useState<number>(1);
  const [memberListItemLimit, setMemberListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
  const [showAddUserWizard, setShowAddUserWizard] = useState<boolean>(false);
  const [rolesList, setRolesList] = useState<any>();
  const [rolesResponseList, setRolesResponseList] = useState<any>();
  const [sortedRoleList, setSortedRoleList] = useState<any>();
  const [rolesListItemLimit, setRolesListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
  const [ isOrganisationListRequestLoading, setOrganisatonListRequestLoading ] = useState<boolean>(false);
  const [ roleListLoading, setRoleListLoading ] = useState<boolean>(false);

  
  const getList = (limit: number, offset: number, $filter: string, attribute: string, domain: string) => {
    setOrganisatonListRequestLoading(true);
    getOrganisationList(limit, offset, $filter, typeAttribute, domain)
      .then((response) => {
        setSubOrganisation(response);
        if (response.length === 0) {
          setDisablePagination("hide-pagination");
        }
        else {
          setDisablePagination("enable-pagination");
        }
      })
      .finally(() => {
        setOrganisatonListRequestLoading(false);
    });
  };

  const getUserList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
     console.log("test");
  };

  const getRoleListFun = (domain: string, attributes: string) => {
    setRoleListLoading(true);
      getRolesList(domain, attributes).then((res) => {
        setRolesResponseList(res);
        sortingRoleList(res);
      })
      .finally(() => {
        setRoleListLoading(false);
    });
  };

  // useEffect(() => {
  //   const domain = "Internal";
  //   const attributes = "displayName";
  //   getRolesList(domain, attributes).then((res) => {
  //     setRolesResponseList(res);
  //     sortingRoleList(res);
  //   })
  // },[]);

  const sortingRoleList = (data) => {
    const roleList = data.Resources;
    //const filtedRoles = [];
    roleList.sort((a, b) => (a.displayName.toLowerCase() > b.displayName.toLowerCase()) ? 1 : -1);

    // for (const role of roleList) {
    //   if (role.displayName != UIConstants.SYETEM_ADMIN_ROLE) {
    //     filtedRoles.push(role);
    //   }
    // }
    
    setSortedRoleList(roleList);
  };

  const handleMemberPage = (pageNumber, direction) => {
    const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`
  };

  const handleRolesPage = (pageNumber, direction) => {
    const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`
  };

  const updateUserList = () => {
    const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`;
    getUserList(
      memberListItemLimit,
      1,
      filter,
      null,
      null
    );
  }

  useEffect(() => {
    orgCreatePermission(organisation);
  }, [organisation])

  // useEffect(() => {
  //   //getList(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
  // }, [listItemLimit]);

    useEffect(() => {
      if (!isListUpdated) {
          return;
      }
      getList(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
      setListUpdated(false);
  }, [ isListUpdated ]);

  const handlePaginationChange = (value, direction) => {

    let newStartIndex = 0;
    setPageNumber(value);

    if (direction === "Next") {
      newStartIndex = crPageStartIndex + listItemLimit;
    } else {
      newStartIndex = crPageStartIndex - listItemLimit;
    }

    if (value === 1 && direction === "Previous") {
      getList(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
    } else {
      getList(listItemLimit, newStartIndex, parentNameFilter, typeAttribute, null);
    }
    setCrPageStartIndex(newStartIndex);
  };

  const handlePaginationMember = (value, direction) => {

    let newStartIndex = 0;
    setMemberPageNo(value);
    const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`;
    if (direction === "Next") {
      newStartIndex = crPageStartIndexMember + listItemLimit;
    } else {
      newStartIndex = crPageStartIndexMember - listItemLimit;
    }

    if (value === 1 && direction === "Previous") {
      getUserList(listItemLimit, listOffset, filter, null, null);
    } else {
      getUserList(listItemLimit, newStartIndex, filter, null, null);
    }
    setCrPageStartIndexMember(newStartIndex);
  };

  const orgCreatePermission = (organisation) => {
    if(organisation !== [] && organisation.permissions !== undefined){
      organisation.permissions.map((value) => {
        if(value == "/permission/admin/manage/identity/organizationmgt/create"){
          setCreateSubOrganization(true);
        }
        
        if(value == "/permission/admin/manage/identity/usermgt/create"){
          setCreateNewUsers(true);
        }
      })
    }
  };

  const handleOrganisationDelete = (orgId: string): void => {
    deleteOrganisation(orgId)
        .then(() => {
            handleAlerts({
                description: t("adminPortal:organisation.notifications.delete_success.message"),
                level: AlertLevels.SUCCESS,
                message: t("adminPortal:organisation.notifications.delete_success.description")
            });
            setListUpdated(true);
        })
        .catch((err) => {
              if (err) {
                dispatch(addAlert({
                    description: t("adminPortal:organisation.notifications."+ err +".message"),
                    level: AlertLevels.WARNING,
                    message: t("adminPortal:organisation.notifications."+ err +".description")
                }));
            }
            else {
                dispatch(addAlert({
                    description: t("adminPortal:organisation.notifications.generic_delete.message"),
                    level: AlertLevels.ERROR,
                    message: t("adminPortal:organisation.notifications.generic_delete.description")
                }));
            }
          });
	};

    const handlePaginationChangeSubOrg = (value, direction) => {

    let newStartIndex = 0;
    setPageNumberSubOrg(value);

    if (direction === "Next") {
      newStartIndex = crPageStartIndexOrg + listItemLimit;
    } else {
      newStartIndex = crPageStartIndexOrg - listItemLimit;
    }

    if (value === 1 && direction === "Previous") {
      getList(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
    } else {
      getList(listItemLimit, newStartIndex, parentNameFilter, typeAttribute, null);
    }
    setCrPageStartIndexOrg(newStartIndex);
  };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setPageNumberSubOrg(1);
        setCrPageStartIndexOrg(1);
    };

  const handleItemsPerPageMember = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
    setMemberListItemLimit(data.value as number);
    setMemberPageNo(1);
    setCrPageStartIndexMember(1);
  };

  const handleAddOrgAlert = (alert: AlertInterface) => {
    dispatch(addAlert<AlertInterface>(alert));
    getList(listItemLimit, listOffset, parentNameFilter, typeAttribute, null);
    setPageNumberSubOrg(1);
    setCrPageStartIndexOrg(1);
  };

  const handleParentOrgFilter = (query: string) => {
    //handleOrganisationFilter(query, true)
  }

  const handleMetaColumnChange = (metaColumns: string[]) => {

    /*  metaColumns.push("profileUrl"); */
    const tempColumns = new Map<string, string>();
    //setOrgMetaColumns(metaColumns);

    metaColumns.map((column) => {
      tempColumns.set(column, column)
    });

    setOrganisationListMetaContent(tempColumns);
    setListUpdated(true);
  };

  const getUserListPage = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
     console.log("");
  };

  const pagenumberEdit = (e) => {
    const currentPageNumbers = memberPageNo;
    const pageChangeNumber = parseInt(e);
    if((Number(pageChangeNumber)) && pageChangeNumber > 0){
      let newStartIndex = 0;
      const filter = `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.organization.id eq ${organisation.id}`;
      newStartIndex = listItemLimit * pageChangeNumber
      newStartIndex = newStartIndex + 1;
      newStartIndex = newStartIndex - listItemLimit;
      setMemberPageNo(pageChangeNumber);
      getUserListPage(listItemLimit, newStartIndex, filter, null, null);
    }else{
      setMemberPageNo(currentPageNumbers);
    }
};


  const panes = () => [
    {
      menuItem: "Attributes",
      render: () => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
          <OrganisationProfile
            onAlertFired={ handleAlerts }
            organisation={ organisation }
            handleOrganisationUpdate={ handleOrganisationUpdate }
          />
        </ResourceTab.Pane>
      )
    },
    {
      menuItem: "Sub Organisations",
      render: () => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
          {createSubOrganization?(
          <div className="text-right">
            <PrimaryButton
              className="sub-organisation-button"
              data-testid="user-mgt-user-list-add-user-button"
              onClick={ () => setShowWizard(true) }
            >
              { "Create Sub Organisation" }
            </PrimaryButton>
          </div>
          ):null}

          <PageLayout className="pageWidth tab-padding-fix">
            {
              <ListLayout
                // TODO add sorting functionality.
                showTopActionPanel={ false }
                data-testid="organisation-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                  <>
                    <Popup
                      className={ "list-options-popup" }
                      flowing
                      basic
                      content={
                        <OrganisationListOptionsComponent
                          data-testid="organisation-mgt-user-list-meta-columns"
                          handleMetaColumnChange={ handleMetaColumnChange }
                          organisationListMetaContent={
                            organisationListMetaContent
                          }
                        />
                      }
                      position="bottom left"
                      on="click"
                      pinned
                      trigger={
                        <Button
                          data-testid="organisation-mgt-user-list-meta-columns-button"
                          className="meta-columns-button hide-columns-filter"
                          basic
                        >
                          <Icon name="columns" />
                        </Button>
                      }
                    />
                  </>
                }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                showPagination={ true }
                totalPages={ Math.ceil(subOrganisation.length / listItemLimit) }
                totalListSize={ subOrganisation.length }
              >
                <SubOrganisationList
                  subOrganisationsList={ subOrganisation }
                  data-testid="user-mgt-user-list"
                  listView={ false }
                  organisation={ organisation }
                  setShowSubOrgDetails={ setShowSubOrgDetails }
                  handleOrganisationDelete = { handleOrganisationDelete }
                  setShowWizard = { setShowWizard }
                  suborganisationListGet={ getList }
                  listOffset={ listOffset }
                  listItemLimit={ listItemLimit }
                  parentNameFilter= { parentNameFilter }
                  typeAttribute= { parentNameFilter }
                  isLoading= { isOrganisationListRequestLoading }
                  parentName= { parentName }

                />
                { showWizard && (
                  <AddOrganization
                    data-testid="organisation-mgt-add-user-wizard-modal"
                    closeWizard={ () => setShowWizard(false) }
                    listOffset={ listOffset }
                    listItemLimit={ listItemLimit }
                    updateList={ () => setListUpdated(true) }
                    rolesList={ rolesList }
                    filterParentOrg={ handleParentOrgFilter }
                    onAlertFired={ handleAddOrgAlert }
                    parentOrg={ organisation }
                  />
                ) }
                { showSubOrgDetails && (
                  <SubOrganisationDetails
                    data-testid="organisation-mgt-add-user-wizard-modal"
                    closeDetailWizard={ () => setShowSubOrgDetails(false) }
                    listOffset={ listOffset }
                    listItemLimit={ listItemLimit }
                    updateList={ () => setListUpdated(true) }
                    rolesList={ rolesList }
                    filterParentOrg={ handleParentOrgFilter }
                    onAlertFired={ handleAddOrgAlert }
                    parentOrgList={ parentOrgList }
                    handleOrganisationUpdate={ handleOrganisationUpdate }
                    organisationProfile={ showSubOrgDetails }
                    getList={ getList }
                  />
                ) }
              </ListLayout>
            }
            <Pagination
              dataSource={ 10 }
              pageNo={ pageNumberSubOrg }
              onPagination={ (pageNumberSubOrg, direction) =>
                handlePaginationChangeSubOrg(pageNumberSubOrg, direction)
              }
              disabledNextButton={ subOrganisation.length < listItemLimit ? "disable-button" : "" }
              disabledPrevButton={ pageNumberSubOrg === 1 ? "disable-button" : "" }
              customClassName={ disablePagination }
              isEditable= { false }
              customPageNumber = { (e) => pagenumberEdit(e) }
            />
          </PageLayout>
        </ResourceTab.Pane>
      )
    },
    {
      menuItem: "Members",
      render: () => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
          {createNewUsers?(
          <div className="text-right member-organisation-button">
            <PrimaryButton
              data-testid="user-mgt-user-list-add-user-button"
              onClick={ () => setShowAddUserWizard(true) }
            >
              { "Create User" }
            </PrimaryButton>
          </div>
          ):null}

          <PageLayout className="pageWidth tab-padding-fix">
            <ListLayout
              currentListSize={ memberListItemLimit }
              listItemLimit={ memberListItemLimit }
              data-testid="organisation-mgt-user-list-layout"
              onPageChange={ handleMemberPage }
              showPagination={ true }
              totalPages={ Math.ceil(100 / 10) }
              // totalListSize={ usersList?.Resources?.length }
              // showTopActionPanel={ usersList?.Resources?.length === 0 }
              onItemsPerPageDropdownChange={
                handleItemsPerPageMember
              }
            >
              <MembersList
                usersList={ usersList }
                organisation={ organisation }
                updateUserList={ () => handleMemberPage(1, "Next") }
                updateList={ () => updateUserList() }
                setShowAddUserWizard={ setShowAddUserWizard }
                getUserList = { getUserList }
                memberListItemLimit = { memberListItemLimit }
              />
            </ListLayout>
            {/* { usersList?.Resources?.length > 0 && (
              <Pagination
              dataSource={ 20 }
              pageNo={ memberPageNo }
              onPagination={ (memberPageNo,direction) => handlePaginationMember(memberPageNo,direction) }
              disabledNextButton={ usersList.itemsPerPage < listItemLimit ? "disable-button": "" }
              disabledPrevButton={ memberPageNo === 1? "disable-button": "" }
              customClassName= { "assign-admin-pagination" }
              isEditable= { true }
              customPageNumber = { (e) => pagenumberEdit(e) }
              />
            ) } */}
          </PageLayout>

          {/* {showAddUserWizard && (
            <AddUserWizard
              data-testid="user-mgt-add-user-wizard-modal"
              closeWizard={ () => setShowAddUserWizard(false) }
              listOffset={ null }
              listItemLimit={ 10 }
              updateList={ () => updateUserList() }
              initialUserValue={ { organization: organisation?.name } }
              rolesList={ [] }
            />
          ) } */}
        </ResourceTab.Pane>
      )
    },
    {
      menuItem: "Roles",
      render: () => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
          <PageLayout className="pageWidth tab-padding-fix">
            <ListLayout
              currentListSize={ rolesListItemLimit }
              listItemLimit={ rolesListItemLimit }
              data-testid="organisation-mgt-user-list-layout"
              onPageChange={ handleRolesPage }
              showPagination={ true }
              totalPages={ Math.ceil(rolesResponseList?.Resources?.length / 10) }
              totalListSize={ rolesResponseList?.Resources?.length }
              showTopActionPanel={ rolesResponseList?.Resources?.length === 0 }
              onItemsPerPageDropdownChange={
                handleItemsPerPageMember
              }
            >
            <RolesList
            onAlertFired = { handleAlerts }
            organisation = { organisation }
            roleList={ sortedRoleList }
            isLoading= { roleListLoading }
            getRoleListFun = { getRoleListFun }
            //updatRolesList={ () => handleMemberPage(1, "Next") }
          />
            </ListLayout>
            { memberPageNo !== 1 || rolesResponseList?.totalResults > 0 && (
              <Pagination
                dataSource={ rolesResponseList?.totalResults }
                pageNo={ memberPageNo }
                onPagination={ (pageNumber, direction) =>
                  handleMemberPage(pageNumber, direction)
                }
                disabledNextButton={ rolesResponseList?.totalResults < memberListItemLimit ? "disable-button" : "" }
                disabledPrevButton={ memberPageNo === 1 ? "disable-button" : "" }
                customClassName={ "enable-pagination" }
                isEditable= { false }
                customPageNumber = { (e) => pagenumberEdit(e) }
              />
            ) }
          </PageLayout>
          
        </ResourceTab.Pane>
      )
    }
  ];

  return (
    <ResourceTab
      panes={ panes() }
    />
  );
};
