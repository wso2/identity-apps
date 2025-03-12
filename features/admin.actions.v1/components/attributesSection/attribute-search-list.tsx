/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertLevels,
    Claim,
    ClaimsGetParams,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    Code,
    DataTable,
    Hint,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, DropdownProps, Header, SemanticICONS } from "semantic-ui-react";
import { ActionsConstants } from "../../constants/actions-constants";
import "./attribute-search-list.scss";

export interface AttributeSearchListPropsInterface extends IdentifiableComponentInterface {
}

const AttributeSearchList: FunctionComponent<AttributeSearchListPropsInterface> = ({
    "data-componentid": componentId = "autocomplete-search-list"
}: AttributeSearchListPropsInterface): ReactElement => {

    const [ selectedAttributesList, setSelectedAttributesList ] = useState<Claim[]>([]);
    const [ allAttributesList, setAllAttributesList ] = useState<Claim[]>();
    const [ isAttributeListLoading, setIsAttributeListLoading ] = useState<boolean>(false);
    const [ inputValue, setInputValue ] = useState("");

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    /**
     * Retrieves all the local claims.
     */
    useEffect(() => {

        const params: ClaimsGetParams = {
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        setIsAttributeListLoading(true);

        getAllLocalClaims(params).then((response: Claim[]) => {
            const sortedClaims: Claim[] = response?.sort((a: Claim, b: Claim) => {
                return a.displayName > b.displayName ? 1 : -1;
            });

            setAllAttributesList(sortedClaims);
            setIsAttributeListLoading(false);
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("claims:local.notifications.getClaims.genericError.message")
                }
            ));
            setIsAttributeListLoading(false);
        });
    }, []);

    /**
     * Retrieves the initial letter of the provided claim.
     * @param claim - Claim.
     * @returns the initial letter of the claim.
     */
    const retrieveInitialLetterOfClaim = (claim: Claim): string => {

        const parts: string[] = claim?.claimURI?.split("/");

        return parts[ parts?.length - 1 ];
    };

    /**
     * Handle the selection of an attribute from the autocomplete dropdown.
     * @param data - Dropdown data.
     */
    const handleAttributeSelect = (data: DropdownProps) => {

        setSelectedAttributesList((userAttributes: Claim[]) =>
            userAttributes?.some((claim: Claim) => claim?.claimURI === (data as Claim)?.claimURI)
                ? userAttributes
                : [ ...userAttributes, data as Claim ]
        );

        setInputValue(ActionsConstants.EMPTY_STRING);
    };

    /**
     * Handle the deletion of an attribute from the selected attributes list.
     * @param item - Attribute to be deleted.
     */
    const handleAttributeDelete = (item: Claim) => {

        setSelectedAttributesList((userAttributes: Claim[]) =>
            userAttributes?.filter((claim: Claim) => claim?.claimURI !== item?.claimURI)
        );
    };

    /**
     * Resolves the table actions.
     * Only delete action is supported as the list is static.
     * @returns - Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {

        return [
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, claim: Claim): void =>
                    handleAttributeDelete(claim),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves the table columns to be displayed in the selected attributes list.
     * @returns - Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {

        return [
            {
                allowToggleVisibility: false,
                dataIndex: "displayName",
                id: "displayName",
                key: "displayName",
                render: (claim: Claim) => {

                    return (
                        <Header as="h6" image>
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ retrieveInitialLetterOfClaim(claim) }
                                        size="mini"
                                        data-testid={ `${componentId}-selected-attribute-initial-letter-image` }
                                        data-componentid={ `${componentId}-elected-attribute-initial-letter-image` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-selected-attribute-initial-letter` }
                                data-componentid={ `${componentId}-elected-attribute-initial-letter` }
                            />
                            <Header.Content>
                                { claim?.displayName }
                                <Header.Subheader>
                                    <code className="inline-code compact transparent">{ claim?.claimURI }</code>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: ActionsConstants.EMPTY_STRING
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ActionsConstants.EMPTY_STRING
            }
        ];
    };

    return (
        <>
            <Autocomplete
                fullWidth
                aria-label="Attribute selection"
                className="pt-2"
                defaultValue={ null }
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
                inputValue={ inputValue }
                value={ null }
                onInputChange={ (event: React.SyntheticEvent, newInputValue: string,
                    reason: AutocompleteInputChangeReason) => {

                    if (reason === "reset") {
                        setInputValue(null);

                        return;
                    } else {
                        setInputValue(newInputValue);
                    }
                } }
                onChange={ (
                    event: SyntheticEvent<HTMLElement>,
                    data: DropdownProps
                ) => handleAttributeSelect(data) }
                options={ allAttributesList }
                getOptionLabel={ (claim: DropdownProps) =>
                    claim?.displayName
                }
                isOptionEqualToValue={
                    (option: Claim, value: Claim) =>
                        option.id === value.id
                }
                renderOption={ (props: HTMLAttributes<HTMLLIElement>, option: Claim) => (
                    <li { ...props } key={ option.id }>
                        <div className="multiline">
                            <div>{ option?.displayName }</div>
                            <div>
                                <Code className="description" compact withBackground={ false }>
                                    { option?.claimURI }
                                </Code>
                            </div>
                        </div>
                    </li>
                ) }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        placeholder={ t("actions:attributes.search.placeholder") }
                        size="small"
                        variant="outlined"
                    />
                ) }
                key="autocompleteSearchWithList"
                data-testid={ `${componentId}-select-attributes` }
                data-componentid={ `${componentId}-select-attributes` }
            />
            <Hint>{ t("actions:attributes.hint") }</Hint>
            <Divider hidden/>
            {
                selectedAttributesList?.length > 0 && (

                    <div className="attribute-search-list">
                        <div className="clear-all-button-container">
                            <Button
                                onClick={ () => setSelectedAttributesList([]) }
                                variant="outlined"
                                size="small"
                                className={ "secondary-button clear-all-button" }
                                data-componentid={ `${ componentId }-clear-all-button` }
                                disabled={ false }
                            >
                                { t("actions:attributes.search.clearButton") }
                            </Button>
                        </div>
                        <div className="selected-attributes-list">
                            <DataTable<Claim[]>
                                className="selected-attributes-list-data-table"
                                actions={ resolveTableActions() }
                                columns={ resolveTableColumns() }
                                data={ selectedAttributesList }
                                onRowClick={ () => null }
                                showHeader={ false }
                                data-testid={ `${componentId}-selected-attributes-list` }
                                data-componentid={ `${componentId}-selected-attributes-list` }
                            />
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default AttributeSearchList;
