/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useRef } from "react";
import { OnboardingComponentIds } from "../../constants";
import { useNameValidation } from "../../hooks/use-onboarding-validation";
import Hint from "../shared/hint";
import { LeftColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import SelectableChip from "../shared/selectable-chip";
import StepHeader from "../shared/step-header";

/**
 * Props interface for NameApplicationStep component.
 */
interface NameApplicationStepPropsInterface extends IdentifiableComponentInterface {
    /** Current application name */
    applicationName: string;
    /** Callback when application name changes */
    onApplicationNameChange: (name: string) => void;
    /** Random name suggestions */
    randomNames: string[];
}

/**
 * Name application step component for onboarding.
 */
const NameApplicationStep: FunctionComponent<NameApplicationStepPropsInterface> = (
    props: NameApplicationStepPropsInterface
): ReactElement => {
    const {
        applicationName,
        onApplicationNameChange,
        randomNames,
        ["data-componentid"]: componentId = OnboardingComponentIds.NAME_APP_STEP
    } = props;

    const { validateName, getValidationError } = useNameValidation();
    const inputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const hasInitializedName: React.MutableRefObject<boolean> = useRef<boolean>(false);

    // Auto-focus input field when step loads
    useEffect(() => {
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Set first random name as default if no name is set (only on initial mount)
    useEffect(() => {
        if (!hasInitializedName.current && !applicationName && randomNames.length > 0) {
            hasInitializedName.current = true;
            onApplicationNameChange(randomNames[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

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
                    subtitle="This is used only inside the console. You can rename it any time."
                    title="Name your application"
                />

                <Box sx={ { display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 } }>
                    <TextField
                        data-componentid={ `${componentId}-input` }
                        error={ hasError }
                        fullWidth
                        helperText={ hasError ? validationError : undefined }
                        inputRef={ inputRef }
                        label="Application name"
                        onChange={ handleNameChange }
                        placeholder="My Application"
                        value={ applicationName }
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
