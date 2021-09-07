/* eslint-disable max-len */
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
 * under the License
 */

import {
    AlertInterface,
    AlertLevels,
    ProfileSchemaInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Radio } from "antd";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Dropdown, DropdownProps, Form, Grid, Modal } from "semantic-ui-react";
import { AppConstants, AppState, OrganisationAdvancedSearch, UIConstants, history } from "../../core";
import countries from "../../data/country";
// import organization from "../../data/disableOrganization"
import language from "../../data/language";
import { deleteOrganisation, getOrganisationList } from "../../organisation/api";
import { OrganisationConstants } from "../../organisation/constants";
import { updateOrgInfo } from "../api";
/**
 * Prop types for the basic details component.
 */
interface OrganisationProfilePropsInterface extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    organisation;
    filterParentOrg?: (query: string) => void;
    parentOrgList? : any;
    handleOrganisationUpdate: (userId: string) => void;
}

/**
 * Basic details component.
 *
 * @param {UserProfilePropsInterface} props - Props injected to the basic details component.
 * @return {ReactElement}
 */
export const OrganisationProfile: FunctionComponent<OrganisationProfilePropsInterface> = (
    props: OrganisationProfilePropsInterface
): ReactElement => {

    const {
        onAlertFired,
        organisation,
        handleOrganisationUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ organisationData, setOrganisationData ] = useState<any>([]);
    const [ organisationType, setOrganisationType ] = useState<any>([]);
    const [ organisationCountry, setOrganisationCountry ] = useState<any>();
    const [ organisationCountryName, setOrganisationCountryName ] = useState<any>();
    const [ organisationLocale, setOganisationLocale ] = useState<any>();
    const [ organisationLocaleName, setOrganisationLocaleName ] = useState<any>();
    const [ organisationSegment, setOganisationSegment ] = useState<any>([]);
    const [ organisationStatus, setOrganisationStatus ] = useState<any>([]);
    const [ checkReadOnly, setCheckReadOnly ] = useState<boolean>(true);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganisation, setDeletingOrganisation ] = useState<any>("");

    const [orgStore, setOrgStore] = useState<any>(undefined);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [showhideFrom,setShowhideFrom] = useState<boolean>(true);
