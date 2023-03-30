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
import { Breadcrumb, Dropdown, Icon } from "semantic-ui-react";
import OrganizationSwitchDropdown from "./organization-switch-dropdown";
import { organizationConfigs } from "../../../../extensions";
import { AppConstants, AppState } from "../../../core";
import { useGetOrganizationBreadCrumb } from "../../api";
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

    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state?.organization?.isFirstLevelOrganization
    );

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

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
        item?: BreadcrumbItem
    ): ReactElement => {
        return OrganizationUtils.isRootOrganization(item) ? (
            <>
                <Breadcrumb.Section 
                    onClick={ 
                        breadcrumbList.length !== 1 
                            ? (event: SyntheticEvent<HTMLElement>) => { 
                                event.stopPropagation();
                                handleOrganizationSwitch(item); 
                            }
                            : null 
                    } 
                    className="organization-breadcrumb-item"
                >
                    <span className="ellipsis organization-name">
                        { item?.name }
                    </span>
                </Breadcrumb.Section>
                { breadcrumbList.length === 1 && (
                    <Icon
                        claslName="organization-breadcrumb-icon"
                        name={ isDropDownOpen ? "angle up" : "angle down" }
                        className="separator-icon"
                    /> 
                ) }
            </>
        ) : (
            <Breadcrumb.Section 
                active
            >
                <span
                    onClick={ () => handleOrganizationSwitch(item) }
                    data-componentid={ `${ componentId }-breadcrumb-item-super-organization` }
                    className="organization-breadcrumb-item ellipsis"
                >
                    { item.name }
                </span>
            </Breadcrumb.Section>
        );
    };

    const resolveBreadcrumbIcon = (index: number): ReactElement => {
        return index !== breadcrumbList.length - 1 ? (
            <Breadcrumb.Divider 
                className="organization-breadcrumb-item-divider"
            />
        ) : (
            <>
                {
                    !organizationConfigs.showSwitcherInTenants
                        ? (
                            <Icon
                                key={ index }
                                claslName="organization-breadcrumb-icon"
                                name={ isDropDownOpen ? "angle up" : "angle down" }
                                className="separator-icon"
                            /> 
                        ) : (
                            breadcrumbList.length <= 2 && (
                                <Icon
                                    key={ index }
                                    claslName="organization-breadcrumb-icon"
                                    name={ isDropDownOpen ? "angle up" : "angle down" }
                                    className="separator-icon"
                                /> 
                            )
                        )
                }
            </>                                                         
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
                            if (index === 0 && !organizationConfigs.showSwitcherInTenants) {
                                return (
                                    <>
                                        { generateSuperBreadcrumbItem(breadcrumb) } 
                                        {
                                            breadcrumbList.length !== 1 && (
                                                <Breadcrumb.Divider 
                                                    className="organization-breadcrumb-item-divider"
                                                />
                                            ) 
                                        } 
                                    </>
                                );
                            }
                            if (index === 1 && 
                                organizationConfigs.showSwitcherInTenants &&
                                breadcrumbList?.length === 2
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
                                            } }
                                            className="organization-breadcrumb-item first"
                                            data-componentid={ 
                                                `${ componentId }-breadcrumb-item-${ breadcrumb.name }` 
                                            }
                                            active
                                        >
                                            { breadcrumb.name }
                                        </Breadcrumb.Section>
                                        { resolveBreadcrumbIcon(index) }
                                    </>
                                );
                            }
                            if (index > 0) {
                                return (
                                    <>
                                        <Breadcrumb.Section 
                                            key={ index }
                                            onClick={ (event: SyntheticEvent<HTMLElement>) => {
                                                if (index !== breadcrumbList.length - 1) {
                                                    event.stopPropagation();
                                                    handleOrganizationSwitch(breadcrumb);
                                                }
                                            } }
                                            className={
                                                index ===
                                                breadcrumbList.length - 1
                                                    ? "organization-breadcrumb-item un-clickable ellipsis"
                                                    : "organization-breadcrumb-item ellipsis"
                                            }
                                            data-componentid={ 
                                                `${ componentId }-breadcrumb-item-${ breadcrumb.name }` 
                                            }
                                            active
                                        >
                                            { breadcrumb.name }
                                        </Breadcrumb.Section>
                                        { resolveBreadcrumbIcon (index) }
                                    </>
                                );
                            }
                        }
                    ) }
                </>
            );
        }

        return (
            <>
                { generateSuperBreadcrumbItem(breadcrumbList[ 0 ]) }
                <Breadcrumb.Divider className="organization-breadcrumb-item-divider" />
                <Breadcrumb.Section>
                    <Dropdown
                        item
                        text="..."
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
                </Breadcrumb.Section>
                <Breadcrumb.Divider className="organization-breadcrumb-item-divider" />
                <Breadcrumb.Section active>
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
                    <Breadcrumb.Divider className="organization-breadcrumb-item-divider" />
                </Breadcrumb.Section>
                { organizationConfigs.canCreateOrganization() ? (
                    <OrganizationSwitchDropdown
                        triggerName={
                            breadcrumbList[ breadcrumbList.length - 1 ].name
                        }
                        handleOrganizationSwitch={ handleOrganizationSwitch }
                        isBreadcrumbItem={ true }
                    />
                ) : (
                    <Breadcrumb.Section active>
                        <span
                            data-componentid={ `${
                                componentId
                            }-breadcrumb-item-${ breadcrumbList[ breadcrumbList.length - 1 ].name }` }
                            className="un-clickable ellipsis"
                        >
                            { breadcrumbList[ breadcrumbList.length - 1 ].name }
                        </span>
                    </Breadcrumb.Section>
                ) }
            </>
        );
    };

    const  triggerOrganizationDropdown = (): ReactElement => {
        return (
            <>
                {
                    !isLoading && (
                        <div className="organization-breadcrumb-wrapper">
                            <div
                                tabIndex={ 0 }
                                onBlur={ () => setIsDropDownOpen(false) } 
                                className="organization-breadcrumb" 
                                onClick={ () => setIsDropDownOpen(!isDropDownOpen) }
                            >
                                <p className="organization-breadcrumb-label">
                                    { t("console:manage.features.organizations.switching.switchLabel") }
                                </p>
                                <Breadcrumb>
                                    { generateBreadcrumb() }
                                </Breadcrumb> 
                            </div>  
                        </div>
                    )
                }
            </>
        );
    };

    return (
        <>
            { 
                !organizationConfigs.showSwitcherInTenants 
                    ? (
                        <OrganizationSwitchDropdown 
                            handleOrganizationSwitch={ handleOrganizationSwitch } 
                            dropdownTrigger={ triggerOrganizationDropdown() }
                        />
                    ) : (
                        organizationConfigs.tenantSwitcher(triggerOrganizationDropdown(), breadcrumbList?.length > 2)
                    ) 
            } 
        </>
    );
};

OrganizationSwitchBreadcrumb.defaultProps = {
    "data-componentid": "organization-switch-breadcrumb"
};
