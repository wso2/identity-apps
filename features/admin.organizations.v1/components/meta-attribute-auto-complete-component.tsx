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

import { AlertLevels } from "@wso2is/core/models";
import { throttle } from 'lodash';
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Autocomplete, {AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import TextField from "@oxygen-ui/react/TextField";
import "./meta-attribute-auto-complete-component.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import { getOrganizationsMetaAttributes } from "../api";
import { OrganizationsMetaAttributesListInterface } from "../models";
import { Item, Header } from "semantic-ui-react";

/**
 * Prop types for the meta attribute autocomplete component.
 */
interface MetaAttributeAutoCompleteComponentProps {
    onMetaAttributeChange: (value: string) => void;
}

/**
 * Autocomplete component infinite scroll for the organizations' meta attirbutes.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const MetaAttributeAutoCompleteComponent: React.FunctionComponent<MetaAttributeAutoCompleteComponentProps> = (
    props: MetaAttributeAutoCompleteComponentProps
): React.ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ metaAttributeListOptions, setMetaAttributeListOptions ] = useState([]);
    const [ isMetaAttributeListOptionsRequestLoading, setMetaAttributeListOptionsRequestLoading ] = useState<boolean>(false);
    const [ inputValue, setInputValue ] = useState<string>('');
    const [ hasNextPage, setHasNextPage ] = useState(true);
    const [ cursor, setCursor ] = useState(null);
    const queryPrefix = 'attributes co ';

    const handleMetaAttributeChange = (event, data: { value: string } | null) => {
        const value = data && data.value ? data.value : '';
        props.onMetaAttributeChange(value);
    };

    /**
     * Retrieves the list of organizations' meta attributes.
     *
     * @param limit - List limit.
     * @param filter - Search query.
     * @param after - The pointer to next page.
     * @param after - The pointer to previous page.
     * @param recursive - Determines whether recursive search is required.
     */
    const getMetaAttributesList: (
        limit?: number,
        filter?: string,
        after?: string,
        before?: string,
        _recursive?: boolean
    ) => void = useCallback(
        (limit?: number, filter?: string, after?: string, before?: string, _recursive?: boolean): void => {
            setMetaAttributeListOptionsRequestLoading(true);
            getOrganizationsMetaAttributes(filter, limit, after, before, false)
                .then((response: OrganizationsMetaAttributesListInterface | null | undefined) => {
                    if (response && Array.isArray(response.attributes)) {
                        const updatedSubAttributeListOptions = response.attributes.map((attribute: string) => ({
                            text: attribute,
                            value: attribute
                        }));
                        if (response.links && response.links.find(link => link.rel === 'next')) {
                            const nextCursor = response.links.find(link => link.rel === 'next')?.href.split('after=')[1];
                            setCursor(nextCursor ? nextCursor : null);
                            setHasNextPage(true);
                        } else {
                            setHasNextPage(false);
                        }
                        setMetaAttributeListOptions((prevOptions) => [...prevOptions, ...updatedSubAttributeListOptions]);
                    } else {
                        setMetaAttributeListOptions([]);
                    }
                })
                .catch((error: any) => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t("organizations:notifications.getMetaAttributesList.error.message")
                            })
                        );
                        return;
                    }
                    dispatch(
                        addAlert({
                            description: t("organizations:notifications.getMetaAttributesList.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("organizations:notifications.getMetaAttributesList.genericError.message")
                        })
                    );
                })
                .finally(() => {
                    setMetaAttributeListOptionsRequestLoading(false);
                });
        },
        [getOrganizationsMetaAttributes, dispatch, t, setMetaAttributeListOptionsRequestLoading]
    );

    const handleInputChange = (event: SyntheticEvent<HTMLElement>, data: string | null) => {
        const newInputValue = data && data? data : ''
        setMetaAttributeListOptions([])
        setInputValue(newInputValue);
        fetchOptions(newInputValue, null);
    };
    
    const fetchOptions = useCallback(
        throttle((query: string, cursor: string | null) => {
            setMetaAttributeListOptionsRequestLoading(true);
            const formattedQuery = query.trim() ? `${queryPrefix}${query}` : '';
            getMetaAttributesList(10, formattedQuery, cursor, null);
        }, 300),
        [getMetaAttributesList]
    );

    useEffect(() => {
        fetchOptions('', null);
    }, []);      

    const loadMoreOptions = () => {
        if (hasNextPage && !isMetaAttributeListOptionsRequestLoading) {
          fetchOptions(inputValue, cursor); 
        }
    };

    /**
     * Loading component.
     */
    const loadingComponent = () => {
        return (
            <Item className="meta-attribute-autocomplete">
                <CircularProgress size={ 22 } className="list-item-loader"/>
                <Item.Content className="list-item-content">
                    <div className="name">
                        { t("common:loading") }...
                    </div>
                </Item.Content>
            </Item>
        );
    };

    return (
        <Autocomplete
            disablePortal
            fullWidth
            aria-label="Meta Attribute selection"
            className="meta-attribute-autocomplete"
            componentsProps={{
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
            }}
            getOptionLabel={(attributeListOption) => attributeListOption.text}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderOption={(props: any, attributeListOption: any) => (<div {...props}>
                <Header.Content>
                    {attributeListOption.text}
                </Header.Content>
            </div>)}
            options={metaAttributeListOptions}
            onChange={handleMetaAttributeChange }
            onInputChange={handleInputChange}
            noOptionsText={t("common:noResultsFound")}
            ListboxComponent={(props) => (
                <InfiniteScroll
                    dataLength={metaAttributeListOptions.length}
                    next={loadMoreOptions}
                    hasMore={hasNextPage}
                    loader={ loadingComponent() }
                >
                    <div {...props} />
                </InfiniteScroll>
            )}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                    {...params}
                    label={t("organizations:advancedSearch.form.inputs.filterMetaAttribute" +
                            ".label")
                    }
                    placeholder={t("organizations:advancedSearch.form.inputs.filterMetaAttribute" +
                            ".placeholder")
                    }
                    size="small"
                    InputLabelProps={ { required: true }} 
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                        }
                    }}
                />
            )}
            key="subAttribute"
        />
    );
};

export default MetaAttributeAutoCompleteComponent;
