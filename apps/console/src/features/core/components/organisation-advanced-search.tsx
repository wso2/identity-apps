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

import { TestableComponentInterface } from "@wso2is/core/models";
import { SearchUtils } from "@wso2is/core/utils";
import { DropdownChild, Field, Forms } from "@wso2is/forms";
import {
  AdvancedSearch,
  AdvancedSearchPropsInterface,
  LinkButton,
  PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownProps,
  Form, 
  Grid
} from "semantic-ui-react";
import countries from "../../data/country";
import language from "../../data/language";
import { AdvancedSearchIcons } from "../configs";

export interface OrganisationAdvancedSearchPropsInterface
  extends TestableComponentInterface {
  /**
   * Default Search attribute. ex: "displayName"
   */
  defaultSearchAttribute: string;
  /**
   * Default Search operator. ex: "eq"
   */
  defaultSearchOperator: string;
  /**
   * Position of the search dropdown.
   */
  dropdownPosition?: AdvancedSearchPropsInterface["dropdownPosition"];
  /**
   * Callback to be triggered on filter query change.
   */
  onFilter: (query: string) => void;
  /**
   * Filter attributes options.
   */
  filterAttributeOptionOne: DropdownChild[];
  filterAttributeOptionTwo: DropdownChild[];
  filterAttributeOptionThree: DropdownChild[];
  filterAttributeOptionFour: DropdownChild[];
  /**
   * Filter condition options.
   */
  filterConditionOptions?: DropdownChild[];
  /**
   * Filter conditions placeholder.
   */
  filterConditionsPlaceholder?: string;
  /**
   * Filter value placeholder.
   */
  filterValuePlaceholder?: string;
  /**
   * Search input placeholder.
   */
  placeholder: string;
  /**
   * Submit button text.
   */
  submitButtonLabel?: string;
  /**
   * Reset button text.
   */
  resetButtonLabel?: string;
  /**
   * Show reset button flag.
   */
  showResetButton?: boolean;
  /**
   * Manually trigger query clear action from outside.
   */
  triggerClearQuery?: boolean;

  advancedSearchFields?: any;

  parentSearchPopup?: boolean;
  searchBoxShow?: boolean;
  searchFromBackOrg?: any;
}

