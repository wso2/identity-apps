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

import { TestableComponentInterface } from "@wso2is/core/models";
import { useMediaContext } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, SyntheticEvent  } from "react";
import { Button, Header, Segment } from "semantic-ui-react";

/**
 * Danger zone component Prop types.
 * @deprecated Use the `DangerZoneProps` from {@link @wso2is/react-components#DangerZoneProps}.
 */
export interface DangerZoneProps extends TestableComponentInterface {
    /**
     * Title for the danger zone action.
     */
     actionTitle: string;
     /**
      * Heading for the danger zone.
      */
     header: string;
     /**
      * Sub heading for the danger zone.
      */
     subheader: string;
     /**
      * OnClick callback for the danger zone action.
      * @param e - Click event.
      */
     onActionClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
}

/**
 * Danger zone component.
 *
 * @deprecated Use the `DangerZone` from {@link @wso2is/react-components#DangerZone}.
 * @param props - Props injected to the danger zone component.
 * @returns Danger Zone component.
 */
export const DangerZone: FunctionComponent<DangerZoneProps> = (
    props: DangerZoneProps
): ReactElement => {

    const {
        actionTitle,
        header,
        subheader,
        onActionClick,
        [ "data-testid" ]: testId
    } = props;

    const { isMobileViewport } = useMediaContext();

    return (
        <Segment data-testid={ testId } className="danger-zone" padded clearing>
            <Header as="h5" color="red" floated="left" data-testid={ `${ testId }-header` }>
                { header }
                <Header.Subheader className="sub-header" data-testid={ `${ testId }-sub-header` }>
                    { subheader }
                </Header.Subheader>
            </Header>
            <Button
                fluid={ isMobileViewport }
                data-testid={ testId + "-delete-button" }
                negative
                className={
                    isMobileViewport
                        ? "mb-1x mt-1x"
                        : ""
                }
                floated="right"
                onClick={ onActionClick }
            >
                { actionTitle }
            </Button>
        </Segment>
    );
};

/**
 * Danger zone group component Prop types.
 */
interface DangerZoneGroupProps {
    sectionHeader: string;
}

/**
 * Danger zone group component.
 *
 * @deprecated Use the `DangerZoneGroup` from {@link @wso2is/react-components#DangerZoneGroup}.
 * @param props - Props injected to the danger zone group component.
 * @returns Danger Zone Group component.
 */
export const DangerZoneGroup: React.FunctionComponent<PropsWithChildren<DangerZoneGroupProps>> = (
    props: PropsWithChildren<DangerZoneGroupProps>
): JSX.Element => {
    const { sectionHeader, children } = props;

    return (
        <>
            <Header as="h5" className="bold-text">{ sectionHeader }</Header>
            <Segment.Group className="danger-zone-group">
                { children }
            </Segment.Group>
        </>
    );
};

/**
 * Default props for the danger zone component.
 */
DangerZone.defaultProps = {
    "data-testid": "danger-zone"
};
