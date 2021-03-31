/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { SyntheticEvent } from "react";
import {  AppSwitchCard, GenericIcon } from "@wso2is/react-components";
import { AppSwitchIcons } from "../../configs";
import { Card,  Dropdown, Grid } from "semantic-ui-react";
import { TestableComponentInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { AppConstants } from "../../constants";



/**
 * Prop types for the Avatar component.
 * Also see {@link Avatar.defaultProps}
 */
export interface AppSwitchProps extends TestableComponentInterface {
    background?: "transparent" | "default";
    bottomMargin: boolean
}


/**
 * Avatar component.
 *
 * @param {React.PropsWithChildren<AvatarProps>} props - Props passed in to the Avatar component.
 * @return {JSX.Element}
 */
export const AppSwitch: React.FunctionComponent<AppSwitchProps> = (props: AppSwitchProps): JSX.Element => {
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
  const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    };

    return (
        <>
            {
                showAppSwitchButton && (AppConstants.getTenant() === AppConstants.getSuperTenant()) &&
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
                                    onClick= {()=> window.open(consoleAppURL,"_blank", "noopener")}
                                    data-testid={ `${ testId }-console` }  
                                      
                                />
                                <AppSwitchCard
                                    background={ background }
                                    label={ "My Account" }
                                    imageSize="x50"
                                    image={ AppSwitchIcons().myAccountIcon }
                                    bottomMargin= { true }
                                    onClick = {() =>window.open(accountAppURL,"_self") }  
                                    data-testid={ `${ testId }-myaccount` } 
                                    
                                />
                                
                                </Card.Group>
                                </Grid.Row>
                            </Grid>
                        </Dropdown.Menu>   
                }
            </Dropdown>
            }
        </>
    );
};

/**
 * Default prop types for the Avatar component.
 * See type definitions in {@link AvatarProps}
 */
AppSwitch.defaultProps = {
    background: "transparent",
    bottomMargin: true,
    ["data-testid"]: "app-switch"
};

