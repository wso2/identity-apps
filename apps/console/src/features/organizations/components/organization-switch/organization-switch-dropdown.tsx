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
    TenantAssociationsInterface,
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setTenants } from "@wso2is/core/store";
import { GenericIcon } from "@wso2is/react-components";
import React, {
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
    Divider,
    Dropdown,
    Icon,
    Input,
    Item,
    Menu,
    Placeholder,
    SemanticICONS
} from "semantic-ui-react";
import { AppConstants, AppState, getMiscellaneousIcons, history } from "../../../core";
import {
    GenericOrganization,
} from "../../models";
import { AddOrganizationModal } from "../add-organization-modal";
import { OrganizationType } from "../../constants";
import { useGetOrganizationType } from "../../hooks/use-get-organization-type";
// import { getAssociatedTenants, makeTenantDefault } from "../../../../extensions/components/tenants/api";
import { AxiosResponse } from "axios";
import {
    HeaderPropsInterface as ReusableHeaderPropsInterface
} from "@wso2is/react-components";
import { handleTenantSwitch } from "../../utils";

/**
 * Interface for component dropdown.
 */
interface OrganizationSwitchDropdownInterface
    extends IdentifiableComponentInterface {
    triggerName?: string;
    isBreadcrumbItem?: boolean;
    handleOrganizationSwitch?: (organization: GenericOrganization) => void;
    isDropdownOpened?: boolean;
    dropdownTrigger?: ReactElement;
    disable?: boolean;
}

/**
 * Dashboard layout Prop types.
 */
