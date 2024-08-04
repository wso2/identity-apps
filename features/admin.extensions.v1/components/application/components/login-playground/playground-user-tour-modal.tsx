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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {  Heading, LinkButton, PrimaryButton, Text } from "@wso2is/react-components";
import React, { Fragment,FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Step } from "react-joyride";
import { Grid, Modal } from "semantic-ui-react";
import { getPlaygroundTourViewedStatus, persistPlaygroundTourViewedStatus } from "../../utils/try-it-utils";
 
/**
 * Prop types of the `LoginPlaygroundWizard` component.
 */ 
interface LoginPlaygroundWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * When the take tour is opened
     */ 
    onTakeTour: () => void;
}
  
/**
 * Login Playground application creation wizard.
 *
 * @return {JSX.Element}
 */
export const PlaygroundUserTour: FunctionComponent<LoginPlaygroundWizardPropsInterface> = (
    props: LoginPlaygroundWizardPropsInterface
): ReactElement => {
    const {
        onTakeTour,
        [ "data-componentid" ]: testId
    } = props;
    
    const [ open, setOpen ] = useState(getPlaygroundTourViewedStatus());

    useEffect(() => {
        if (getPlaygroundTourViewedStatus() === false) {
            setOpen(true);

            return;
        }

        setOpen(false);
    }, []);

    return (
        <Modal
            onClose={ () => setOpen(false) }
            onOpen={ () => setOpen(true) }
            open={ open }
            className="wizard login-playground-wizard"
            size="small"
            closeOnDimmerClick={ false }
            closeOnEscape = { true }
        >
            <Fragment>
                <Modal.Content className={ "modal-content" }>        
                    <Grid centered columns={ 1 } className="playground-wizard-grid" padded>
                        <Grid.Row  padded textAlign="center">
                            <Grid.Column stretched width={ "16" }>
                                <Heading
                                    bold
                                    as="h1" 
                                    textAlign="center" 
                                    content="Welcome to Asgardeo Try It !" 
                                />
                            </Grid.Column>  
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column className="context" stretched textAlign="center" width={ "16" } >
                                <Text>
                                    Using try it application, you can try out different login methods 
                                    in Asgardeo
                                </Text>
                                <Text>
                                    for your application. You can click Take a Tour or click Skip
                                </Text>
                                <Text>
                                    to go to the try it application.
                                </Text>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    data-testid={ `${ testId }-cancel-button` }
                                    floated="left"
                                    onClick={ () => {
                                        setOpen(false); 
                                        persistPlaygroundTourViewedStatus(false);
                                    } }
                                >
                                    Skip
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    data-testid={ `${ testId }-next-button` }
                                    floated="right"
                                    onClick={ () => {
                                        setOpen(false);
                                        onTakeTour();
                                    } }
                                >
                                    Take a Tour
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Fragment>
        </Modal>    
    );
};

/**
 * Steps for the Playground User tour.
 *
 * @type {Array<Step>}
 */
export const loginPlaygroundUserTourSteps: Array<Step> = [
    {
        content: (
            <div className="tour-step">
                <Heading bold as="h6">
                     User Attributes
                </Heading>
                <Text>
                     Update the User Attributes for your application
                </Text>
                <Text>
                     Click on the Next button to learn about the process
                </Text>
            </div>
        ),
        disableBeacon: true,
        placement: "bottom",
        target: "[data-tourid=\"attributes\"]"
    },
    {
        content: (
            <div className="tour-step">
                <Heading bold as="h6">
                     Sign-on Methods
                </Heading>
                <Text>
                     Select the sign-on method you wish to try out based on your application
                </Text>
                <Text>
                     Click on the Next button to learn about the process
                </Text>
            </div>
        ),
        disableBeacon: true,
        placement: "bottom",
        target: "[data-tourid=\"sign-in-methods\"]"
    },
    {
        content: (
            <div className="tour-step">
                <Heading bold as="h6">
                     Advanced
                </Heading>
                <Text>
                     Change the consent  of log in and log out of the application
                </Text>
                <Text>
                     Click on the Next button to learn about the process
                </Text>
            </div>
        ),
        disableBeacon: true,
        placement: "bottom",
        target: "[data-tourid=\"advanced\"]"
    },
    {
        content: (
            <div className="tour-step">
                <Heading bold as="h6">
                     Try Out Login Flow
                </Heading>
                <Text>
                     Click on Try Login button to try out the login flow at anytime
                </Text>
                <Text>
                     Click on the Done button to End the tour
                </Text>
            </div>
        ),
        disableBeacon: true,
        placement: "right",
        target: "[data-tourid=\"button\"]"
    }
];
