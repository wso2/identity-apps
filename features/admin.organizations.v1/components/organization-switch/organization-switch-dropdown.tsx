/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, Popup } from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Button,
    Dropdown,
    Grid,
    Input,
    Item,
    Loader,
    Segment
} from "semantic-ui-react";
import OrganizationListItem from "./organization-list-item";
import OrganizationSwitcherList from "./organization-switch-list";
import { ReactComponent as CrossIcon } from "../../../themes/default/assets/images/icons/cross-icon.svg";
import { AppState } from "../../../admin.core.v1";
import { getOrganizations } from "../../api";
import {
    GenericOrganization,
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface,
    OrganizationResponseInterface
} from "../../models";
import { AddOrganizationModal } from "../add-organization-modal";

/**
 * Interface for component dropdown.
 */
interface OrganizationSwitchDropdownInterface
    extends IdentifiableComponentInterface {
    triggerName?: string;
    isBreadcrumbItem?: boolean;
    dropdownTrigger?: ReactElement;
    disable?: boolean;
    handleOrganizationSwitch?: (organization: GenericOrganization) => void;
}

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const {
        "data-componentid": componentId,
        dropdownTrigger,
        disable,
        handleOrganizationSwitch
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state?.organization?.isFirstLevelOrganization
    );

    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<
        OrganizationInterface[]
    >([]);
    const [ listFilter, setListFilter ] = useState("");
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ search, setSearch ] = useState<string>("");
    const [ isOrganizationsLoading, setIsOrganizationsLoading ] = useState<
        boolean
    >(false);
    const [ showNewOrgWizard, setShowNewOrgWizard ] = useState<boolean>(false);

    const [ parents, setParents ] = useState<GenericOrganization[]>([]);

    const noOfItems: number = 10;

    /**
     * Handles the pagination change.
     *
     * @param data - Pagination component data.
     */
    const handlePaginationChange: () => void = (): void => {
        getOrganizationList(listFilter, afterCursor, null);
    };

    const getOrganizationList: (
        filter: string,
        after: string,
        before: string,
        parentId?: GenericOrganization
    ) => void = useCallback(
        async (
            filter: string,
            after: string,
            before: string,
            parentId?: GenericOrganization
        ) => {
            const filterStrWithDisableFilter: string = `status eq ACTIVE ${ filter ? "and " + filter : ""
            }`;

            !after && setIsOrganizationsLoading(true);

            getOrganizations(
                filterStrWithDisableFilter,
                noOfItems,
                after,
                before,
                false,
                false
            )
                .then((response: OrganizationListInterface) => {
                    if (!response || !response.organizations) {
                        setAssociatedOrganizations((organizations: OrganizationInterface[]) =>
                            after ? [ ...organizations ] : []
                        );
                        setPaginationData(response.links);
                    } else {
                        const organizations: OrganizationInterface[] = [
                            ...response?.organizations
                        ];

                        setAssociatedOrganizations((associatedOrganizations: OrganizationInterface[]) =>
                            after
                                ? [ ...associatedOrganizations, ...organizations ]
                                : [ ...organizations ]
                        );

                        setPaginationData(response.links);
                    }
                    parentId && setParents((parents: GenericOrganization[]) => [ ...parents, parentId ]);
                })
                .catch((error: any) => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "organizations:notifications." +
                                    "getOrganizationList.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications.getOrganizationList" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "organizations:notifications." +
                                "getOrganizationList.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setIsOrganizationsLoading(false);
                });
        }, 
        []
    );

    const setPaginationData = (links: OrganizationLinkInterface[]) => {
        setAfterCursor(undefined);
        if (!links || links.length === 0) {
            return;
        }

        links.forEach((link: OrganizationLinkInterface) => {
            if (link.rel === "next") {
                const afterCursorLink: string = link.href.toString().split("after=")[ 1 ];

                setAfterCursor(afterCursorLink);
            }
        });
    };

    useEffect(() => {
        if (!isDropDownOpen) {
            return;
        }

        getOrganizationList(listFilter, null, null);
    }, [ getOrganizationList, listFilter, isDropDownOpen ]);

    const handleOrgRowClick = (organization: GenericOrganization): void => {
        getOrganizationList(
            "parentId eq " + organization.id,
            null,
            null,
            organization
        );
    };

    const handleBackButtonClick = (): void => {
        const parentIdsCopy: GenericOrganization[] = [ ...parents ];

        parentIdsCopy.pop();
        setParents(parentIdsCopy);
        setIsOrganizationsLoading(true);
        getOrganizationList(
            parentIdsCopy?.length > 0
                ? "parentId eq " + parentIdsCopy[ parentIdsCopy.length - 1 ].id
                : "",
            null,
            null
        );
    };

    /**
     * Search the organization list.
     *
     * @param search - Search query.
     */
    const searchOrganizationList = (search: string): void => {
        const changeValue: string = search.trim();

        setListFilter(
            changeValue
                ? parents.length > 0
                    ? `name co ${ changeValue } and parentId eq ${ parents[ parents.length - 1 ]
                    }`
                    : `name co ${ changeValue }`
                : ""
        );
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setListFilter("");
        setAfterCursor(undefined);
        setIsDropDownOpen(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleNewClick = (): void => {
        setIsDropDownOpen(false);
        setShowNewOrgWizard(true);
    };

    const closeNewOrgWizard = (): void => {
        setShowNewOrgWizard(false);
    };

    const handleCurrentOrgClick = (): void => {
        setParents([]);
        setIsDropDownOpen(!isDropDownOpen);
    };

    return (
        <>
            { showNewOrgWizard && (
                <AddOrganizationModal
                    parent={ parents[ parents.length - 1 ] }
                    closeWizard={ closeNewOrgWizard }
                />
            ) }
            <Dropdown
                disabled={ disable }
                onBlur={ resetTenantDropdown }
                item
                floating
                className="tenant-dropdown breadcrumb"
                data-componentid={ `${ componentId }-dropdown` }
                open={ isDropDownOpen }
                onClick={ handleCurrentOrgClick }
                trigger={ dropdownTrigger }
                icon={ null }
            >
                <Dropdown.Menu
                    className="organization-dropdown-menu"
                    onClick={ (e: SyntheticEvent) => e.stopPropagation() }
                    data-componentid={ `${ componentId }-dropdown-menu` }
                >
                    { isDropDownOpen && (
                        <>
                            <Grid padded>
                                <OrganizationListItem
                                    organization={ currentOrganization }
                                    isClickable={ false }
                                    showSwitch={ false }
                                    setShowDropdown={ setIsDropDownOpen }
                                    showEdit={ !isFirstLevelOrg }
                                />
                            </Grid>
                            <Segment basic secondary>
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column
                                            width={ 12 }
                                            verticalAlign="middle"
                                        >
                                            <h5>
                                                { t(
                                                    "organizations:" +
                                                    "switching.subOrganizations"
                                                ) }
                                            </h5>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Item.Group className="search-bar">
                                    <div className="advanced-search-wrapper aligned-left fill-default">
                                        <Input
                                            className="advanced-search with-add-on"
                                            data-componentid={ `${ componentId }-search-box` }
                                            icon="search"
                                            iconPosition="left"
                                            value={ search }
                                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                                setSearch(event.target.value);
                                            } }
                                            onKeyDown={ (
                                                event: React.KeyboardEvent
                                            ) => {
                                                event.key === "Enter" &&
                                                    searchOrganizationList(
                                                        search
                                                    );
                                                event.stopPropagation();
                                            } }
                                            placeholder={ t(
                                                "organizations:switching.search.placeholder"
                                            ) }
                                            floated="right"
                                            size="small"
                                            action={
                                                search ? (
                                                    <Popup
                                                        trigger={
                                                            (<Button
                                                                data-componentid={
                                                                    `${ componentId }-search-clear-button`
                                                                }
                                                                basic
                                                                compact
                                                                className="input-add-on organizations"
                                                            >
                                                                <GenericIcon
                                                                    size="nano"
                                                                    defaultIcon
                                                                    transparent
                                                                    icon={
                                                                        CrossIcon
                                                                    }
                                                                    onClick={ () => {
                                                                        setSearch(
                                                                            ""
                                                                        );
                                                                        searchOrganizationList(
                                                                            ""
                                                                        );
                                                                    } }
                                                                />
                                                            </Button>)
                                                        }
                                                        position="top center"
                                                        content={ t(
                                                            "console:common.advancedSearch.popups.clear"
                                                        ) }
                                                        inverted={ true }
                                                    />
                                                ) : null
                                            }
                                        />
                                    </div>
                                </Item.Group>
                                { associatedOrganizations ? (
                                    isOrganizationsLoading ? (
                                        <Segment basic>
                                            <Loader active inline="centered" />
                                        </Segment>
                                    ) : (
                                        <OrganizationSwitcherList
                                            organizations={
                                                associatedOrganizations
                                            }
                                            handleOrgRowClick={
                                                handleOrgRowClick
                                            }
                                            handleBackButtonClick={
                                                handleBackButtonClick
                                            }
                                            parents={ parents }
                                            hasMore={ !!afterCursor }
                                            currentOrganization={
                                                currentOrganization
                                            }
                                            loadMore={ handlePaginationChange }
                                            setShowDropdown={ setIsDropDownOpen }
                                            handleOrganizationSwitch={
                                                handleOrganizationSwitch
                                            }
                                        />
                                    )
                                ) : null }
                            </Segment>
                        </>
                    ) }
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default OrganizationSwitchDropdown;

OrganizationSwitchDropdown.defaultProps = {
    "data-componentid": "organization-switch-dropdown"
};
