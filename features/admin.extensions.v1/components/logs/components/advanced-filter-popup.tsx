/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Button, Heading, Popup, PrimaryButton } from "@wso2is/react-components";
import React, {
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid } from "semantic-ui-react";
import { InterfaceLogsFilter } from "../models/log-models";

/**
 * Filter attribute field identifier.
 */
const FILTER_ATTRIBUTE_FIELD_IDENTIFIER: string = "filterAttribute";

/**
 * Filter condition field identifier.
 */
const FILTER_CONDITION_FIELD_IDENTIFIER: string = "filterCondition";

/**
 * Filter value field identifier.
 */
const FILTER_VALUES_FIELD_IDENTIFIER: string = "filterValues";

/**
 * Default Filter condition keyword - "requestId"
 */
const FILTER_CONDITION_KEYWORD: string = "requestId";

/**
 * Filter condition value - "co"
 */
const FILTER_CONDITION_VALUE: string = "co";

/**
 * Interface for advanced filter popup component
 */
interface AdvancedFilterPopupPropsInterface
    extends IdentifiableComponentInterface {
    setSearchQuery: (query: InterfaceLogsFilter) => void;
    isFormSubmitted: boolean;
    resetSubmitState: () => void;
}

/**
 * Interface for filter attributes
 */
interface FilterAttributeOptionsInterface {
    key: number;
    text: string;
    value: string;
}

/**
 * Pop up component for advanced filtering options in logs
 * @param props - AdvancedFilterPopup props
 * @returns React functional component
 */
const AdvancedFilterPopup = (
    props: AdvancedFilterPopupPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        setSearchQuery,
        isFormSubmitted,
        resetSubmitState
    } = props;

    const [ isPopupVisible, setIsPopupVisible ] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isFormSubmitted) {
            setIsPopupVisible(false);
        }
        resetSubmitState();
    }, [ isFormSubmitted ]);

    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        setIsPopupVisible(false);

        setSearchQuery({
            property: values.get(FILTER_ATTRIBUTE_FIELD_IDENTIFIER) as string,
            value: values.get(FILTER_VALUES_FIELD_IDENTIFIER) as string
        });
    };

    const filterAttributeOptions: Array<FilterAttributeOptionsInterface> = [
        {
            key: 0,
            text: "traceId",
            value: "requestId"
        },
        {
            key: 1,
            text: "actionId",
            value: "actionId"
        },
        {
            key: 2,
            text: "resultMessage",
            value: "resultMessage"
        }
    ];

    /**
     * Default filter condition options.
     */
    const defaultFilterConditionOptions: { text: string; value: string }[] = [
        {
            text: t("common:contains"),
            value: "co"
        }
    ];

    return (
        <Popup
            content={
                (<div className="search-filters-dropdown">
                    <Heading
                        as="h6"
                        bold="500"
                        compact
                        data-componentid={ `${componentId}-header` }
                        data-testid={ `${componentId}-header` }
                    >
                        { t("extensions:develop.monitor.filter.advancedSearch.title") }
                    </Heading>
                    <Divider className="compact" />
                    <div
                        className="form-wrapper"
                        data-componentid={ `${componentId}-form-wrapper` }
                        data-testid={ `${componentId}-form-wrapper` }
                    >
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <Forms
                                        onSubmit={ (values: Map<string, FormValue>) =>
                                            handleFormSubmit(values)
                                        }
                                    >
                                        <Field
                                            children={ filterAttributeOptions.map(
                                                (
                                                    attribute: FilterAttributeOptionsInterface,
                                                    index: number
                                                ) => {
                                                    return {
                                                        key: index,
                                                        text: attribute.text,
                                                        value: attribute.value
                                                    };
                                                }
                                            ) }
                                            label={ t(
                                                "console:common.advancedSearch.form.inputs.filterAttribute.label"
                                            ) }
                                            name={
                                                FILTER_ATTRIBUTE_FIELD_IDENTIFIER
                                            }
                                            placeholder={
                                                t("extensions:develop.monitor.filter.advancedSearch." +
                                                    "attributes.placeholder")
                                            }
                                            required={ true }
                                            requiredErrorMessage={ t(
                                                "console:common.advancedSearch.form.inputs.filterAttribute" +
                                                    ".validations.empty"
                                            ) }
                                            type="dropdown"
                                            value={ FILTER_CONDITION_KEYWORD }
                                            data-testid={ `${componentId}-filter-attribute-dropdown` }
                                        />
                                        <Form.Group widths="equal">
                                            <Field
                                                children={ defaultFilterConditionOptions.map(
                                                    (
                                                        attribute: {
                                                            text: string;
                                                            value: string;
                                                        },
                                                        index: number
                                                    ) => {
                                                        return {
                                                            key: index,
                                                            text:
                                                                attribute.text,
                                                            value:
                                                                attribute.value
                                                        };
                                                    }
                                                ) }
                                                label={ t(
                                                    "console:common.advancedSearch.form.inputs.filterCondition.label"
                                                ) }
                                                name={
                                                    FILTER_CONDITION_FIELD_IDENTIFIER
                                                }
                                                placeholder={ t(
                                                    "console:common.advancedSearch.form.inputs.filterCondition" +
                                                        ".placeholder"
                                                ) }
                                                required={ true }
                                                requiredErrorMessage={ t(
                                                    "console:common.advancedSearch.form.inputs" +
                                                        ".filterCondition.validations.empty"
                                                ) }
                                                type="dropdown"
                                                value={ FILTER_CONDITION_VALUE }
                                                data-testid={ `${componentId}-filter-condition-dropdown` }
                                            />
                                            <Field
                                                label={ t(
                                                    "console:common.advancedSearch.form.inputs." +
                                                        "filterValue.label"
                                                ) }
                                                name={
                                                    FILTER_VALUES_FIELD_IDENTIFIER
                                                }
                                                placeholder={
                                                    t("extensions:develop.monitor.filter.advancedSearch.fields" +
                                                        ".value.placeholder")
                                                }
                                                required={ true }
                                                requiredErrorMessage={ t(
                                                    "console:common.advancedSearch.form.inputs" +
                                                        ".filterValue.validations.empty"
                                                ) }
                                                type="text"
                                                data-testid={ `${componentId}-filter-value-input` }
                                            />
                                        </Form.Group>
                                        <Divider hidden />
                                        <Form.Group inline>
                                            <PrimaryButton
                                                size="small"
                                                type="submit"
                                                data-testid={ `${componentId}-search-button` }
                                            >
                                                {
                                                    t("extensions:develop.monitor.filter.advancedSearch." +
                                                        "buttons.submit.label")
                                                }
                                            </PrimaryButton>
                                        </Form.Group>
                                    </Forms>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </div>)
            }
            on="click"
            position="bottom left"
            trigger={
                (<Button
                    basic
                    compact
                    content={
                        t("extensions:develop.monitor.filter." +
                            "topToolbar.buttons.addFilter.label")
                    }
                    icon="filter"
                    data-componentid={ `${componentId}-add-filters-button` }
                    data-testid={ `${componentId}-add-filters-button` }
                    className="add-filters-btn"
                />)
            }
            open={ isPopupVisible }
            onOpen={ () => setIsPopupVisible(true) }
            onClose={ () => setIsPopupVisible(false) }
            data-componentid={ `${componentId}-dropdown` }
            data-testid={ `${componentId}-dropdown` }
            className="advanced-search"
        />
    );
};

export default AdvancedFilterPopup;
