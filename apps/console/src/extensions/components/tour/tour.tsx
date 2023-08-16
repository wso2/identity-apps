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
import { LocalStorageUtils } from "@wso2is/core/utils";
import { GenericIcon, Heading, LinkButton, PrimaryButton, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import Tour, { ReactourStep } from "reactour";
import { AppConstants } from "../../../features/core/constants";
import { history } from "../../../features/core/helpers";
import {
    ReactComponent as AsgardioTourApplicationIllustration
} from "../../assets/illustrations/asgardio-tour-application-illustration.svg";
import {
    ReactComponent as AsgardioTourGetStartedIllustration
} from "../../assets/illustrations/asgardio-tour-get-started-illustration.svg";
import {
    ReactComponent as AsgardioTourWelcomeIllustration
} from "../../assets/illustrations/asgardio-tour-welcome-illustration.svg";
import {
    ReactComponent as AsgardioMiniLogo
} from "../../assets/mini-asgardio-logo.svg";

const MiniLogo = () => (
    <div style={ { left: "50%", position: "absolute" } }>
        <div style={ { left: "-50%", position: "relative" } }>
            <GenericIcon
                transparent
                style={ {
                    left: "-17px",
                    position: "absolute",
                    top: "-110px"
                } }
                size="mini"
                className="mini-logo"
                icon={ AsgardioMiniLogo }
            />
        </div>
    </div>
);

const steps: ReactourStep[] = [{
    content: () => {
        return (
            <>
                <MiniLogo/>
                <div>
                    <Heading as="h1">Hello!</Heading>
                    <GenericIcon
                        transparent
                        size="small"
                        icon={ AsgardioTourWelcomeIllustration }
                    />
                    <Text className="console-welcome-tour-step-description" muted>
                        Securing your applications and its users takes just a few minutes with Asgardeo. 
                        We&apos;ll handle the hassle of authentication & access management, 
                        so you can focus on your business.
                    </Text>
                </div>
            </>
        );
    },
    position: "center",
    selector: "[data-tut=\"tour-get-started-step\"]"
}];

/**
 * Proptypes for the tour page component.
 */
type TourPageInterface = TestableComponentInterface;

const WELCOME_TOUR_SHOWN_LOCALSTORAGE_KEY: string = "is_welcome_tour_shown";

/**
 * Console app tour page.
 *
 * @param {TourPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const TourPage: FunctionComponent<TourPageInterface> = (
    props: TourPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const [ isTourOpen, setIsTourOpen ] = useState<boolean>(true);
    const [ currentStep, setCurrentStep ] = useState<number>(undefined);
    const [ welcomeTourDoneState, setWelcomeTourDoneState ] = useState<boolean>(false);

    const getWelcomeTourState = () => {
        return JSON.parse(LocalStorageUtils.getValueFromLocalStorage(WELCOME_TOUR_SHOWN_LOCALSTORAGE_KEY)) || "";
    };

    useEffect(() => {

        if (getWelcomeTourState()) {
            history.push(AppConstants.getDeveloperViewHomePath());
        }
    }, [ welcomeTourDoneState ]);

    const skipTour = (): void => {

        setWelcomeTourDoneState(true);
        LocalStorageUtils.setValueInLocalStorage(WELCOME_TOUR_SHOWN_LOCALSTORAGE_KEY, "true");
    };

    const handleGetStartedFlow = (): void => {

        skipTour();
        history.push(AppConstants.getDeveloperViewHomePath());
    };

    return (
        <div className="background page-background" data-testid={ testId }>
            <Suspense fallback={ <></> }>
                <Tour
                    steps={ steps }
                    isOpen={ isTourOpen }
                    rounded={ 3 }
                    className="console-welcome-tour"
                    maskClassName="console-welcome-tour-wrapper"
                    showNumber={ false }
                    showCloseButton={ false }
                    showNavigationNumber={ false }
                    showNavigation={ false }
                    onRequestClose={ () => {
                            setIsTourOpen(false);
                            handleGetStartedFlow();
                        }
                    }
                    closeWithMask = { false }
                    nextButton={
                        <PrimaryButton className="m-0">Next</PrimaryButton>
                    }
                    lastStepNextButton={
                        <PrimaryButton onClick={ handleGetStartedFlow } className="m-0">Get Started</PrimaryButton>
                    }
                    prevButton={ <></> }
                    getCurrentStep={ (step: number) => setCurrentStep(step) }
                />
            </Suspense>
        </div>
    );
};

/**
 * Default props for the component.
 */
TourPage.defaultProps = {
    "data-testid": "tour-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TourPage;
