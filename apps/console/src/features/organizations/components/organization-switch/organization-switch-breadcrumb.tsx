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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SessionStorageUtils } from "@wso2is/core/utils";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Breadcrumb, Dropdown, Icon, Menu } from "semantic-ui-react";
import OrganizationSwitchDropdown from "./organization-switch-dropdown";
import { organizationConfigs } from "../../../../extensions";
import { AppConstants, AppState } from "../../../core";
import { useGetOrganizationBreadCrumb } from "../../api";
import { OrganizationType } from "../../constants";
import { useGetOrganizationType } from "../../hooks/use-get-organization-type";
import {
    BreadcrumbItem,
    GenericOrganization
} from "../../models";
import { OrganizationUtils } from "../../utils";

/**
 * Interface for component dropdown.
 */
type OrganizationSwitchDropdownInterface = IdentifiableComponentInterface;

export const OrganizationSwitchBreadcrumb: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const { "data-componentid": componentId } = props;

    const currentOrganization: string = useSelector(
        (state: AppState) => state.organization.currentOrganization
    );

    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state?.organization?.isFirstLevelOrganization
    );

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const orgType: OrganizationType = useGetOrganizationType();

    const shouldSendRequest: boolean = useMemo(() => {
        return (
            isFirstLevelOrg ||
            window[ "AppUtils" ].getConfig().organizationName ||
            tenantDomain === AppConstants.getSuperTenant()
        );
    }, [ isFirstLevelOrg, tenantDomain ]);

    const { data: breadcrumbList, error, isLoading } = useGetOrganizationBreadCrumb(
        shouldSendRequest
    );

    useEffect(() => {
        if (!error) {
            return;
        }

        dispatch(addAlert({
            description: t("console:common.header.organizationSwitch.breadcrumbError.description"),
            level: AlertLevels.ERROR,
            message: error?.message ?? t("console:common.header.organizationSwitch.breadcrumbError.message")
        }));

    }, [ error ]);

    const handleOrganizationSwitch = (
        organization: GenericOrganization
    ): void => {
        let newOrgPath: string = "";

        if (
            breadcrumbList && breadcrumbList.length > 0 &&
            OrganizationUtils.isRootOrganization(breadcrumbList[ 0 ]) &&
            breadcrumbList[ 1 ]?.id === organization.id &&
            organizationConfigs.showSwitcherInTenants
        ) {
            newOrgPath =
                "/t/" +
                organization.name +
                "/" +
                window[ "AppUtils" ].getConfig().appBase;
        } else if (OrganizationUtils.isRootOrganization(organization)) {
            newOrgPath = `/${ window[ "AppUtils" ].getConfig().appBase }`;
        } else {
            newOrgPath =
                "/o/" +
                organization.id +
                "/" +
                window[ "AppUtils" ].getConfig().appBase;
        }

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage(
            "auth_callback_url_console"
        );

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);
    };

    const generateSuperBreadcrumbItem = (
        item: BreadcrumbItem
    ): ReactElement => {
        return OrganizationUtils.isRootOrganization(item) ? (
            <Breadcrumb.Section 
                style={ { "color": "#ffffff" } } 
                active
            >
                <span className="ellipsis organization-name">{ resolveTriggerName() }</span>
            </Breadcrumb.Section>
        ) : (
            <span
                onClick={ () => handleOrganizationSwitch(item) }
                data-componentid={ `${ componentId }-breadcrumb-item-super-organization` }
                className="ellipsis"
            >
                { item.name }
            </span>
        );
    };

    const generateBreadcrumb = (): ReactElement => {
        if (!breadcrumbList || breadcrumbList.length < 1) {
            return;
        }

        if (breadcrumbList?.length <= 4) {
            return (
                <>
                    { breadcrumbList?.map(
                        (breadcrumb: BreadcrumbItem, index: number) => {
                            if (index === 0) {
                                return (
                                    <>
                                        { generateSuperBreadcrumbItem(breadcrumb) }  
                                    </>
                                );
                            }
                            if (
                                index !== 0 && (index !== breadcrumbList.length - 1 ||
                                !organizationConfigs.canCreateOrganization())
                            ) {
                                return (
                                    <>
                                        <Breadcrumb.Section 
                                            key={ index }
                                            onClick={ (event: SyntheticEvent<HTMLElement>) => {
                                                if (index !== breadcrumbList.length - 1) {
                                                    event.stopPropagation();
                                                    handleOrganizationSwitch(breadcrumb);
                                                }
                                            }}
                                            className={
                                                index ===
                                                breadcrumbList.length - 1
                                                    ? "un-clickable ellipsis"
                                                    : "ellipsis"
                                            }
                                            data-componentid={ 
                                                `${ componentId }-breadcrumb-item-${ breadcrumb.name }` 
                                            }
                                            style={ { 
                                                "color": "#ffffff", 
                                                "minHeight": "15px", 
                                                "margin": "-3px 0", 
                                                "pointer-events": index === breadcrumbList.length - 1 ? "none" : "auto"
                                            } }
                                            active
                                        >
                                            { breadcrumb.name }
                                        </Breadcrumb.Section>
                                        <Breadcrumb.Divider 
                                            style={ { 
                                                "margin": "0 5px",
                                                "color": "#ffffff", 
                                                "display": index === breadcrumbList.length - 1 ? "none" : "inline-block"
                                            } }
                                        />
                                    </>
                                );
                            }
                        }
                    ) }
                </>
            );
        }

        return (
            <Menu className="organization-breadcrumb">
                <Menu.Item className="breadcrumb">
                    { generateSuperBreadcrumbItem(breadcrumbList[ 0 ]) }
                    <Icon name="angle right" className="separator-icon" />
                </Menu.Item>
                <Dropdown
                    item
                    text="..."
                    icon="angle right"
                    className="breadcrumb-dropdown breadcrumb"
                    data-componentid={ `${ componentId }-breadcrumb-ellipsis` }
                >
                    <Dropdown.Menu>
                        { (breadcrumbList && breadcrumbList?.length > 0) && breadcrumbList?.map(
                            (breadcrumb: BreadcrumbItem, index: number) => {
                                if (
                                    index === 0 ||
                                    index > breadcrumbList.length - 3
                                ) {
                                    return;
                                }

                                return (
                                    <Dropdown.Item
                                        key={ index }
                                        onClick={ () =>
                                            handleOrganizationSwitch(breadcrumb)
                                        }
                                        icon="angle right"
                                        text={ breadcrumb.name }
                                        className="breadcrumb-dropdown-item"
                                        data-componentid={ `${ componentId }-breadcrumb-menu-${ breadcrumb.name }` }
                                    />
                                );
                            }
                        ) }
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item className="breadcrumb">
                    <span
                        onClick={ () =>
                            handleOrganizationSwitch(
                                breadcrumbList[ breadcrumbList.length - 2 ]
                            )
                        }
                        data-componentid={ `${
                            componentId }-breadcrumb-item-${ breadcrumbList[ breadcrumbList.length - 2 ].name }` }
                        className="ellipsis"
                    >
                        { breadcrumbList[ breadcrumbList?.length - 2 ].name }
                    </span>
                    <Icon name="angle right" className="separator-icon" />
                </Menu.Item>
                { organizationConfigs.canCreateOrganization() ? (
                    <OrganizationSwitchDropdown
                        triggerName={
                            breadcrumbList[ breadcrumbList.length - 1 ].name
                        }
                        handleOrganizationSwitch={ handleOrganizationSwitch }
                        isBreadcrumbItem={ true }
                    />
                ) : (
                    <Menu.Item className="breadcrumb">
                        <span
                            data-componentid={ `${
                                componentId
                            }-breadcrumb-item-${ breadcrumbList[ breadcrumbList.length - 1 ].name }` }
                            className="un-clickable ellipsis"
                        >
                            { breadcrumbList[ breadcrumbList.length - 1 ].name }
                        </span>
                    </Menu.Item>
                ) }
            </Menu>
        );
    };

    const resolveTriggerName = (): string => {
        if (
            AppConstants.getSuperTenant() === tenantDomain ||
            window[ "AppUtils" ].getConfig().organizationName
        ) {
            return currentOrganization;
        }

        return tenantDomain;
    };

    const triggerOrganizationDropdown = (): ReactElement => {
        return (
            <>
                {
                    !isLoading && (
                        <div className="organization-breadcrumb-wrapper">
                            <div 
                                style={ { 
                                    "marginLeft": "36px", 
                                    "cursor": "pointer" 
                                } } 
                                onClick={ () => setIsDropDownOpen(!isDropDownOpen) }
                            >
                                <p 
                                    style={ { 
                                        "fontSize": "11px", 
                                        "color": "#ffffff",
                                        "marginBottom": "-1px",
                                        "fontWeight": "100"
                                    } }
                                >
                                    Organization
                                </p>
                                <Breadcrumb>
                                    { generateBreadcrumb() }
                                    {
                                        breadcrumbList?.length == 2 && (
                                            <Icon
                                                style={ { 
                                                    "color": "#000000 !important",
                                                    "alignItems": "center",
                                                    "margin": "0px 5px"
                                                } }
                                                color="grey"
                                                name={ isDropDownOpen ? "angle up" : "angle down" }
                                                className="separator-icon"
                                            />
                                        )
                                    }
                                </Breadcrumb> 
                            </div>  
                        </div>
                    )
                }
            </>
        );
    }

    return (
        <>
             <OrganizationSwitchDropdown 
                isDropdownOpened={ isDropDownOpen } 
                handleOrganizationSwitch={ handleOrganizationSwitch } 
                dropdownTrigger={ triggerOrganizationDropdown() }
                disable={ breadcrumbList?.length > 2 }
            />
        </>
    );
};

OrganizationSwitchBreadcrumb.defaultProps = {
    "data-componentid": "organization-switch-breadcrumb"
};