//   const [ deletingUser, setDeletingUser ] = useState<ProfileInfoInterface>(undefined);
    const [showManagerSearch,setShowManagerSearch] = useState<boolean>(false);
    const [ parentOrganizationName, setParentOrganizationName] = useState<string>("");
    const [showOrganizationSearch,setShowOrganizationSearch] = useState<boolean>(false);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [organisationTxt, setOrganisationTxt] = useState<string>("");
    const [organisationClass, setOrganisationClass] = useState<string>("");
    const [orgSearchQuery, setOrgSearchQuery] = useState<string>("");
    const [organisationShow, setOrganisationShow] = useState<boolean>(false);
    const [organisationList, setOrganisationList] = useState<any>([]);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const typeAttribute = OrganisationConstants.DEFAULT_ORG_LIST_ATTRIBUTES[0];
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const [orgDeleteDisable, setorgDeleteDisable] = useState<boolean>(true);
    const [orgDetailUpdate, setOrgDetailUpdate] = useState<boolean>(false);
    const [countryDropdownChanged, setCountryDropdownChanged] = useState<boolean>(false);
    const [localeDropdownChanged, setLocaleDropdownChanged] = useState<boolean>(false);

    const [organization] = useState([]);
    

    const type = [
        {
            key: 0,
            text: "Company",
            value: "Company"
            
        },{
            key: 1,
            text: "Department",
            value: "Department"
            
        },
        {
            key: 2,
            text: "BYOXFED",
            value: "BYOXFED"
            
        },
        {
            key: 3,
            text: "Branch",
            value: "Branch"
        }
    ];

    const status = [
        {
            key: 0,
            text: "ACTIVE",
            value: "ACTIVE"
        },
        {
            key: 1,
            text: "DISABLED",
            value: "DISABLED"
        }
    ]

    const findValueByKey = (attributes, key): void => {
        const match = attributes.filter(function (attributes) {
            return attributes.key == key;
        });
        return match[0] && match[0].value != "NULL" ? match[0].value : null;
    };

    const findCountryLocaleName = (attributes, key): void => {
        const match = attributes.filter(function (attributes) {
            return attributes.value == key;
        });
        return match[0] ? match[0].key : "";
    };

    const handleCountryFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setOrganisationCountry(data.value as string);
        setCountryDropdownChanged(true);
    };

    const handleLocaleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setOganisationLocale(data.value as string);
        setLocaleDropdownChanged(true);
    };
    
    
    useEffect(() => {
        setOrganisationData(organisation);
        if(typeof organisation.attributes !== "undefined" ) {
            setOrganisationStatus(organisation.status);
            setOrganisationType(findValueByKey(organisation.attributes, "Type"));
            setOganisationSegment(findValueByKey(organisation.attributes, "segment"));
            const orgCountry = findValueByKey(organisation.attributes, "country");
            if (!countryDropdownChanged) {
                setOrganisationCountry(orgCountry);
            }
            const orgLocale = findValueByKey(organisation.attributes, "locale");
            if (!localeDropdownChanged) {
                setOganisationLocale(orgLocale);
            }
            const countryKey = findCountryLocaleName(countries, orgCountry);
            setOrganisationCountryName(countryKey);
            const langKey = findCountryLocaleName(language, orgLocale);
            setOrganisationLocaleName(langKey);
            organisation.parent ? setParentOrganizationName(organisation.parent.name) : null;
        }
     
        permissions(organisation);

    }, [organisation, orgDetailUpdate]);

    const rootOrganizationDisable = (orgName) => {
        let organizationEdit = true
        organization.map((value) => {
          if(orgName.name == value.value)
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
                setCheckReadOnly(false);
             }
            
             if(rootOrganizationDisable(response) == false){
                setCheckReadOnly(true);
                setorgDeleteDisable(false);
             }
          }
         )
        } 
     };
 

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values
     */
    const handleSubmit = (values: Map<string, string | string[]>): void => {
              
            const operation = [
            {
                "op" : "replace",
                "path" : "/displayName",
                "value" : values.get("organisation-display-name").toString()
            },
            {
                "op" : "replace",
                "path" : "/description",
                "value" : values.get("organisation-description").toString()
            },
            {
                "op" : "replace",
                "path" : "/status",
                "value" : values.get("organisation-status").toString()
            },
            {
                "op" : "replace",
                "path" : "/attributes/segment",
                "value" : values.get("attributes-segment").toString()
            },
            {
                "op" : "replace",
                "path" : "/attributes/Type",
                "value" : values.get("attributes-type").toString()
            },
            {
                "op" : "replace",
                "path" : "/attributes/country",
                "value" : organisationCountry || "NULL"
            },
            {
                "op" : "replace",
                "path" : "/attributes/locale",
                "value" : organisationLocale || "null"
            }
        ]
       
        const operations = operation.filter(function (op) {
              if((op.value !== "")) {
                  return op;
              }
        })

        updateOrgInfo(organisation.id, operations).then((response) => {

            onAlertFired({
                    description: t("adminPortal:organisation.notifications.update_success.message"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:organisation.notifications.update_success.description")
                });
                handleOrganisationUpdate(organisation.id);
                setCheckReadOnly(true);
                setOrgDetailUpdate(!orgDetailUpdate);
                //history.push(AppConstants.PATHS.get("ORGANISATIONS"));
        }).catch((error) => {
            if (error) {
                dispatch(addAlert({
                    description: t("adminPortal:organisation.notifications."+ error +".message"),
                    level: AlertLevels.WARNING,
                    message: t("adminPortal:organisation.notifications."+ error +".description")
                }));
            }
            else {
                dispatch(addAlert({
                    description: t("adminPortal:organisation.notifications.generic_update.message"),
                    level: AlertLevels.ERROR,
                    message: t("adminPortal:organisation.notifications.generic_update.description")
                }));
            }
       
        });
}
  

    const parentOrganizationChange = (e) => {
        const parentOrgName = e.target.value.name;
        const parentOrgId = e.target.value.id;
        const status = e.target.value.status;
      //  onHandleStatus(parentOrgName, parentOrgId, status);
        while(status){
            if(status !== "ACTIVE"){
                dispatch(addAlert({
                    description: "Parent Orgnisation must be ACTIVE",
                    level: AlertLevels.ERROR,
                    message: "Choose Appropriate Organisation"
                }));
                
            }
            else{
            setParentOrganizationName(parentOrgName);
            setOrganizationId(parentOrgId);
            setOrganisationShow(false);
            setModalOpen(false);
            }
            break;
        }
            
        
        
    };

    const closeWizard = () => {
        setModalOpen(false);
        setShowManagerSearch(false);
        setShowOrganizationSearch(false);
        setShowhideFrom(false);
    };

    const showHideForm = (e) => {
        setShowhideFrom(!e);
    };

    /**
     * Oraganization list
     * @param values 
     */

    // eslint-disable-next-line max-len
    const getOrgList = (limit: number, offset: number, filter: string, attribute: string, domain: string, isParentOrgSearch: boolean = false) => {
        getOrganisationList(limit, offset, filter, attribute, "")
        .then((response) => {
                setOrganisationList(response);
        })
        .finally(() => {
            // setOrganisatonListRequestLoading(false);
        });
};

    const organizationBsSearch = (value: string): void => {
        const query = "name eq " + "'"+ value +"'";
        getOrgList(listItemLimit, listOffset, query, "Type", orgStore);
        setOrganisationShow(true);
        
        if(value === null || value === ""){
          setOrganisationList([])
        }
  
      };

      const handleOrganisationFilter = (query: string, isParentOrgSearch?: boolean): void => {
        //  const attributes = generateAttributesString(organisationListMetaContent.values());
          const attributes = typeAttribute;
          if (query === "name eq") {
            getOrgList(listItemLimit, listOffset, null, attributes, orgStore, isParentOrgSearch);
              return;
          }
          if(query && !query.includes("'")){
              const queryArray = query.split(" ");
              query = queryArray[0] + " " + queryArray[1] + " " + "'" + queryArray[2] + "'";
          }             
          
          setOrgSearchQuery(query);
          getOrgList(listItemLimit, listOffset, query, attributes, orgStore, isParentOrgSearch);
      };

      const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

      const handleOrganisationDelete = (orgId: string): void => {
        deleteOrganisation(orgId)
            .then(() => {
                handleAlerts({
                    description: t("adminPortal:organisation.notifications.delete_success.message"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:organisation.notifications.delete_success.description")
                });
                history.push(AppConstants.PATHS.get("ORGANISATIONS"));
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

    
    /**
     * This function generates the user profile details form based on the input Profile Schema
     *
     * @param {ProfileSchemaInterface} schema
     * @param {number} key
     */
    const generateOrganisationEditForm = (): JSX.Element => {
        return (
            <>
            <Grid.Row columns={ 2 } className="organisation-read-only">
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8  }>
                            <Field
                            data-testid="org-mgt-organisation-name"
                            type="text"
                            label={ "Organisation Name" }
                            name="organisationName"
                            requiredErrorMessage={ "" }
                            required={ true }
                            placeholder={ "Organisation Name" }
                            value={ organisationData.name ? organisationData.name : "" }
                            readOnly
                        /> 
                </Grid.Column>

                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                            <Field
                            data-testid="org-mgt-organisation-display-name"
                            type="text"
                            label={ "Organisation Display Name" }
                            name="organisation-display-name"
                            requiredErrorMessage={ "Organisation display name required" }
                            required={ true }
                            readOnly={ checkReadOnly } 
                            placeholder={ "Organisation Display Name" }
                            value={ organisationData.displayName ? organisationData.displayName : "" }
                        /> 
                </Grid.Column>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                            <Field
                            data-testid="org-mgt-description"
                            type="text"
                            label={ "Description" }
                            name="organisation-description"
                            requiredErrorMessage={ "" }
                            required={ false }
                            readOnly={ checkReadOnly } 
                            placeholder={ "Description" }
                            value={ organisationData.description ? organisationData.description : "" } 
                        /> 
                </Grid.Column>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                    { checkReadOnly ? 
                        <Field
                        data-testid="org-mgt-country"
                        type="text"
                        label={ "Country" }
                        name="attributes-country"
                        requiredErrorMessage={ "" }
                        readOnly={ checkReadOnly } 
                        placeholder={ "country" }
                        required={ false }
                        value={ organisationCountryName ? countries[organisationCountryName].text:"" }
                        /> : 
                        <div>
                        <label>Country</label>
                        <Dropdown
                        className="country-label"
                        data-testid="org-mgt-country"
                        placeholder="Country"
                        name="attributes-country"
                        label="Country"
                        search 
                        selection
                        required={ false }
                        options={ countries } 
                        value={ organisationCountry ? organisationCountry : null }
                        onChange={ handleCountryFilterChange }
                        />
                        </div>
                    }
                            
                </Grid.Column>

                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                    { checkReadOnly ? 
                    <Field
                    data-testid="org-mgt-status"
                    type="text"
                    label={ "Status" }
                    name="organisation-status"
                    requiredErrorMessage={ "" }
                    required={ true }
                    readOnly={ checkReadOnly } 
                    placeholder={ "Status" }
                    value={ organisationData.status ? organisationData.status : "" } 
                /> : 
                    <Field
                            data-testid="org-mgt-status"
                            type="dropdown"
                            label={ "Status" }
                            name="organisation-status"
                            requiredErrorMessage={ "" }
                            required={ true }
                            readOnly={ checkReadOnly } 
                            placeholder={ "Status" }
                            children = { status }
                            value={ organisationStatus } 
                        />
                }
                            
			</Grid.Column>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                    { checkReadOnly ? 
                        <Field
                        data-testid="org-mgt-language"
                        type="text"
                        label={ "Locale" }
                        name="attributes-lanuage"
                        requiredErrorMessage={ "" }
                        required={ false }
                        readOnly={ checkReadOnly }
                        placeholder={ "languages" }
                        value={ organisationLocaleName ? language[organisationLocaleName].text : "" }
                    /> : 
              
                        <div>
                        <label>Locale</label>
                        <Dropdown
                        className="country-label"
                        data-testid="org-mgt-language"
                        placeholder="Locale"
                        name="attributes-lanuage"
                        label="Locale"
                        search 
                        selection
                        required={ false }
                        options={ language } 
                        value={ organisationLocale ? organisationLocale : "" }
                        onChange={ handleLocaleFilterChange }
                        />
                        </div>
                    }
                            
                </Grid.Column>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                    { checkReadOnly ? 
                    <Field
                    data-testid="org-mgt-type"
                    type="text"
                    label={ "Type" }
                    name="attributes-type"
                   // children={ type }
                    requiredErrorMessage={ "" }
                    required={ true }
                    readOnly={ checkReadOnly } 
                    placeholder={ "Type" } 
                    value={ organisationType ? organisationType : "" } 
                    /> : 
                    <Field
                    data-testid="org-mgt-type"
                    type="dropdown"
                    label={ "Type" }
                    name="attributes-type"
                    children={ type }
                    requiredErrorMessage={ "" }
                    required={ true }
                    readOnly={ checkReadOnly } 
                    placeholder={ "Type" } 
                    value={ organisationType ? organisationType : "" } 
            /> }
                            
                </Grid.Column>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                            <Field
                            data-testid="org-mgt-segment"
                            type="text"
                            label={ "Segment" }
                            name="attributes-segment"
                            requiredErrorMessage={ "" }
                            required={ false }
                            readOnly={ checkReadOnly } 
                            placeholder={ "Segment" }
                            value={ organisationSegment ? organisationSegment : "" }
                           
                        />   
                </Grid.Column>
                
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } >
                 <Field
                   data-testid="user-mgt-add-user-form-organization-input"
                   label={ "Parent Organisation" }
                   name="parent organisation"
                   placeholder={ "" }
                   requiredErrorMessage={ "" }
                   type="text"
                   required={ false }
                   maxLength="254"
                   value={ parentOrganizationName ? parentOrganizationName : organisationTxt }
                   readOnly
                /> 
              </Grid.Column> 
             {/* }  */}
                </Grid.Row> 
                
                <Grid.Row>
                    {checkReadOnly ? 
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>                    
                    </Grid.Column> : 
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                    <Form.Group>
                        <PrimaryButton
                      size="small"
                      type="submit"
                    //  onClick= { handleUpdateUserInfo }
                      className= "edit-button"
                      data-testid={ `${testId}-update-button` }
                        >
                        Update
                        </PrimaryButton>
                    </Form.Group>
                    </Grid.Column>}
                    </Grid.Row>
                    </>
                
           
        );
    };

    const organizationAdvancedSearch = () => {
        return(
           <> 
          <div className="search-dp-wrapper" onClick={ () => showHideForm(showhideFrom) }>Search by Organisation <i aria-hidden="true" className="dropdown icon"></i></div>         
          { showhideFrom && showhideFrom?(
           <OrganisationAdvancedSearch
               onFilter={ handleOrganisationFilter }
               filterAttributeOptionOne={ [
                   {
                       key: 0,
                       text: "Organisation Name",
                       value: "name"
                   }]
               }
               filterAttributeOptionTwo={ [ {
                       key: 0,
                       text: "Type",
                       value: "attributeValue"
                   }]
               }
               filterAttributeOptionThree={ [{
                       key: 0,
                       text: "Organisation Status",
                       value: "status"
                   }]
               }    
               filterAttributeOptionFour={ [{
                       key: 0,
                       text: "Parent Organisation Name",
                       value: "parentName"
                   }]
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
               defaultSearchAttribute={ "name" }
               defaultSearchOperator={ "eq" }
               triggerClearQuery={ triggerClearQuery }
               searchBoxShow={ false }
           />
           ):""}
           <div className="user-update-organization-list wrapper">
           {organisationList && organisationList !== []?(   
             <>   
               <Radio.Group onChange={ parentOrganizationChange }>
                 { organisationList.map((value,index) => ( 
                  <Radio value={ value } key={ index }>{ value.name }</Radio>     
                 ))}
               </Radio.Group>
             </>
           ):null}
           </div>
          </> 
        )
      };

    return (
        <>
            {
                    <EmphasizedSegment>
                        <Forms
                            data-testid={ `${ testId }-form` }
                            onSubmit={ (values) => handleSubmit(values) }
                        >
                            <Grid>
                               { 
                              generateOrganisationEditForm()  
                                } 
                            </Grid>
                        </Forms>
                    </EmphasizedSegment>
      
            }
            <Divider hidden />
            { orgDeleteDisable ?(
            <DangerZoneGroup sectionHeader={ t("adminPortal:components.user.editUser.dangerZoneGroup.header") }>
                <DangerZone
                    data-testid={ `${ testId }-danger-zone` }
                    actionTitle={ "Delete Organisation" }
                    header={ "Delete Organisation" }
                    subheader={ "If you delete this organisation, you will not be able to get it back. Please proceed with caution." }
                    onActionClick={ (): void => {
                        setShowDeleteConfirmationModal(true);
                        setDeletingOrganisation(organisation);
                    } }
                />
            </DangerZoneGroup>
            ):null }
            {
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingOrganisation?.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={ "adminPortal:components.user.deleteUser.confirmationModal." +
                                    "assertionHint" }
                                    tOptions={ { userName: deletingOrganisation?.name } }
                                >
                                    Please type <strong>{ deletingOrganisation?.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOrganisationDelete(deletingOrganisation?.id) }
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
                
            }
        </>
    );
};

/**
 * User profile component default props.
 */
OrganisationProfile.defaultProps = {
    "data-testid": "user-mgt-user-profile"
};
