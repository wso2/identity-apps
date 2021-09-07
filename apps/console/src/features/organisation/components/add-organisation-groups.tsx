/* eslint-disable react/no-unescaped-entities */
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


import { Field, FormValue, Forms } from "@wso2is/forms";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Radio } from "antd";
import _ from "lodash";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid
} from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, UIConstants } from "../../core";
import { getUsersList } from "../api";
import { BasicUserOptional,UserListInterface } from "../models";



/**
 * Proptypes for the application consents list component.
 */
// interface AddUserGroupPropsInterface {
//     initialValues: any;
//     triggerSubmit: boolean;
//     onSubmit: (values: any) => void;
//     handleGroupListChange: (groups: any) => void;
//     handleTempListChange: (groups: any) => void;
//     handleInitialTempListChange: (groups: any) => void;
//     handleInitialGroupListChange: (groups: any) => void;
//     handleSetGroupId: (groupId: string) => void;
// }



/**
 * Proptypes for the add user component.
 */
interface AddUserProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    headerHide: any;
}

/**
 * User role component.
 *
 * @return {ReactElement}
 */
export const AddUserGroup: React.FunctionComponent<AddUserProps> = (props: AddUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        headerHide
    } = props;

    const [managerListPopup, setManagerListPopup] = useState<boolean>(false);
    const [userMangers, setUserManagers] = useState<UserListInterface>();
    const [managerValue,setManagerValue] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    // const [ userStore, setUserStore ] = useState(undefined);
   
    const { t } = useTranslation();

    useEffect(() => {

      getUsersList(listItemLimit, listOffset,null,null,null).then((response) => {
          setUserManagers(response);
      })
    },[]);


    const getFormValues = (values: Map<string, FormValue>): BasicUserOptional => {
        return {
            department: values.get("department").toString(),
            employeeNumber: values.get("employeeNumber").toString(),
            manager: values.get("manager").toString(),
            costCenter: values.get("costCenter").toString(),
            streetAddress: values.get("streetAddress").toString(),
            locality: values.get("locality").toString(),
            postalCode: values.get("postalCode").toString(),
            // region: values.get("region").toString(),
            title: values.get("title").toString(),
            userType: values.get("userType").toString()
        };
    };

    const addManger = () => {
        setManagerListPopup(true);
        headerHide(true);
    }

    const managerSelect = () => {
        setManagerListPopup(false);
        headerHide(false);
    }

    const radioButtonChange = (e) => {
        setManagerValue(e.target.value);
    }

    const managerCancel = () => {
        setManagerListPopup(false);
        headerHide(false);
    }


    const handleUserFilter = (query: string): void => {
        // const attributes = generateAttributesString(userListMetaContent.values());
        if (query === "userName sw ") {
            getUsersList(listItemLimit, listOffset, null, null, null).then((response) => {
                setUserManagers(response);
            })
        }

        // setSearchQuery(query);
        // console.log(query);
        getUsersList(listItemLimit, listOffset, query, null, null).then((response) => {
            setUserManagers(response);
        })
    };

    const userListPopup = () => {
        return(
            <>
            <div className="wizard-header header">Manager's userName</div>
          
            <div className="user-list-wrapper">
             {userMangers && userMangers.Resources?(   
              <>   
            <div className="button-wrapper">

            <LinkButton
                data-testid={ "cancel-button" }
                floated="left"
                onClick={ managerCancel }
            >
                Cancel
            </LinkButton>
                <PrimaryButton
                   data-testid={ "select-button" }
                    floated="right"
                    onClick={ managerSelect }
                >
                    Select
                </PrimaryButton>

            </div>
            </>
            ):null}
            </div>
            </>
        );
    }

    const additionalInformation = () => {
        return (
            <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>

            <Grid.Row columns={ 2 }>
                     <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                                data-testid="user-mgt-add-user-form-title-input"
                                label={ "Job title" }
                                name="title"
                                placeholder={ "Job title" }
                                requiredErrorMessage={ "Job title is required" }
                                type="text"
                                required={ false }
                                value={ initialValues && initialValues.title }
                            />
                     </Grid.Column> 
    
                     <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                                data-testid="user-mgt-add-user-form-userType-input"
                                label={ "User type" }
                                name="userType"
                                placeholder={ "User type" }
                                requiredErrorMessage={ "User type is required" }
                                type="text"
                                required={ false }
                                value={ initialValues && initialValues.userType }
                            />
                     </Grid.Column>
    
                    </Grid.Row>   
         
            <Grid.Row columns={ 2 }>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-employeeNumber-input"
                            label={ "Employee Number" }
                            name="employeeNumber"
                            placeholder={ "Employee Number" }
                            required={ false }
                            requiredErrorMessage={ "Employee Number is required" }
                            type="text"
                            value={ initialValues && initialValues.employeeNumber }
                        />
                    </Grid.Column>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="manager-section">
                        <Field
                            data-testid="user-mgt-add-user-form-manager-input"
                            label={ "Manager" }
                            name="manager"
                            placeholder={ "Manager" }
                            required={ false }
                            requiredErrorMessage={ "Manager is required" }
                            type="email"
                            value={ managerValue }
                        />
                        <i aria-hidden="true" className="search icon" onClick= { addManger }></i>
                    </Grid.Column>
                    
                </Grid.Row>
                
                <Grid.Row columns={ 2 }>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-department-input"
                            label={ "Department Number" }
                            name="department"
                            placeholder={ "Department Number" }
                            required={ false }
                            requiredErrorMessage={ "Department Number is required" }
                            type="text"
                            value={ initialValues && initialValues.department }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-costCenter-input"
                            label={ "Cost Center" }
                            name="costCenter"
                            placeholder={ "Cost Center" }
                            required={ false }
                            requiredErrorMessage={ "Cost Center is required" }
                            type="text"
                            value={ initialValues && initialValues.costCenter }
                        />
                    </Grid.Column>
                    
                </Grid.Row>   

                <Grid.Row columns={ 2 }>
                    
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-streetAddress-input"
                            label={ "Address - Street" }
                            name="streetAddress"
                            placeholder={ "Address - Street" }
                            required={ false }
                            requiredErrorMessage={ "Address - Street is required" }
                            type="text"
                            value={ initialValues && initialValues.streetAddress }
                        />
                    </Grid.Column>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-locality-input"
                            label={ "Locality Name" }
                            name="locality"
                            placeholder={ "Locality Name" }
                            required={ false }
                            requiredErrorMessage={ "Locality Name is required" }
                            type="text"
                            value={ initialValues && initialValues.locality }
                        />
                    </Grid.Column>
                    
                </Grid.Row> 

                <Grid.Row columns={ 2 }>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-postalCode-input"
                            label={ "Postal Code" }
                            name="postalCode"
                            placeholder={ "Postal Code" }
                            required={ false }
                            requiredErrorMessage={ "Postal Code is required" }
                            type="text"
                            value={ initialValues && initialValues.postalCode }
                        />
                    </Grid.Column>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-country-input"
                            label={ "Country" }
                            name="country"
                            placeholder={ "Country" }
                            required={ false }
                            requiredErrorMessage={ "" }
                            type="text"
                            value={ initialValues && initialValues.country }
                            readOnly
                        />
                    </Grid.Column>
                </Grid.Row> 
                </Grid>
        </Forms>
        )
    }


    return (
        <>
        {managerListPopup? (userListPopup()):(
        additionalInformation()
        )}
        </>
    );
};
