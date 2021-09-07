/* eslint-disable max-len */
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

import { Field, FormValue, Forms } from "@wso2is/forms";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dropdown,
    DropdownProps,
    Grid
} from "semantic-ui-react";
import Country from "../../data/country";
import language from "../../data/language";
import { AddOrganizationDetails } from "../models";

const { Option } = Select;

/**
 * Proptypes for the add user component.
 */
interface AddUserProps {
    initialValues: any;
    triggerSubmit: boolean;
    onParentSearch: () => void;
    selectedOrg?: any;
    isValidOrg?: boolean;
    checkOrgName?: (filter: string, attribute: string) => void;
    onSubmit: (values: any) => void;
    checkSubOrgCreation?: any;
    parentOrgList?: any;
    filterParentOrg?: (query: string) => void;
    setSelectedOrg?: (orgSelected: any) => void;
    change?: any;
    organisationListLoading?: boolean;
}

/**
 * Add user page.
 *
 * @return {ReactElement}
 */
export const AddOrganisation: React.FunctionComponent<AddUserProps> = (props: AddUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onParentSearch,
        onSubmit,
        selectedOrg,
        isValidOrg,
        checkOrgName,
        checkSubOrgCreation,
        parentOrgList,
        filterParentOrg,
        setSelectedOrg,
        organisationListLoading
    } = props;
 
    const { t } = useTranslation();
    const [displayName,setDisplayName] = useState<string>("")
    const [selectedParentOrg, setSelectedParentOrg] = useState(selectedOrg || checkSubOrgCreation || "")
    const [ organisationCountry, setOrganisationCountry ] = useState<any>();
    const [ organisationLocale, setOganisationLocale ] = useState<any>();
    const orgType = [
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

    const statusOption = [
        {
            key: 0,
            text: "ACTIVE",
            value: "ACTIVE"
            
        },{
            key: 1,
            text: "DISABLED",
            value: "DISABLED"
            
        },
        {
            key: 2,
            text: "DELETED",
            value: "DELETED"
            
        }
    ]

    const getFormValues = (values: Map<string, FormValue>): AddOrganizationDetails => {
        return {
            name: values.get("name").toString(),
            displayName: values.get("displayName").toString(),
            Type: values.get("Type").toString(),
            parentId: selectedParentOrg?.name || "",
            status: values.get("status").toString(),
            description: values.get("description").toString(),
            country: organisationCountry || initialValues && initialValues.country || "NULL",
            segment: values.get("segment").toString(),
            locale: organisationLocale || initialValues && initialValues.locale || "null"
            // source: values.get("source").toString()
        };
    };

    useEffect(() => {
        setSelectedParentOrg(selectedOrg);
    }, [selectedOrg])

    const copyToDisplayName = (values: Map<string, FormValue>): void => {
        checkOrgName(values?.get("name")?.toString(), "Type")
        setDisplayName(values?.get("name")?.toString());
    };

    const handleParentOrgChange = (value) => {
        filterParentOrg(`substring(name,'${value}')`)
        setSelectedParentOrg({});
        setSelectedOrg(null);
    }

    const handleCountryFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setOrganisationCountry(data.value as string);
    };

    
    const handleLocaleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setOganisationLocale(data.value as string);
    };

    const options = () => {
        return (
            <>
                { parentOrgList?.length > 0 ? parentOrgList.map((org, index) => {
                    return (
                        <option key={ index }>{ org.name }</option>
                    )
                }) : "" }
            </>
        )
    }

    const organizationChange = (value) => {
        if (value) {
            const selectedParent = parentOrgList.filter((d) => value.value === d.id);
            setSelectedParentOrg(selectedParent[0]);
            setSelectedOrg(selectedParent[0]);
        } else {
            setSelectedParentOrg(null);
            setSelectedOrg(null);
        }
    }
    /**
     * The modal to add new user.
     */
    const addUserBasicForm = () => (
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
                            data-testid="user-mgt-add-user-form-lastName-input"
                            label={ "Organisation Name" }
                            name="name"
                            placeholder={ "Enter the organisation name" }
                            required={ true }
                            requiredErrorMessage="Please enter an Organisation name"
                            type="text"
                            listen={ debounce(copyToDisplayName, 1000) }
                            value={ initialValues && initialValues.name }
                            maxLength={ 256 }
                        />
                        {!isValidOrg && (
                            <p className="error-label ui pointing above prompt label">
                                Organisation already exists
                            </p>
                        )}
                    </Grid.Column>
                  <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-lastName-input"
                            label={ "Organisation Display Name" }
                            name="displayName"
                            placeholder={ "Enter the organisation display name" }
                            required={ true }
                            requiredErrorMessage="Please enter an Organisation display name"
                            type="text"
                            value={ initialValues && initialValues.displayName }
                            maxLength={ 256 }
                        />
                    </Grid.Column> 
                </Grid.Row>

            <Grid.Row columns={ 2 }>

            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-honorificPrefix-dropdown"
                            type="dropdown"
                            label={ "Type" }
                            required={ true }
                            name="Type"
                            children={ orgType }
                            requiredErrorMessage=""
                            placeholder={ "Select" }
                            value={ (initialValues && initialValues.Type) || orgType[0].value }
                        />
                    </Grid.Column> 

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-firstName-input"
                            label="Status"
                            name="status"
                            placeholder={ "Status" }
                            required={ false }
                            children={ statusOption }
                            requiredErrorMessage="Status is required"
                            type="dropdown"
                            disabled
                            readOnly
                            value={ (initialValues && initialValues.status) || statusOption[0].value }
                        />
                    </Grid.Column>
                    
                </Grid.Row>

                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Grid>
                            <Grid.Column width={ 14 }>
                                {/* <Field
                                    data-testid="user-mgt-add-user-form-organization-input"
                                    label={ "Parent Organisation Name" }
                                    name="parentId"
                                    placeholder={ "Select parent organisation" }
                                    requiredErrorMessage="Parent Organisation Name is required"
                                    type="text"
                                    required={ false }
                                    listen={ debounce(handleParentOrgChange, 1000) }
                                    value={ initialValues && initialValues.parentId || selectedParentOrg && selectedParentOrg.displayName }
                                />
                                { !selectedParentOrg?.id && parentOrgList?.length > 0 ? (
                                    <Radio.Group onChange={ organizationChange }>
                                        { parentOrgList.map((value, index) => {
                                            if (index === 0) {
                                                return (
                                                    <Radio value={ value } key={ index }>{ value.displayName ? value.displayName : value.name }</Radio>
                                                )
                                            }
                                        }) }
                                    </Radio.Group>
                                ) : "" }  */}
                                <label className="organization-label">Parent Organisation Name</label>
                                <Select
                                    showSearch
                                    labelInValue
                                    // value={ (initialValues && initialValues.parentId) }
                                    placeholder="Select parent organisation"
                                    className="parent-select-org"
                                    notFoundContent={ organisationListLoading ? <Spin size="small" /> : null }
                                    filterOption={ false }
                                    onSearch={ handleParentOrgChange }
                                    onChange={ organizationChange }
                                    style={ { width: "106%" } }
                                    size="large"
                                    value={ selectedParentOrg?.name ? { value: selectedParentOrg?.name || selectedParentOrg?.id || null } : undefined }
                                    disabled={ checkSubOrgCreation }
                                    allowClear
                                >
                                    { parentOrgList?.length > 0 && parentOrgList.map(d => (
                                        <Option key={ d.id } value={ d.id }>{ d.name }</Option>
                                    )) }
                                </Select>
                            </Grid.Column>
                            <Grid.Column width={ 2 } className="search-btn">
                                {!checkSubOrgCreation && (
                                    // eslint-disable-next-line max-len
                                    <i aria-hidden="true" className="search icon" onClick={ () => onParentSearch() }></i>
                                )}
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-firstName-input"
                            label={ "Description" }
                            name="description"
                            placeholder={ "Short description about organisation" }
                            required={ false }
                            requiredErrorMessage={ "" }
                            type="text"
                            value={ initialValues && initialValues.description }
                            maxLength={ 256 }
                        />
                    </Grid.Column> 

                </Grid.Row>

                <Grid.Row columns={ 2 }>

                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } >
                        <div>
                        <label>Country</label>
                        <Dropdown
                        className="country-label"
                        data-testid="user-mgt-add-user-form-country-dropdown"
                        placeholder="Country"
                        name="country"
                        label="country"
                        search 
                        selection
                        required={ false }
                        options={ Country }
                        defaultValue={ initialValues && initialValues.country }
                        value={ organisationCountry ? organisationCountry : null }
                        onChange={ handleCountryFilterChange }
                        />
                        </div>
                    
                 </Grid.Column> 
                 <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-firstName-input"
                            label={ "Segment" }
                            name="segment"
                            placeholder={ "Type the segment" }
                            required={ false }
                            requiredErrorMessage={ "" }
                            type="text"
                            value={ initialValues && initialValues.segment }
                            maxLength={ 100 }
                        />
                    </Grid.Column> 
                </Grid.Row>

                 <Grid.Row columns={ 2 }>

                 <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <div>
                        <label>Locale</label>
                        <Dropdown
                        className="country-label"
                        data-testid="user-mgt-add-user-form-is2FAEnabled-input"
                        placeholder="Locale"
                        name="locale"
                        label="Locale"
                        search 
                        selection
                        required={ false }
                        options={ language }
                        defaultValue={ initialValues && initialValues.locale }
                        value={ organisationLocale }
                        onChange={ handleLocaleFilterChange }
                        />
                        </div>

                    </Grid.Column> 
                 {/* <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-firstName-input"
                            label={ "Source" }
                            name="source"
                            placeholder={ "Enter the value" }
                            required={ false }
                            requiredErrorMessage={ "" }
                            type="text"
                            value={ initialValues && initialValues.source }
                        />
                    </Grid.Column>  */}
                </Grid.Row>

                

            </Grid>
        </Forms>
    );

    return (
        <>
            { addUserBasicForm() }
        </>
    );
};