/**
 * Advanced search component with SCIM like basic filters form.
 *
 * @param {OrganisationAdvancedSearch} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const OrganisationAdvancedSearch: FunctionComponent<OrganisationAdvancedSearchPropsInterface> = (
  props: OrganisationAdvancedSearchPropsInterface
): ReactElement => {
    
    const {
        defaultSearchAttribute,
        defaultSearchOperator,
        dropdownPosition,
        filterAttributeOptionOne,
        filterAttributeOptionTwo,
        filterAttributeOptionThree,
        filterAttributeOptionFour,
        filterConditionOptions,
        filterConditionsPlaceholder,
      //  filterValuePlaceholder,
        onFilter,
        resetButtonLabel,
        showResetButton,
        submitButtonLabel,
        triggerClearQuery,
        parentSearchPopup,
        searchBoxShow,
        searchFromBackOrg,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isFormSubmitted, setIsFormSubmitted ] = useState(false);
    const [ externalSearchQuery, setExternalSearchQuery ] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ checked, setChecked ] = useState("");
    const [ isResetState, setResetState ] = useState(false);
    const [ selectedDropDownCountryValues, setSelectedDropDownCountryValues ] = useState("");
    const [ selectedDropDownLocaleValues, setSelectedDropDownLocaleValues ] = useState("");   
    
  const getQueryString = (label, condition, untrimedValue) => {
    const value = untrimedValue ? untrimedValue.trim() : untrimedValue;
    let query = ""
    const primaryKey = ["name", "parentName", "status", "description", "displayName"]
    if (primaryKey.includes(label)) {
      if (condition === "eq" || condition === "ne") {
        query = `${label} ${condition} '${value}'`
      }
      if (condition === "startswith" || condition === "endswith") {
        query = `${condition}(${label},'${value}')`
      }
      if (condition === "co") {
        query = `substring(${label},'${value}')`
      }
    } else {
      if (condition === "eq" || condition === "ne") {
        query = `(attributeKey eq '${label}' and attributeValue ${condition} '${value}')`
      }
      if (condition === "startswith" || condition === "endswith") {
        query = `(attributeKey eq '${label}' and ${condition}(attributeValue,'${value}'))`
      }
      if (condition === "co") {
        query = `(attributeKey eq '${label}' and substring(attributeValue,'${value}'))`
      }
    }
    return query;
  }

    /**
     * Handles the form submit.
     *
     * @param {Map<string, string | string[]>} values - Form values.
     */
    const handleFormSubmit = (values: Map<string, string | string[]>): void => {
      const match = values.get("radioGroup");
      const filterArray = [
        {
          "prefix" : values.get("name"),
          "condition" : values.get("nameCondition"),
          "value": values.get("nameValue"),
          "queryString": getQueryString(values.get("name"), values.get("nameCondition"), values.get("nameValue"))
        },
        {
          "prefix" : values.get("Type"),
          "condition" : values.get("typeCondition"),
          "value": values.get("attributeValue"),
          "queryString": getQueryString(values.get("Type"), values.get("typeCondition"), values.get("attributeValue"))
        },
        {
          "prefix" : values.get("status"),
          "condition" : values.get("statusCondition"),
          "value": values.get("statusValue"),
          "queryString": getQueryString(values.get("status"), values.get("statusCondition"), values.get("statusValue"))
        },
        {
          "prefix" : values.get("parentName"),
          "condition" : values.get("parentOrgCondition"),
          "value": values.get("parentDisplayValue"),
          "queryString": getQueryString(values.get("parentName"), values.get("parentOrgCondition"), values.get("parentDisplayValue"))
        },
        {
          "prefix" : values.get("displayName"),
          "condition" : values.get("displayNameCondition"),
          "value": values.get("displayNameValue"),
          "queryString": getQueryString(values.get("displayName"), values.get("displayNameCondition"), values.get("displayNameValue"))
        },
        {
          "prefix" : values.get("description"),
          "condition" : values.get("descriptionCondition"),
          "value": values.get("descriptionValue"),
          "queryString": getQueryString(values.get("description"), values.get("descriptionCondition"), values.get("descriptionValue"))
        },
        {
          "prefix" : values.get("locale"),
          "condition" : values.get("localeCondition"),
          "value": selectedDropDownLocaleValues,
          "queryString": getQueryString(values.get("locale"), values.get("localeCondition"), selectedDropDownLocaleValues)
        },
        {
          "prefix" : values.get("country"),
          "condition" : values.get("countryCondition"),
          "value": selectedDropDownCountryValues,
          "queryString": getQueryString(values.get("country"), values.get("countryCondition"), selectedDropDownCountryValues)
        },
        {
          "prefix" : values.get("segment"),
          "condition" : values.get("segmentCondition"),
          "value": values.get("segmentValue"),
          "queryString": getQueryString(values.get("segment"), values.get("segmentCondition"), values.get("segmentValue"))
        }
      ]

      const operations = filterArray.filter(function (obj) {
        if((obj.value !== "")) {
            return obj;
        }
      })


      const query = queryGenerator(operations,match);
        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
        setResetState(false);
    };

    const queryGenerator = (attributes,match) => {
      const queryArr = attributes.map((queryStr) => (queryStr.queryString));

      return queryArr.join(` ${match} `);
    };
    
    /**
     * Handles the search query submit.
     *
     * @param {boolean} processQuery - Flag to enable query processing.
     * @param {string} query - Search query.
     */
    const handleSearchQuerySubmit = (processQuery: boolean, query: string): void => {
      const trimmedQuery = query ? query.trim() : query;
        if (!processQuery) {
          onFilter(trimmedQuery);
            return;
        }

      onFilter(SearchUtils.buildSearchQuery(trimmedQuery));
  };

   /**
   * Handles country and locale drop down change
   */
  const handleFilterLocaleChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
    setSelectedDropDownLocaleValues(data.value as string);
  };

  const handleFilterCountryChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
    setSelectedDropDownCountryValues(data.value as string);
  };


  /**
   * Handles the submitted state reset action.
   */
  const handleResetSubmittedState = (): void => {
    setIsFormSubmitted(false);
    setResetState(true);
    setSelectedDropDownCountryValues("");
    setSelectedDropDownLocaleValues("");
  };

  /**
   * Handles the external search query clear action.
   */
  const handleExternalSearchQueryClear = (): void => {
    setExternalSearchQuery("");
  };

  const handleChange = (e, { value }) => {
    setChecked(value);
  };

 
  useEffect(() => {
    if(isResetState){
      setResetState(!isResetState);
    }
    if (searchFromBackOrg && searchFromBackOrg != undefined) {
      if (searchFromBackOrg && searchFromBackOrg.includes("substring(name,'")) {
        const queryArray = searchFromBackOrg.split("substring(name,'");
        const newQuery = `${queryArray[1]}`;
        setExternalSearchQuery(newQuery.substring(0, newQuery.length - 2));
      }
      else {
        setExternalSearchQuery(searchFromBackOrg);
      }
    }
  })
  
   
  /**
   * Default filter condition options.
   *
   * @type {({text: string; value: string})[]}
   */
  const defaultFilterConditionOptions = [
    {
      key: 0,
      text: t("common:Starts with"),
      value: "startswith"
    },
    {
      key: 1,
      text: t("common:Ends with"),
      value: "endswith"
    },
    {
      key: 2,
      text: t("common:contains"),
      value: "co"
    },
    {
      key: 3,
      text: t("common:equals"),
      value: "eq"
    },
    {
      key: 4,
      text: t("common:Not Equals"),
      value: "ne"
    }
  ];

  const filterOptions = [
    {
      key: 0,
      text: "Equals",
      value: "eq"
    },
    {
      key: 1,
      text: "Not Equals",
      value: "ne"
    }
  ]

  const defaultRadioButtonOptions = [
    {
      key: 0,
      label: "All",
      value: "and"
    },
    {
      key: 1,
      label: "Any",
      value: "or"
    }
  ];

  const labelArray = [
    {
      key: 0,
      label: "Organisation Name",
      searchBox: {
        placeholder: "Enter value to search",
        name: "nameValue"
      },
      type: "text",
      name: "name",
      filterConditionOption: "nameCondition",
      value: "name"
    },
    {
      key: 1,
      label: "Description",
      type: "text",
      name: "description",
      value: "description",
      searchBox: {
        name: "descriptionValue",
        placeholder: "Enter value to search"
      },
      filterConditionOption: "descriptionCondition"
    },
    {
      key: 2,
      label: "Type",
      type: "dropdown",
      name: "Type",
      value: "Type",
      searchBox: {
        name: "attributeValue",
        placeholder: "Select",
        children: [
        {
          key: 0,
          text: "",
          value: ""
        },
        {
          key: 1,
          text: "Branch",
          value: "Branch"
        },
        {
          key: 2,
          text: "BYOXFED",
          value: "BYOXFED"
        },
        {
          key: 3,
          text: "Company",
          value: "Company"
        }, 
        {
          key: 4,
          text: "Department",
          value: "Department"
        }]
      },
      filterConditionOption: "typeCondition"
    },
    {
      key: 3,
      label: "Locale",
      type: "dropdown-locale",
      name: "locale",
      value: "locale",
      searchBox: {
        name: "localeValue",
        placeholder: "Select",
        children: language ? language : []
      },
      filterConditionOption: "localeCondition"
    },
    {
      key: 4,
      label: "Organisation Status",
      type: "dropdown",
      name: "status",
      value: "status",
      searchBox: {
        name: "statusValue",
        placeholder: "Select",
        children:[
          {
            key: 0,
            text: "",
            value: ""
          },
        {
          key: 1,
          text: "ACTIVE",
          value: "ACTIVE"
        },
        {
          key: 2,
          text: "DISABLED",
          value: "DISABLED"
        }]
      },
      filterConditionOption: "statusCondition"
    },
    {
      key: 5,
      label: "Segment",
      type: "text",
      name: "segment",
      value: "segment",
      searchBox: {
        name: "segmentValue",
        placeholder: "Enter value to search"
      },
      filterConditionOption: "segmentCondition"
    },
    {
      key: 6,
      label: "Parent Organisation Name",
      type: "text",
      name: "parentName",
      value: "parentName",
      searchBox: {
        name: "parentDisplayValue",
        placeholder: "Enter value to search"
      },
      filterConditionOption: "parentOrgCondition"
    },
    {
      key: 7,
      label: "Country",
      type: "dropdown-country",
      name: "country",
      value: "country",
      searchBox: {
        name: "countryValue",
        placeholder: "Select",
        children: countries ? countries : []
      },
      filterConditionOption: "countryCondition"
    },
    {
      key: 8,
      label: "Organisation Display Name",
      type: "text",
      name: "displayName",
      value: "displayName",
      searchBox: {
        name: "displayNameValue",
        placeholder: "Enter value to search"
      },
      filterConditionOption: "displayNameCondition"
    }
  ]

  const setTexBox = (type, searchBox, key) => {
    if(type == "dropdown") {
      return(
          <Field
              data-testid="user-mgt-add-user-form-country-dropdown"
              type="dropdown"
              label={ searchBox && searchBox.name ? searchBox.name: "" }
              name={ searchBox && searchBox.name ? searchBox.name: "" }
              children={ searchBox && searchBox.children ? searchBox.children : [] }
              requiredErrorMessage={ "" }
              required={ false }
              placeholder={  searchBox && searchBox.placeholder? t(searchBox.placeholder): "" }
              value={ "" }
      />
      )
    }
     
    else if(type == "dropdown-country") {
      return(
              <div>
                  <Dropdown
                  data-testid="user-mgt-add-user-form-country-dropdown"
                  placeholder={  searchBox && searchBox.placeholder? t(searchBox.placeholder): "" }
                  name={ searchBox && searchBox.name ? searchBox.name: "" }
                  label={ searchBox && searchBox.name ? searchBox.name: "" }
                  className="ad-search-country"
                  search 
                  selection
                  required={ false }
                  options={ searchBox && searchBox.children ? searchBox.children : [] }
                  value={ selectedDropDownCountryValues }
                  onChange={ handleFilterCountryChange }
                  selectOnBlur={ false }
                  />
              </div>

      )
  }
      else if(type == "dropdown-locale") {
        return(
              <div>
                  <Dropdown
                  data-testid="user-mgt-add-user-form-locale-dropdown"
                  placeholder={  searchBox && searchBox.placeholder? t(searchBox.placeholder): "" }
                  name={ searchBox && searchBox.name ? searchBox.name: "" }
                  label={ searchBox && searchBox.name ? searchBox.name: "" }
                  search 
                  selection
                  className="ad-search-locale"
                  required={ false }
                  options={ searchBox && searchBox.children ? searchBox.children : [] }
                  value={ selectedDropDownLocaleValues }
                  onChange={ handleFilterLocaleChange }
                  selectOnBlur={ false }
                  />
              </div>

        )
    }
     
     else{
         return(
             <Field
                 label={ searchBox && searchBox.name ? searchBox.name: "" }
                 name={ searchBox && searchBox.name ? searchBox.name: "" }
                 placeholder={
                     searchBox && searchBox.placeholder? t(searchBox.placeholder): ""
                 }
                 required={ false }
                 requiredErrorMessage={ "" }
                 type="text"
                 data-testid={ `${ key }-filter-value-input` }
             />
         )
     }
 };

   const advanceSearchForm = () => {
    return (
      <Forms onSubmit={ (values) => handleFormSubmit(values) } resetState = { isResetState } >
      <Grid className="user-advanced-search org-advanced-search"> 

         {labelArray ? labelArray.map((value, key) => {
          return(
          <Grid.Row columns={ 3 } key={ `key-${key}` } className={ `search-row-wrapper ${key}` }>

              <Grid.Column width={ 6 } className="search-label-wrapper">
                   <label className="filter-label">{ value.label }</label>
                   <Field
                    label={ "" }
                  children={
                    [{
                      key: value.key,
                      text: value.label,
                      value: value.value
                    }]
                  }
                    name={ value && value.name? value.name: "" }
                    placeholder={ "" }
                    required={ false }
                    requiredErrorMessage={ "" }
                  type="dropdown"
                    data-testid={ `${ key }-filter-value-input` }
                  value={ value?.value || "" }
                  default={ value?.value || "" }
                    hidden
                   />
              </Grid.Column>     
                      <Grid.Column width={ 5 } className="filter-condition-wrapper">
                          <Field
                              children={
                                value.type === "dropdown" ?
                                       filterOptions.map((attribute, index) => {
                                          return {
                                              key: index,
                                              text: attribute.text,
                                              value: attribute.value
                                          };
                                      })
                                      : defaultFilterConditionOptions.map((attribute, index) => {
                                          return {
                                              key: index,
                                              text: attribute.text,
                                              value: attribute.value
                                          };
                                      })
                              }
                              label={
                                  t("adminPortal:components.advancedSearch.form.inputs.filterCondition.label")
                              }
                              name={ value && value.filterConditionOption? value.filterConditionOption: "" }
                              placeholder={
                                  filterConditionsPlaceholder
                                      ? filterConditionsPlaceholder
                                      : t("adminPortal:components.advancedSearch.form.inputs.filterCondition" +
                                      ".placeholder")
                              }
                              required={ false }
                              requiredErrorMessage={ t("adminPortal:components.advancedSearch.form.inputs" +
                                  ".filterCondition.validations.empty") }
                              type="dropdown"
                              value= { value.type === "dropdown" ? 
                              filterOptions[0].value :  defaultFilterConditionOptions[0].value }
                              default={ value.type === "dropdown" ?
                              filterOptions[0].value : defaultFilterConditionOptions[0].value }
                              data-testid={ `${ testId }-filter-condition-dropdown` }
                          />
                          </Grid.Column>
                          <Grid.Column width={ 5 } className="filter-value-wrapper">
                             { setTexBox(value.type, value.searchBox, key) }
                          </Grid.Column>
                      
                  </Grid.Row>
                     )}
                  ):"" }
         
          <Grid.Row columns={ 1 }>
              <Grid.Column width={ 15 }>
            <Field
              name="radioGroup"
              label="Match"
              className="inline-radio"
              component="input"
                type="radio"
              children={ defaultRadioButtonOptions }
              value={ defaultRadioButtonOptions[0].value }
              default={ defaultRadioButtonOptions[0].value }
              listen={ (onchange = () => handleChange) }
              data-testid={ "test-data" }
            />  
          </Grid.Column>
        </Grid.Row> 
                 
                      {/* <Divider hidden/> */}
                  <Grid.Row columns={ 1 }>
                      <Grid.Column width={ 16 }>
                      <Form.Group inline>
                          <PrimaryButton
                              size="small"
                              type="submit"
                              data-testid={ `${ testId }-search-button` }
                          >
                              { submitButtonLabel ? submitButtonLabel : t("common:search") }
                          </PrimaryButton>
                          {
                              showResetButton && (
                                  <LinkButton
                                      size="small"
                                      type="reset"
                                      onClick={ handleResetSubmittedState }
                                      data-testid={ `${ testId }-reset-button` }
                                  >
                                      { resetButtonLabel ? resetButtonLabel : t("common:resetFilters") }
                                  </LinkButton>
                              )
                          }
                      </Form.Group>
                      </Grid.Column>
          </Grid.Row>
      </Grid>
      </Forms> 
    );
  };

  return (
    <>
    {searchBoxShow?(
      <>
      <AdvancedSearch
        aligned="left"
        clearButtonPopupLabel={ t(
          "adminPortal:components.advancedSearch.popups.clear"
        ) }
        clearIcon={ AdvancedSearchIcons.clear }
        defaultSearchStrategy={
          defaultSearchAttribute + " " + defaultSearchOperator
        }
        dropdownTriggerPopupLabel={ t(
          "adminPortal:components.advancedSearch.popups.dropdown"
        ) }
        hintActionKeys={ t(
          "adminPortal:components.advancedSearch.hints.querySearch.actionKeys"
        ) }
        hintLabel={ t(
          "adminPortal:components.advancedSearch.hints.querySearch.label"
        ) }
        onExternalSearchQueryClear={ handleExternalSearchQueryClear }
        onSearchQuerySubmit={ handleSearchQuerySubmit }
        placeholder="Search by Organisation"
        resetSubmittedState={ handleResetSubmittedState }
        searchOptionsHeader={ t(
          "adminPortal:components.advancedSearch.options.header"
        ) }
        externalSearchQuery={ externalSearchQuery }
        submitted={ isFormSubmitted }
        dropdownPosition={ dropdownPosition }
        triggerClearQuery={ triggerClearQuery }
        data-testid={ testId }
        className={ `advanced-search-wrapper ${parentSearchPopup ? "advanced-caret" : ""}` }
      >
        {advanceSearchForm()}
      </AdvancedSearch>
       {parentSearchPopup && advanceSearchForm()}
       </>
      ):(
        advanceSearchForm()
      )}
    </>
  );
};


/**
 * Default props for the component.
 */
OrganisationAdvancedSearch.defaultProps = {
  "data-testid": "advanced-search",
  dropdownPosition: "bottom left",
  searchBoxShow: true,
  showResetButton: true
};
