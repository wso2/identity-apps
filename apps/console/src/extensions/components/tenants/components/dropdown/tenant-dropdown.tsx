/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import {
    HeaderPropsInterface as ReusableHeaderPropsInterface,
    GenericIcon,
    useWizardAlert
} from "@wso2is/react-components";
import {
    AlertInterface,
    AlertLevels,
    TenantAssociationsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { Button, Dropdown, Grid, Icon, Input, Item, Menu, Placeholder, SemanticICONS } from "semantic-ui-react";
import { getMiscellaneousIcons } from "../../../../../features/core/configs";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../../features/core/store";
import { AddTenantWizard } from "../add-modal";
import { makeTenantDefault, getAssociatedTenants } from "../../api";
import { addAlert, setDefaultTenant, setTenants } from "@wso2is/core/store";
import { AxiosResponse } from "axios";
import { handleTenantSwitch } from "../../utils";
import { TenantRequestResponse, TenantInfo } from "../../models";

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

/**
 * Interface for tenant dropdown.
 */
type TenantDropdownInterface = TestableComponentInterface;

const TenantDropdown: FunctionComponent<TenantDropdownInterface> = (
    props: TenantDropdownInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ tempTenantAssociationsList, setTempTenantAssociationsList ] = useState<string[]>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);
    const [ isSetDefaultTenantInProgress, setIsSetDefaultTenantInProgress ] = useState<boolean>(false);
    const [ associatedTenants, setAssociatedTenants ] = useState<string[]>([]);
    const [ defaultTenant, setDefaultTenant ] = useState<string>("");

    useEffect(() => {
        getAssociatedTenants()
            .then((response: TenantRequestResponse) => {
                let defaultDomain: string = "";
                const tenants: string[] = [];

                response.associatedTenants.forEach((tenant: TenantInfo) => {
                    if (tenant.default) {
                        defaultDomain = tenant.domain;
                    }

                    tenants.push(tenant.domain);
                });

                dispatch(setTenants(response.associatedTenants));
                setAssociatedTenants(tenants);
                setDefaultTenant(defaultDomain);
            })
            .catch((error: any) => {
                dispatch(
                    addAlert({
                        description:
                            error?.description &&
                            t("extensions:manage.features.tenant.notifications." + "getTenants.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.description &&
                            t("extensions:manage.features.tenant.notifications." + "getTenants.message")
                    })
                );
            });
    }, []);

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

    const triggerTenant = (
        <span className="tenant-dropdown-trigger" data-testid="tenant-dropdown-trigger">
            <GenericIcon
                transparent
                inline
                className="tenant-dropdown-trigger-icon"
                data-testid="tenant-dropdown-trigger-icon"
                icon={ getMiscellaneousIcons().tenantIcon }
                size="micro"
                fill="white"
                spaced="right"
            />
            <div className="tenant-dropdown-trigger-display-name ellipsis" data-testid="tenant-dropdown-display-name">
                {
                    !tenantAssociations
                        ? (
                            <Placeholder data-testid="tenant-loading-placeholder">
                                <Placeholder.Line />
                            </Placeholder>
                        )
                        : tenantAssociations.currentTenant
                }
            </div>
        </span>
    );

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    const resolveAssociatedTenants = (): ReactElement => {
        if (Array.isArray(tempTenantAssociationsList)) {
            return (
                <Item.Group
                    className="tenants-list"
                    unstackable
                    data-testid={ `associated-tenants-container` }
                >
                    {
                        tempTenantAssociationsList.length > 0 ?
                            (
                                tempTenantAssociationsList.map((association, index) => (
                                    (association !== tenantAssociations.currentTenant) ?
                                        <Item
                                            className="tenant-account"
                                            key={ index }
                                            onClick={ () => handleTenantSwitch(association) }
                                        >
                                            <GenericIcon
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
                                                    <div
                                                        className="email"
                                                        data-testid={ `${ association }-tenant-la-email` }
                                                    >
                                                        { tenantAssociations.username }
                                                    </div>
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
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
                                                {
                                                    t("extensions:manage.features.tenant.header.tenantSearch.emptyResultMessage")
                                                }
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

    const tenantDropdownLinks: TenantDropdownLinkInterface[] = [
        {
            icon: "plus",
            name: t("extensions:manage.features.tenant.header.tenantAddHeader"),
            onClick: () => { setShowTenantAddModal(true); }
        }
    ];

    const setDefaultTenantInDropdown = (tenantName: string): void => {
        setIsSetDefaultTenantInProgress(true);
        makeTenantDefault(tenantName)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.defaultTenant.success." +
                            "description", { tenantName: tenantName }),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.defaultTenant.success.message")
                    }));

                    setDefaultTenant(tenantName);
                }
            })
            .catch(error => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.message")
                }));
            })
            .finally(() => {
                setIsSetDefaultTenantInProgress(false);
            });
    };

    /**
     * Search the tenant list.
     *
     * @param event
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

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setIsSwitchTenantsSelected(false);
        if (tenantAssociations && Array.isArray(tenantAssociations.associatedTenants)) {
            setTempTenantAssociationsList(tenantAssociations.associatedTenants);
        }
    };

    const tenantDropdownMenu = (
        <Menu.Item className="tenant-dropdown-wrapper" key="tenant-dropdown">
            <Dropdown
                onBlur={ resetTenantDropdown }
                item
                trigger={ triggerTenant }
                floating
                pointing="top left"
                className="tenant-dropdown"
                data-testid={ `tenant-dropdown` }
            >
                {
                    !isSwitchTenantsSelected ? (
                        <Dropdown.Menu onClick={ handleDropdownClick }>
                            <Item.Group className="current-tenant" unstackable>
                                <Item
                                    className="header"
                                    key={ `current-tenant` }
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
                                                    `tenant-dropdown-display-name`
                                                }
                                            >
                                                {
                                                    tenantAssociations
                                                        ? tenantAssociations.currentTenant
                                                        : <Placeholder>
                                                            <Placeholder.Line />
                                                        </Placeholder>
                                                }
                                            </div>
                                            {
                                                tenantAssociations ? (
                                                    tenantAssociations.currentTenant ===
                                                    tenantAssociations.defaultTenant ? (
                                                            <Button
                                                                size="tiny"
                                                                basic
                                                                color="grey"
                                                                className="default-button disabled"
                                                                data-testid={ `default-button` }
                                                            >
                                                                { t("extensions:manage.features.tenant.header.tenantDefaultButton") }
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
                                                                onClick={ () =>
                                                                    setDefaultTenantInDropdown(tenantAssociations.currentTenant)
                                                                }
                                                                data-testid={ `default-button` }
                                                            >
                                                                { t("extensions:manage.features.tenant.header.tenantMakeDefaultButton") }
                                                            </Button>
                                                        )
                                                ) : null
                                            }
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            {
                                tenantAssociations &&
                                tenantAssociations.associatedTenants &&
                                Array.isArray(tenantAssociations.associatedTenants) &&
                                tenantAssociations.associatedTenants.length > 0
                                    ? (
                                        <Dropdown.Item
                                            className="action-panel"
                                            onClick={ () => setIsSwitchTenantsSelected(true) }
                                            data-testid={ `tenant-switch-menu` }
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
                                                    icon &&
                                                    <Icon
                                                        className="link-icon"
                                                        name={ icon }
                                                    />
                                                }
                                                { name }
                                                { content }
                                            </Dropdown.Item>
                                        );
                                    })
                                    : null
                            }
                        </Dropdown.Menu>
                    ) : (
                            <Dropdown.Menu onClick={ handleDropdownClick }>
                                <Item.Group className="current-tenant" unstackable>
                                    <Item
                                        className="header back-button-wrapper"
                                        key={ `current-tenant` }
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
                                <Item.Group className="search-bar">
                                    <div className="advanced-search-wrapper aligned-left fill-default">
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
    );

    return (
        <>
            {
                showTenantAddModal
                    ? (
                        <AddTenantWizard
                            openModal={ showTenantAddModal }
                            onCloseHandler={ () => setShowTenantAddModal(false) } />
                    )
                    : null
            }
            { tenantDropdownMenu }
        </>
    );
};

export default TenantDropdown;
