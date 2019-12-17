/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import _ from "lodash";
import React, { SyntheticEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Button,
    Container,
    Divider,
    Dropdown,
    Icon,
    Item,
    Menu,
    Placeholder,
    Responsive
} from "semantic-ui-react";
import { getGravatarImage, switchAccount } from "../../api";
import { resolveUserDisplayName, resolveUsername } from "../../helpers";
import { AlertLevels, AuthStateInterface, LinkedAccountInterface } from "../../models";
import { AppState } from "../../store";
import { addAlert, getProfileInformation, getProfileLinkedAccounts } from "../../store/actions";
import { Title, UserAvatar } from "../shared";

/**
 * Header component prop types.
 */
interface HeaderProps {
    onSidePanelToggleClick?: () => void;
    showSidePanelToggle?: boolean;
}

/**
 * Header component.
 *
 * @param {HeaderProps} props - Props supplied to the header component.
 * @return {JSX.Element}
 */
export const Header: React.FunctionComponent<HeaderProps> = (props: HeaderProps): JSX.Element => {
    const { t } = useTranslation();
    const { onSidePanelToggleClick, showSidePanelToggle } = props;
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const linkedAccounts: LinkedAccountInterface[] = useSelector((state: AppState) => state.profile.linkedAccounts);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        if (_.isEmpty(profileDetails)) {
            dispatch(getProfileInformation());
        }

        if (_.isEmpty(linkedAccounts)) {
            dispatch(getProfileLinkedAccounts());
        }
    }, []);

    const trigger = (
        <span className="user-dropdown-trigger">
            <div className="username">{
                isProfileInfoLoading
                    ? (
                        <Placeholder>
                            <Placeholder.Line/>
                        </Placeholder>
                    )
                    : resolveUserDisplayName(profileDetails)
            }</div>
            <UserAvatar isLoading={ isProfileInfoLoading } authState={ profileDetails } size="mini"/>
        </span>
    );

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>) => {
        e.stopPropagation();
    };

    /**
     * Handles the account switch click event.
     *
     * @param { LinkedAccountInterface } account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        switchAccount(account)
            .then(() => {
                // reload the page on successful account switch.
                window.location.reload();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "views:components.linkedAccounts.notifications.switchAccount.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "views:components.linkedAccounts.notifications.switchAccount.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "views:components.linkedAccounts.notifications.switchAccount.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.linkedAccounts.notifications.switchAccount.genericError.message"
                        )
                    })
                );
            });
    };

    return (
        <Menu id="app-header" className="app-header" fixed="top" borderless>
            <Container>
                { showSidePanelToggle ?
                    (
                        <Responsive as={ Menu.Item } maxWidth={ 767 }>
                            <Icon name="bars" size="large" onClick={ onSidePanelToggleClick } link/>
                        </Responsive>
                    )
                    : null
                }
                <Menu.Item as={ Link } to={ APP_HOME_PATH } header>
                    <Title style={ { marginTop: 0 } }/>
                </Menu.Item>
                { (
                    <Menu.Menu position="right">

                        <Dropdown
                            item
                            trigger={ trigger }
                            floating
                            icon={ null }
                            className="user-dropdown"
                        >
                            <Dropdown.Menu onClick={ handleUserDropdownClick }>
                                <Item.Group className="authenticated-user" unstackable>
                                    <Item
                                        className="header"
                                        key={ `logged-in-user-${ profileDetails.profileInfo.userName }` }
                                    >
                                        <UserAvatar
                                            authState={ profileDetails }
                                            isLoading={ isProfileInfoLoading }
                                            size="tiny"
                                        />
                                        <Item.Content verticalAlign="middle">
                                            <Item.Description>
                                                < div className="name">
                                                    {
                                                        isProfileInfoLoading
                                                            ? <Placeholder><Placeholder.Line/></Placeholder>
                                                            : resolveUserDisplayName(profileDetails)
                                                    }
                                                </div>

                                                {
                                                    (profileDetails.profileInfo.emails !== undefined
                                                        && profileDetails.profileInfo.emails !== null)
                                                    && (
                                                        <div className="email">
                                                            { isProfileInfoLoading
                                                                ? <Placeholder><Placeholder.Line/></Placeholder>
                                                                : typeof profileDetails.profileInfo
                                                                    .emails[ 0 ] === "string"
                                                                    ? profileDetails.profileInfo.emails[ 0 ]
                                                                    : typeof profileDetails.profileInfo
                                                                        .emails[ 0 ] === "object"
                                                                        ? profileDetails.profileInfo.emails[ 0 ].value
                                                                        : ""
                                                            }
                                                        </div>
                                                    )
                                                }
                                                <Divider hidden/>
                                                <Button
                                                    as={ Link }
                                                    to="/personal-info"
                                                    size="tiny"
                                                    primary
                                                >
                                                    { t("common:personalInfo") }
                                                </Button>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                <Dropdown.Divider/>
                                {
                                    (linkedAccounts && linkedAccounts.length && linkedAccounts.length > 0)
                                        ? (
                                            <Item.Group className="linked-accounts-list" unstackable>
                                                {
                                                    linkedAccounts.map((association, index) => (
                                                        <Item
                                                            className="linked-account"
                                                            key={ `${ association.userId }-${ index }` }
                                                            onClick={
                                                                () => handleLinkedAccountSwitch(association)
                                                            }
                                                        >
                                                            <UserAvatar
                                                                bordered
                                                                avatar
                                                                size="little"
                                                                image={ getGravatarImage(association.email) }
                                                                name={ association.username }
                                                            />
                                                            <Item.Content verticalAlign="middle">
                                                                <Item.Description>
                                                                    <div className="name">
                                                                        {
                                                                            resolveUsername(
                                                                                association.username,
                                                                                association.userStoreDomain
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className="email">
                                                                        { association.tenantDomain }
                                                                    </div>
                                                                </Item.Description>
                                                            </Item.Content>
                                                        </Item>
                                                    ))
                                                }
                                            </Item.Group>
                                        )
                                        : null
                                }
                                <Dropdown.Item className="action-panel">
                                    <Link className="action-button" to="/logout">{ t("common:logout") }</Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                ) }
            </Container>
        </Menu>
    );
};

/**
 * Default prop types for the header component.
 */
Header.defaultProps = {
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true
};
