/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {  AppSwitchCard, GenericIcon } from "@wso2is/react-components";
import React, { SyntheticEvent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Card,  Dropdown, Grid } from "semantic-ui-react";
import { AppSwitchIcons } from "../../configs";
import { AppConstants } from "../../constants";
import { AppState } from "../../store";

/**
 * Prop types for the App Switch component.
 * Also see {@link AppSwitch.defaultProps}
 */
export interface AppSwitchProps extends TestableComponentInterface {
     /**
     * Card Background color.
     */
    background?: "transparent" | "default";
    /**
     * If a bottom margin should be added.
     */
    bottomMargin?: boolean;
}

/**
 * Appswitch component.
 *
 * @param {React.PropsWithChildren<AppSwitchProps>} props - Props passed in to the App switch component.
 * @return {React.ReactElement}
 */
export const AppSwitch: React.FunctionComponent<AppSwitchProps> = (props: AppSwitchProps): ReactElement => {
    
    const {
        background,
        bottomMargin,
        ["data-testid"]: testId
    } = props;

    const showAppSwitchButton: boolean = useSelector((state: AppState) => state?.config?.ui?.showAppSwitchButton);
    const consoleAppURL: string = useSelector((state: AppState) => state?.config?.deployment?.consoleApp?.path);
    const accountAppURL: string = useSelector((state: AppState) => state?.config?.deployment?.appHomePath);

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    return (
        <>
            {
                showAppSwitchButton 
                && (AppConstants.getTenant() === AppConstants.getSuperTenant()) 
                && (
                    <Dropdown
                        item
                        floating
                        icon={ 
                            <GenericIcon
                                        inline
                                        transparent
                                        className="display-flex"
                                        icon={ AppSwitchIcons().appSwitchIcon }
                                        fill= "white"
                            />
                                    }
                        className="app-switch-dropdown"
                        data-testid={ `${ testId }-dropdown` }
                    >
                    {
                        <Dropdown.Menu className="app-switch-dropdown-menu" onClick={ handleUserDropdownClick }>
                            <Grid className="mt-3 mb-3" centered>
                                <Grid.Row >
                                <Card.Group  centered>
                                <AppSwitchCard
                                    background= { background }
                                    label={ "Console" }
                                    imageSize="x50"
                                    image={ AppSwitchIcons().consoleIcon }
                                    bottomMargin= { bottomMargin }
                                    onClick= { ()=> window.open(consoleAppURL,"_blank", "noopener") }
                                    data-testid={ `${ testId }-console` }  
                                      
                                />
                                <AppSwitchCard
                                    background={ background }
                                    label={ "My Account" }
                                    imageSize="x50"
                                    image={ AppSwitchIcons().myAccountIcon }
                                    bottomMargin= { true }
                                    onClick = { () =>window.open(accountAppURL,"_self") }  
                                    data-testid={ `${ testId }-myaccount` } 
                                    
                                />
                                
                                </Card.Group>
                                </Grid.Row>
                            </Grid>
                        </Dropdown.Menu>   
                    }
                </Dropdown>
                )
            }
        </>
    );
};

/**
 * Default prop types for the App switch component.
 * See type definitions in {@link AppSwitchProps}
 */
AppSwitch.defaultProps = {
    background: "transparent",
    bottomMargin: true,
    ["data-testid"]: "app-switch"
};