interface TenantDropdownLinkInterface extends Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo"> {
    /**
     * Content of dropdown item.
     */
    content?: string;
    /**
     * Name of dropdown item.
     */
    name: string;
    /**
     * Icon of dropdown item.
     */
    icon: SemanticICONS;
    /**
     * Function called when dropdown item is clicked.
     */
    onClick: () => void;
}

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const {
        "data-componentid": componentId,
        dropdownTrigger,
        disable,
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const organization: string = useSelector((state: AppState) => state?.organization?.organization?.name);

    const orgType: OrganizationType = useGetOrganizationType();

    const [ showNewOrgWizard, setShowNewOrgWizard ] = useState<boolean>(false);

    const [ parents, setParents ] = useState<GenericOrganization[]>([]);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ tempTenantAssociationsList, setTempTenantAssociationsList ] = useState<string[]>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSetDefaultTenantInProgress, setIsSetDefaultTenantInProgress ] = useState<boolean>(false);
    const [ associatedTenants, setAssociatedTenants ] = useState<string[]>([]);
    const [ defaultTenant, setDefaultTenant ] = useState<string>("");

    // useEffect(() => {
    //     if (!isPrivilegedUser) {
    //         getAssociatedTenants()
    //             .then((response: any) => {
    //                 let defaultDomain: string = "";
    //                 const tenants: string[] = [];

    //                 response.associatedTenants.forEach((tenant: any) => {
    //                     if (tenant.default) {
    //                         defaultDomain = tenant.domain;
    //                     }

    //                     tenants.push(tenant.domain);
    //                 });

    //                 dispatch(setTenants<any>(response.associatedTenants));
    //                 setAssociatedTenants(tenants);
    //                 setDefaultTenant(defaultDomain);
    //             })
    //             .catch((error: any) => {
    //                 dispatch(
    //                     addAlert({
    //                         description:
    //                             error?.description &&
    //                             t("extensions:manage.features.tenant.notifications." + "getTenants.description"),
    //                         level: AlertLevels.ERROR,
    //                         message:
    //                             error?.description &&
    //                             t("extensions:manage.features.tenant.notifications." + "getTenants.message")
    //                     })
    //                 );
    //             });
    //     }
    // }, []);

    useEffect(() => {

        const association: TenantAssociationsInterface = {
            associatedTenants: associatedTenants,
            currentTenant: tenantDomain,
            defaultTenant: defaultTenant,
            username: email ? email : username
        };

        if (Array.isArray(association.associatedTenants)) {
            // Remove the current tenant from the associated tenants list.
            const currentTenantIndex = association.associatedTenants.indexOf(association.currentTenant);

            if (currentTenantIndex != -1) {
                association.associatedTenants.splice(currentTenantIndex, 1);
            }
            setTempTenantAssociationsList(association.associatedTenants);
        }
        setTenantAssociations(association);
    }, [ associatedTenants, defaultTenant, tenantDomain ]);

    const closeNewOrgWizard = (): void => {
        setShowNewOrgWizard(false);
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setIsSwitchTenantsSelected(false);
        if (tenantAssociations && Array.isArray(tenantAssociations.associatedTenants)) {
            setTempTenantAssociationsList(tenantAssociations.associatedTenants);
        }
    };

    // const setDefaultTenantInDropdown = (tenantName: string): void => {
    //     setIsSetDefaultTenantInProgress(true);
    //     makeTenantDefault(tenantName)
    //         .then((response: AxiosResponse) => {
    //             if (response.status === 200) {
    //                 dispatch(addAlert<AlertInterface>({
    //                     description: t("extensions:manage.features.tenant.notifications.defaultTenant.success." +
    //                         "description", { tenantName: tenantName }),
    //                     level: AlertLevels.SUCCESS,
    //                     message: t("extensions:manage.features.tenant.notifications.defaultTenant.success.message")
    //                 }));

    //                 setDefaultTenant(tenantName);
    //             }
    //         })
    //         .catch(() => {
    //             dispatch(addAlert<AlertInterface>({
    //                 description:
    //                 t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.description"),
    //                 level: AlertLevels.ERROR,
    //                 message: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.message")
    //             }));
    //         })
    //         .finally(() => {
    //             setIsSetDefaultTenantInProgress(false);
    //         });
    // };

    /**
     * Stops the dropdown from closing on click.
     *
     * @param event - Click event.
     */
    const handleDropdownClick = (event: SyntheticEvent<HTMLElement>): void => {
        event.stopPropagation();
    };

    const tenantDropdownLinks: TenantDropdownLinkInterface[] = [
        {
            icon: "plus",
            name: t("extensions:manage.features.tenant.header.tenantAddHeader"),
            onClick: () => { setShowTenantAddModal(true); }
        }
    ];

    /**
     * Search the tenant list.
     *
     * @param event - Input event
     */
    const searchTenantList = (event): void => {
        const changeValue = event.target.value;

        if (tenantAssociations && Array.isArray(tenantAssociations.associatedTenants)) {
            let result;

            if (changeValue.length > 0) {
                result = tenantAssociations.associatedTenants.filter((item) =>
                    item.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            } else {
                result = tenantAssociations.associatedTenants;
            }
            setTempTenantAssociationsList(result);
        }
    };

    const resolveAssociatedTenants = (): ReactElement => {
        if (Array.isArray(tempTenantAssociationsList)) {
            return (
                <Item.Group
                    className="tenants-list"
                    unstackable
                    data-testid={ "associated-tenants-container" }
                >
                    {
                        tempTenantAssociationsList.length > 0 ?
                            (
                                tempTenantAssociationsList.map((association, index) => (
                                    (association !== tenantAssociations.currentTenant)
                                        ? (
                                            <Item
                                                className="tenant-account"
                                                key={ index }
                                                onClick={ () => handleTenantSwitch(association) }
                                            >
                    
                                                <GenericIcon
                                                    transparent
                                                    data-componentid="component-dropdown-trigger-icon"
                                                    data-testid="tenant-dropdown-trigger-icon"
                                                    icon={ getMiscellaneousIcons().tenantIcon }
                                                    inline
                                                    size="micro"
                                                    relaxed="very"
                                                    rounded
                                                    spaced="right"
                                                    fill="white"
                                                    background={ "grey" }
                                                    className="mt-3"
                                                />
                                                <Item.Content verticalAlign="middle">
                                                    <Item.Description>
                                                        <div
                                                            className="name"
                                                            data-testid={ `${ association }-tenant-la-name` }
                                                        >
                                                            { association }
                                                        </div>
                                                    </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        )
                                        : null
                                ))
                            )
                            :
                            (
                                <Item
                                    className="empty-list"
                                >
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div className="message">
                                                { t("extensions:manage.features.tenant."
                                                + "header.tenantSearch.emptyResultMessage") }
                                            </div>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            )
                    }
                </Item.Group>
            );
        }
    };

    return (
        <>
            { showTenantAddModal && (
                <AddOrganizationModal
                    parent={ parents[ parents.length - 1 ] }
                    closeWizard={ closeNewOrgWizard }
                />
            ) }
            <Menu.Item
                compact
                className={ "contained-trigger-wrapper" }
                key="tenant-dropdown"
            >
                <Dropdown
                    disable={ disable }
                    onBlur={ resetTenantDropdown }
                    item
                    floating
                    className="tenant-dropdown"
                    data-testid={ "tenant-dropdown" }
                    trigger={ dropdownTrigger }
                >
                    {
                        !isSwitchTenantsSelected ? (
                            <Dropdown.Menu onClick={ handleDropdownClick }>
                                <Item.Group className="current-tenant" unstackable>
                                    <Item
                                        className="header"
                                        key={ "current-tenant" }
                                    >
                                        {
                                            <GenericIcon
                                                transparent
                                                inline
                                                className="associated-tenant-icon"
                                                data-testid="associated-tenant-icon"
                                                icon={ getMiscellaneousIcons().tenantIcon }
                                                size="mini"
                                            />
                                        }
                                        <Item.Content verticalAlign="middle">
                                            <Item.Description>
                                                <div
                                                    className="name ellipsis"
                                                    data-testid={
                                                        "tenant-dropdown-display-name"
                                                    }
                                                >
                                                    {
                                                        orgType === OrganizationType.SUBORGANIZATION
                                                            ? organization
                                                            : tenantAssociations
                                                                ? tenantAssociations.currentTenant
                                                                : (
                                                                    <Placeholder>
                                                                        <Placeholder.Line />
                                                                    </Placeholder>
                                                                )
                                                    }
                                                </div>
                                                {
                                                    orgType !== OrganizationType.SUBORGANIZATION && tenantAssociations ? (
                                                        tenantAssociations.currentTenant ===
                                                        tenantAssociations.defaultTenant ? (
                                                                <Button
                                                                    size="tiny"
                                                                    basic
                                                                    color="grey"
                                                                    className="default-button disabled"
                                                                    data-testid={ "default-button" }
                                                                >
                                                                    { t("extensions:manage.features.tenant."
                                                                    + "header.tenantDefaultButton") }
                                                                </Button>
                                                            )
                                                            : (
                                                                <Button
                                                                    loading={ isSetDefaultTenantInProgress }
                                                                    disabled={ isSetDefaultTenantInProgress }
                                                                    basic
                                                                    color="orange"
                                                                    size="tiny"
                                                                    className="default-button active"
                                                                    // onClick={ () =>
                                                                    //     setDefaultTenantInDropdown(tenantAssociations.
                                                                    //         currentTenant)
                                                                    // }
                                                                    data-testid={ "default-button" }
                                                                >
                                                                    { t("extensions:manage.features.tenant."
                                                                    + "header.tenantMakeDefaultButton") }
                                                                </Button>
                                                            )
                                                    ) : null
                                                }
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                <Dropdown.Header
                                    className="tenant-dropdown-links-category-header" 
                                    content="Primary organizations"
                                />
                                {
                                    tenantAssociations &&
                                    tenantAssociations.associatedTenants &&
                                    Array.isArray(tenantAssociations.associatedTenants) &&
                                    tenantAssociations.associatedTenants.length > 0
                                        ? (
                                            <Dropdown.Item
                                                className="action-panel"
                                                onClick={ () => setIsSwitchTenantsSelected(true) }
                                                data-testid={ "tenant-switch-menu" }
                                            >
                                                <Icon
                                                    className="link-icon"
                                                    name="exchange"
                                                />
                                                { t("extensions:manage.features.tenant.header.tenantSwitchHeader") }
                                            </Dropdown.Item>
                                        )
                                        : null
                                }
                                {
                                    (tenantDropdownLinks
                                        && tenantDropdownLinks.length
                                        && tenantDropdownLinks.length > 0)
                                        ? tenantDropdownLinks.map((link, index) => {
                                            const {
                                                content,
                                                icon,
                                                name,
                                                onClick
                                            } = link;

                                            return (
                                                <Dropdown.Item
                                                    key={ index }
                                                    className="action-panel"
                                                    onClick={ onClick }
                                                    // Temporarily hiding dropdown item until
                                                    // modal is implemented.
                                                    // style={{display:'none'}}
                                                    data-testid={ `tenant-dropdown-link-${ name.replace(" ", "-") }` }
                                                >
                                                    {
                                                        icon && (
                                                            <Icon
                                                                className="link-icon"
                                                                name={ icon }
                                                            />
                                                        )
                                                    }
                                                    { name }
                                                    { content }
                                                </Dropdown.Item>
                                            );
                                        })
                                        : null
                                }
                                <Divider />
                                <Dropdown.Item
                                    className="action-panel"
                                    onClick={ () => history.push(AppConstants.getPaths().get("ORGANIZATIONS")) }
                                    data-testid={ "tenant-switch-menu" }
                                >
                                    <Icon
                                        className="link-icon"
                                        name="sitemap"
                                    />
                                    Sub Organizations
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        ) : (
                            <Dropdown.Menu onClick={ handleDropdownClick }>
                                <Item.Group className="current-tenant" unstackable>
                                    <Item
                                        className="header back-button-wrapper"
                                        key={ "current-tenant" }
                                    >
                                        <div className="link pointing" onClick={ resetTenantDropdown }>
                                            <Icon
                                                className="link-icon spaced-right"
                                                name="arrow left"
                                            />
                                            {
                                                t("extensions:manage.features.tenant.header.backButton")
                                            }
                                        </div>
                                    </Item>
                                </Item.Group>
                                <Item.Group className="search-bar tenant">
                                    <div
                                        className={ `tenant-dropdown-search
                                        advanced-search-wrapper aligned-left fill-default` }>
                                        <Input
                                            className="advanced-search with-add-on"
                                            data-testid="list-search-input"
                                            icon="search"
                                            iconPosition="left"
                                            onChange={ searchTenantList }
                                            placeholder={
                                                t("extensions:manage.features.tenant.header.tenantSearch.placeholder")
                                            }
                                            floated="right"
                                            size="small"
                                        />
                                    </div>
                                </Item.Group>
                                {
                                    tenantAssociations
                                        ? resolveAssociatedTenants()
                                        : null
                                }
                            </Dropdown.Menu>
                        )
                    }
                </Dropdown>
            </Menu.Item>
        </>
    );
};

export default OrganizationSwitchDropdown;

OrganizationSwitchDropdown.defaultProps = {
    "data-componentid": "organization-switch-dropdown"
};
