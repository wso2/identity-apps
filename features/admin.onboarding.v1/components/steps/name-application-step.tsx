/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo } from "react";
import { OnboardingComponentIds } from "../../constants";
import { useNameValidation } from "../../hooks/use-onboarding-validation";
import { generateRandomNames } from "../../utils/random-name-generator";
import Hint from "../shared/hint";
import { LeftColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import SelectableChip from "../shared/selectable-chip";
import StepHeader from "../shared/step-header";

const RANDOM_NAME_COUNT: number = 5;

/**
 * Props interface for NameApplicationStep component.
 */
interface NameApplicationStepProps extends IdentifiableComponentInterface {
    applicationName: string;
    onApplicationNameChange: (name: string) => void;
}

/**
 * Name application step component for onboarding.
 */
const NameApplicationStep: FunctionComponent<NameApplicationStepProps> = (
    props: NameApplicationStepProps
): ReactElement => {
    const {
        applicationName,
        onApplicationNameChange,
        ["data-componentid"]: componentId = OnboardingComponentIds.NAME_APP_STEP
    } = props;

    const { validateName, getValidationError } = useNameValidation();

    // Generate random names once on mount
    const randomNames: string[] = useMemo(() => generateRandomNames(RANDOM_NAME_COUNT), []);

    // Set first random name as default if no name is set
    useEffect(() => {
        if (!applicationName && randomNames.length > 0) {
            onApplicationNameChange(randomNames[0]);
        }
    }, [ applicationName, onApplicationNameChange, randomNames ]);

    const handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onApplicationNameChange(event.target.value);
        },
        [ onApplicationNameChange ]
    );

    const validationError: string | null = getValidationError(applicationName);
    const hasError: boolean = applicationName.length > 0 && !validateName(applicationName);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle="This is used only inside Asgardeo. You can rename it any time."
                    title="Name your application"
                />

                <Box sx={ { display: "flex", flexDirection: "column", gap: 3, maxWidth: 400 } }>
                    <TextField
                        fullWidth
                        label="Application name"
                        placeholder="My Application"
                        value={ applicationName }
                        onChange={ handleNameChange }
                        helperText={ hasError ?? validationError }
                        error={ hasError }
                        data-componentid={ `${componentId}-input` }
                    />

                    <Hint message="In a hurry? Pick a random name">
                        { randomNames.map((name: string) => (
                            <SelectableChip
                                key={ name }
                                isSelected={ applicationName === name }
                                label={ name }
                                onClick={ () => onApplicationNameChange(name) }
                            />
                        )) }
                    </Hint>
                </Box>
            </LeftColumn>
        </TwoColumnLayout>
    );
};

export default NameApplicationStep;
