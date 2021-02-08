/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Heading, LabeledCard, Text } from "@wso2is/react-components";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
    useState
} from "react";
import {
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { Icon, Label, Popup } from "semantic-ui-react";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";
import { ApplicationManagementConstants } from "../../../../constants";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface extends TestableComponentInterface {
    /**
     * List of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Default name for authenticators with no name.
     */
    defaultName?: string;
    /**
     * ID for the droppable field.
     */
    droppableId: string;
    /**
     * Empty placeholder.
     */
    emptyPlaceholder?: ReactNode;
    /**
     * Heading for the authenticators section.
     */
    heading?: string;
    /**
     * Is dropping allowed.
     */
    isDropDisabled?: boolean;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Denotes whether the authenticator is a social login.
     */
    isSocialLogin?: boolean;
    /**
     * Handles on click of social login add.
     */
    handleSocialLoginAdd?: any;
}

const portal: HTMLElement = document.createElement("div");
portal.classList.add("draggable-portal");

if (!document.body) {
    throw new Error("document body is not ready for portal creation!");
}

document.body.appendChild(portal);

/**
 * Component to render the list of authenticators.
 *
 * @param {AuthenticatorsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): ReactElement => {

    const {
        authenticators,
        className,
        defaultName,
        droppableId,
        emptyPlaceholder,
        heading,
        isDropDisabled,
        readOnly,
        isSocialLogin,
        handleSocialLoginAdd,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ draggableAuthenticators, setDraggableAuthenticators ] = useState<ReactElement[]>(null);
    const [ draggableAddSocialAuthenticatorButton, setDraggableAddSocialAuthenticatorButton ] =
        useState<ReactElement[]>(null);

    const classes = classNames("authenticators", className);

    const isAuthenticatorDisabled = (authenticator) => {
        if (droppableId === ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID) {
            return !(authenticator?.isEnabled);
        }
        if (droppableId === ApplicationManagementConstants.EXTERNAL_AUTHENTICATORS_DROPPABLE_ID) {
            return !(authenticator
                && authenticator.authenticators[ 0 ]
                && authenticator.authenticators[ 0 ].isEnabled);
        }
    };

    const resolvePopupContent = () => {
        if (droppableId === ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID) {
            return (
                <Text>
                    {
                        t("console:develop.features.applications.edit." +
                            "sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased." +
                            "secondFactorDisabled")
                    }
                </Text>
            );
        } else if (droppableId === ApplicationManagementConstants.EXTERNAL_AUTHENTICATORS_DROPPABLE_ID) {
            return (
                <Text>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.authenticatorDisabled")
                    }
                </Text>
            );
        }
    };

    /**
     * Having `PortalAwareDraggable` in return causes flickers due to `ReactDOM.createPortal`
     * triggering every time dom nodes are updated. Having it in a state fixes the flicker.
     */
    useEffect(() => {

        if (!authenticators || !Array.isArray(authenticators) || authenticators.length < 1) {
            return;
        }

        const draggableNodes: ReactElement[] = [];

        authenticators.map((authenticator, index) => {

            draggableNodes.push(
                <Draggable
                    key={ `${ authenticator.idp }-${ authenticator.id }` }
                    draggableId={ authenticator.id }
                    index={ index }
                    isDragDisabled={ readOnly || isAuthenticatorDisabled(authenticator) }
                >
                    { (
                        draggableProvided: DraggableProvided,
                        draggableSnapshot: DraggableStateSnapshot
                    ): React.ReactElement<HTMLElement> => (
                        <PortalAwareDraggable
                            provided={ draggableProvided }
                            snapshot={ draggableSnapshot }
                        >
                            <Popup
                                on="hover"
                                disabled={ !isAuthenticatorDisabled(authenticator) }
                                content={ (
                                    <>
                                        <Label attached="top">
                                            <Icon name="warning sign" /> Warning
                                        </Label>
                                        { resolvePopupContent() }
                                    </>
                                ) }
                                trigger={ (
                                    <div>
                                        <LabeledCard
                                            size="tiny"
                                            disabled={ isAuthenticatorDisabled(authenticator) }
                                            image={ authenticator.image }
                                            label={ authenticator.displayName || defaultName }
                                            labelEllipsis={ true }
                                            data-testid={
                                                `${ testId }-authenticator-${ authenticator.name }`
                                            }
                                        />
                                    </div>
                                ) }
                            />
                        </PortalAwareDraggable>
                    ) }
                </Draggable>
            );
        });

        setDraggableAuthenticators(draggableNodes);
    }, [ authenticators ]);

    /**
     * Having `PortalAwareDraggable` in return causes flickers due to `ReactDOM.createPortal`
     * triggering every time dom nodes are updated. Having it in a state fixes the flicker.
     */
    useEffect(() => {

        if (!isSocialLogin) {
            return;
        }

        const draggableNodes: ReactElement[] = [];

        draggableNodes.push(
            <Draggable
                draggableId="Add"
                isDragDisabled={ true }
                index={ 0 }
            >
                { (
                    draggableProvided: DraggableProvided,
                    draggableSnapshot: DraggableStateSnapshot
                ): React.ReactElement<HTMLElement> => (
                    <PortalAwareDraggable
                        provided={ draggableProvided }
                        snapshot={ draggableSnapshot }
                    >
                        <LabeledCard
                            size="tiny"
                            image={ getGeneralIcons()?.addCircleOutline }
                            label={ "Add" }
                            labelEllipsis={ true }
                            data-testid={
                                `${ testId }-authenticator-add`
                            }
                            imageOptions={ {
                                as: "data-url"
                            } }
                            onClick={ handleSocialLoginAdd }
                        />
                    </PortalAwareDraggable>
                ) }
            </Draggable>
        );

        setDraggableAddSocialAuthenticatorButton(draggableNodes);
    }, [ isSocialLogin ]);

    /**
     * Add a wrapper portal so that the `transform` attributes in the parent
     * component won't affect the draggable position.
     *
     * @see {@link https://github.com/atlassian/react-beautiful-dnd/issues/128)}
     * @param {React.PropsWithChildren<{provided: DraggableProvided; snapshot: DraggableStateSnapshot}>} props
     * @return {React.ReactElement | React.ReactPortal}
     */
    const PortalAwareDraggable = (
        props: PropsWithChildren<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot }>
    ): ReactElement | ReactPortal => {

        const {
            children,
            provided,
            snapshot
        } = props;

        const usePortal: boolean = snapshot.isDragging;

        const child: ReactElement = (
            <div
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }
                className="inline"
            >
                { children }
            </div>
        );

        if (!usePortal) {
            return child;
        }

        // if dragging - put the item in a portal.
        return ReactDOM.createPortal(child, portal);
    };

    return authenticators && authenticators instanceof Array
        ? (
            <>
                { heading && <Heading as="h6">{ heading }</Heading> }
                <Droppable droppableId={ droppableId } direction="horizontal" isDropDisabled={ isDropDisabled }>
                    { (provided: DroppableProvided): React.ReactElement<HTMLElement> => (
                        <div
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                            className={ classes }
                            data-testid={ testId }
                        >
                            { draggableAuthenticators }
                            { draggableAddSocialAuthenticatorButton }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>
            </>
        )
        : (
            <>{ emptyPlaceholder }</>
        );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    "data-testid": "authenticators",
    defaultName: "Unknown",
    isDropDisabled: true,
    isSocialLogin: false
};
