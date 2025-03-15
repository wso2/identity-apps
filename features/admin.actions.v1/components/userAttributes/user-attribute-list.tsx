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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Skeleton from "@oxygen-ui/react/Skeleton";
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
import "./user-attribute-list.scss";

export interface UserAttributeListPropsInterface extends IdentifiableComponentInterface {
    /**
     * Previously saved attribute list.
     */
    initialValues: string[];
    /**
     * Triggers on attribute change to pass the selected attributes to the parent component.
     */
    onAttributesChange: (selectedUserAttributes: Claim[]) => void;
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
}

const UserAttributeList: FunctionComponent<UserAttributeListPropsInterface> = ({
    initialValues,
    onAttributesChange,
    isReadOnly,
    "data-componentid": componentId = "autocomplete-search-list"
}: UserAttributeListPropsInterface): ReactElement => {

    const [ allAttributesList, setAllAttributesList ] = useState<Claim[]>();
    const [ finalAttributeList, setFinalAttributeList ] = useState<Claim[]>([]);
    const [ isGetAllLocalClaimsLoading, setIsGetAllLocalClaimsLoading ] = useState<boolean>(false);
    const [ inputValue, setInputValue ] = useState("");

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    /**
     * This useEffect retrieves all the claims in the local dialect.
     */
    useEffect(() => {

        const params: ClaimsGetParams = {
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        setIsGetAllLocalClaimsLoading(true);

        getAllLocalClaims(params).then((response: Claim[]) => {
            const sortedClaims: Claim[] = response?.sort((a: Claim, b: Claim) => {
                return a.displayName > b.displayName ? 1 : -1;
            });

            setAllAttributesList(sortedClaims);
            setIsGetAllLocalClaimsLoading(false);
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("actions:notifications.genericError.userAttributes.getAttributes.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("actions:notifications.genericError.userAttributes.getAttributes.message")
                }
            ));
            setIsGetAllLocalClaimsLoading(false);
        });
    }, []);

    /**
     * This useEffect handles previously added attributes.
     */
    useEffect(() => {

        if(!initialValues?.length || !allAttributesList?.length) {
            return;
        }

        // Remove duplicates and create a new array with the initial values and the final attribute list.
        const tempFinalURIs: string[] =
        [ ...new Set([ ...initialValues, ...finalAttributeList?.map((claim: Claim) => claim.claimURI) ]) ];

        setFinalAttributeList(allAttributesList?.filter((claim: Claim) => tempFinalURIs?.includes(claim.claimURI)));
    }, [ initialValues, allAttributesList ]);

    /**
     * This useEffects passes the final attribute list to the parent.
     */
    useEffect(() => {

        onAttributesChange(finalAttributeList);
    }, [ finalAttributeList ]);

    /**
     * Renders the loading placeholders for the user attribute list.
     */
    const renderAttributeListLoadingPlaceholders = (): ReactElement => (

        <Box className="placeholder-box">
            <Skeleton variant="rectangular" height={ 10 } />
            <Skeleton variant="rectangular" height={ 25 } />
            <Skeleton variant="rectangular" height={ 10 } />
            <Skeleton variant="rectangular" height={ 10 } />
        </Box>
    );

    /**
     * Retrieves the initial letter of the provided claim.
     *
     * @param claim - Claim.
     * @returns the initial letter of the claim.
     */
    const retrieveInitialLetterOfClaim = (claim: Claim): string => {

        const parts: string[] = claim?.claimURI?.split("/");

        return parts[ parts?.length - 1 ];
    };

    /**
     * Checks if the selected attribute is already added.
     *
     * @param selectedAttribute - Selected attribute.
     */
    const isAttributeAlreadyAdded = (selectedAttribute: Claim): boolean => {

        return finalAttributeList?.some((existingAttribute: Claim) =>
            existingAttribute?.claimURI === selectedAttribute?.claimURI
        );
    };

    /**
     * Handles the selection of an attribute from the autocomplete dropdown.
     *
     * @param data - Dropdown data.
     */
    const handleAttributeSelect = (data: DropdownProps) => {

        // Clears the search input after the selected attribute is added.
        setInputValue(ActionsConstants.EMPTY_STRING);

        if (isAttributeAlreadyAdded(data as Claim)) {
            return;
        };

        setFinalAttributeList([ ...finalAttributeList, data as Claim ]);
    };

    /**
     * Handles the deletion of an attribute from the selected attributes list.
     *
     * @param item - Attribute to be deleted.
     */
    const handleAttributeDelete = (item: Claim) => {

        setFinalAttributeList((userAttributes: Claim[]) =>
            userAttributes?.filter((claim: Claim) => claim?.claimURI !== item?.claimURI)
        );
    };

    /**
     * Resolves the table actions.
     *
     * Only delete action is supported as the list is static.
     * @returns - Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {

        return [
            {
                disabled: isReadOnly,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, claim: Claim): void =>
                    handleAttributeDelete(claim),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves the columns to be displayed in the selected attributes list table.
     *
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
                                        data-componentid={ `${componentId}-elected-attribute-initial-letter-image` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
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
            <Hint>{ t("actions:fields.userAttributes.hint") }</Hint>
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
                        placeholder={ t("actions:fields.userAttributes.search.placeholder") }
                        size="small"
                        variant="outlined"
                    />
                ) }
                disabled={ isReadOnly }
                key="autocompleteSearchWithList"
                data-componentid={ `${componentId}-select-attributes` }
            />
            <Divider hidden/>

            {
                isGetAllLocalClaimsLoading ? renderAttributeListLoadingPlaceholders() : (
                    finalAttributeList?.length > 0 && (
                        <div className="user-attribute-list">
                            <div className="clear-all-button-container">
                                <Button
                                    onClick={ () => setFinalAttributeList([]) }
                                    variant="outlined"
                                    size="small"
                                    className={ "secondary-button clear-all-button" }
                                    data-componentid={ `${ componentId }-clear-all-button` }
                                    disabled={ false }
                                >
                                    { t("actions:fields.userAttributes.search.clearButton") }
                                </Button>
                            </div>
                            <div className="selected-attributes-list">
                                <DataTable<Claim[]>
                                    className="selected-attributes-list-data-table"
                                    actions={ resolveTableActions() }
                                    columns={ resolveTableColumns() }
                                    data={ finalAttributeList }
                                    onRowClick={ () => null }
                                    showHeader={ false }
                                    data-componentid={ `${componentId}-selected-attributes-list` }
                                />
                            </div>
                        </div>
                    ))
            }
        </>
    );
};

export default UserAttributeList;
