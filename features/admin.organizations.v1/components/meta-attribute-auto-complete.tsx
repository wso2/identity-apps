/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import TextField from "@oxygen-ui/react/TextField";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import debounce from "lodash-es/debounce";
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import "./meta-attribute-auto-complete.scss";
import { Header, Item } from "semantic-ui-react";
import { useGetOrganizationsMetaAttributes } from "../api";
import { OrganizationLinkInterface } from "../models";

/**
 * Prop types for the meta attribute autocomplete component.
 */
export interface MetaAttributeAutoCompleteProps extends IdentifiableComponentInterface{

    /**
     * Callback to handle changes in the selected meta attribute.
     */
    onMetaAttributeChange: (value: string) => void;
    /**
     * Boolean indicating validation errors for the meta attribute.
     */
    hasErrors?: boolean;
}

/**
 * Autocomplete component infinite scroll for the organizations' meta attributes.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const MetaAttributeAutoComplete: React.FunctionComponent<MetaAttributeAutoCompleteProps> = (
    props: MetaAttributeAutoCompleteProps
): React.ReactElement => {

    const { onMetaAttributeChange, hasErrors, ["data-componentid"]: testId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ metaAttributeListOptions, setMetaAttributeListOptions ] = useState([]);
    const [ inputValue, setInputValue ] = useState<string>("");
    const [ hasNextPage, setHasNextPage ] = useState(true);
    const [ cursor, setCursor ] = useState(null);
    const [ params, setParams ] = useState({ after: undefined, filter: undefined, limit: 10 });

    const {
        data: metaAttributes,
        isLoading: isMetaAttributesFetchRequestLoading,
        error: metaAttributesFetchRequestError,
        isValidating: metaAttributesIsValidating
    } = useGetOrganizationsMetaAttributes(params.filter, params.limit, params.after);

    const queryPrefix: string = "attributes co ";

    useEffect(() => {
        if (!metaAttributes || isMetaAttributesFetchRequestLoading || metaAttributesIsValidating) return;

        const updatedSubAttributeListOptions: any = metaAttributes.attributes?.map((attribute: string) => ({
            text: attribute,
            value: attribute
        })) || [];

        setMetaAttributeListOptions((prevOptions: any) => [
            ...prevOptions,
            ...updatedSubAttributeListOptions
        ]);

        let nextFound: boolean = false;

        metaAttributes?.links?.forEach((link: OrganizationLinkInterface) => {
            if (link.rel === "next") {
                const nextCursor: string = link.href.split("after=")[1];

                setCursor(nextCursor);
                setHasNextPage(!!nextCursor);
                nextFound = true;
            }
        });

        if (!nextFound) {
            setCursor("");
            setHasNextPage(false);
        }
    }, [ metaAttributes ]);

    useEffect(() => {
        if (metaAttributesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("organizations:notifications.getMetaAttributesList.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("organizations:notifications.getMetaAttributesList.genericError.message")
                })
            );
        }
    }, [ metaAttributesFetchRequestError ]);

    /**
     * Update the params state whenever inputValue or cursor changes
     */
    const updateParams = (newCursor: string, newInputValue: string) => {
        setCursor(newCursor);
        setInputValue(newInputValue);
        setParams((prevParams: any) => ({
            ...prevParams,
            after: newCursor,
            filter: newInputValue ? `${queryPrefix}${newInputValue}` : ""
        }));
    };

    /**
     * Handles changes in the meta attribute input field.
     * @param _event - The change event.
     * @param data - The selected data.
     */
    const handleMetaAttributeChange = (_event: React.ChangeEvent<HTMLInputElement>, data: { value: string } | null) => {
        const value: string = data && data.value ? data.value : "";

        onMetaAttributeChange(value);
    };

    /**
     * Handles changes in the input field.
     * @param _event - The change event.
     * @param data - The new input value.
     */
    const handleInputChange: (_event: SyntheticEvent<HTMLElement>, data: string | null) => void = useCallback(
        debounce((_event: SyntheticEvent<HTMLElement>, data: string | null) => {
            const newInputValue: string = data && data ? data : "";

            setMetaAttributeListOptions([]);
            updateParams("", newInputValue);
        }, 300),
        [ updateParams ]
    );

    /**
     * Loading component for displaying a loader.
     */
    const loadMoreOptions = () => {
        if (hasNextPage && !isMetaAttributesFetchRequestLoading && !metaAttributesIsValidating) {
            updateParams(cursor, inputValue);
        }
    };

    /**
     * Loading component.
     */
    const loadingComponent = () => {
        return (
            <Item className="meta-attribute-autocomplete">
                <CircularProgress size={ 22 } className="list-item-loader"/>
                <Item.Content className="list-item-content"></Item.Content>
            </Item>
        );
    };

    /**
     * Custom listbox component with infinite scroll.
     */
    const customListboxComponent: any = useMemo(
        () => (listboxProps: any) => (
            <InfiniteScroll
                dataLength={ metaAttributeListOptions.length }
                next={ loadMoreOptions }
                hasMore={ hasNextPage }
                loader={ loadingComponent() }
                height={ metaAttributeListOptions.length > 4 ? 155 : "auto" }
            >
                <div style={ { overflow: "visible" } } { ...listboxProps }/>
            </InfiniteScroll>
        ),
        [ metaAttributeListOptions.length, loadMoreOptions, hasNextPage ]
    );

    /**
     * Known bug: Autocomplete scrolls to the top when new options are added.
     * TODO: Update MUI version when resolved.
     * @see {@link https://github.com/mui/material-ui/issues/40250}
     */
    return (
        <div className={ `meta-attribute-autocomplete ${hasErrors ? "error" : ""}` }>
            <Autocomplete
                disablePortal
                fullWidth
                aria-label="Meta Attribute selection"
                componentsProps={ {
                    paper: {
                        elevation: 2
                    },
                    popper: {
                        modifiers: [
                            {
                                enabled: false,
                                name: "flip"
                            },
                            {
                                enabled: false,
                                name: "preventOverflow"
                            }
                        ]
                    }
                } }
                getOptionLabel={ (attributeListOption: any) => attributeListOption.text }
                isOptionEqualToValue={ (option: any, value: any) => option.value === value.value }
                renderOption={ (props: any, attributeListOption: any) => (<div { ...props }>
                    <Header.Content>
                        { attributeListOption.text }
                    </Header.Content>
                </div>) }
                options={ metaAttributeListOptions }
                onChange={ handleMetaAttributeChange }
                onInputChange={ handleInputChange }
                noOptionsText={ t("common:noResultsFound") }
                ListboxComponent={ customListboxComponent }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        label={ t("organizations:advancedSearch.form.inputs.filterMetaAttribute" +
                                ".label")
                        }
                        placeholder={ t("organizations:advancedSearch.form.inputs.filterMetaAttribute" +
                                ".placeholder")
                        }
                        size="small"
                        InputLabelProps={ { required: true } }
                        onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                            }
                        } }
                        data-componentid={ `${ testId }-text-field` }
                    />
                ) }
                data-componentid={ `${ testId }-autocomplete` }
            />
            { hasErrors && (
                <div className="ui pointing above prompt label" role="alert" aria-atomic="true">
                    <p>{ t("organizations:advancedSearch.form.inputs.filterMetaAttribute.validations.empty") }</p>
                </div>
            ) }
        </div>
    );
};

/**
 * Default props for the component.
 */
MetaAttributeAutoComplete.defaultProps = {
    "data-componentid": "organization-meta-attribute"
};
