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
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@oxygen-ui/react/Typography";
import { SelectChangeEvent } from '@mui/material';
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { RuleInterface } from "../models/rules";
import { useRulesContext } from "../providers/rules-provider";
import RuleConditions from "./rule-conditions";
import "./rules.scss";

/**
 * Props interface of {@link RulesComponent}
 */
export interface RulesPropsInterface extends IdentifiableComponentInterface {
    /**
     * Multiple rules flag.
     * 
     * @default false
     * @memberof RulesPropsInterface
     */
    multipleRules: boolean;
}

/**
 * Rules component to render.
 *
 * @param props - Props injected to the component.
 * @returns Rule component.
 */
const Rules: FunctionComponent<RulesPropsInterface> = ({
    // Set the component id.
    ["data-componentid"]: componentId = "rules-render-component",

    // Multiple rules flag.
    multipleRules = false
}: RulesPropsInterface): ReactElement => {
    const { rulesInstance, conditionsMeta, addNewRule, removeRule, updateRuleExecution } = useRulesContext();

    return (
        <div className="rules-component" data-componentid={ componentId }>
            { multipleRules &&
                <Box sx={{ mb: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={ addNewRule }
                        startIcon={<AddIcon />}
                    >
                        New Rule
                    </Button>
                </Box>
            }
            { rulesInstance?.map((ruleInstance: RuleInterface) => (
                <Card
                    sx={{
                        mb: 2,
                        position: "relative"
                    } }
                    key={ index }
                >
                    <Grid container alignItems="center">
                        <Grid>
                            <Typography variant="body1"><Typography variant="body2">Execute</Typography></Typography>
                        </Grid>
                        { ruleInstance.execution ? (
                            <Grid>
                                <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
                                    <Select
                                        value={ ruleInstance.execution }
                                        onChange={ (e: SelectChangeEvent) => updateRuleExecution(e, ruleInstance.id) }
                                    >
                                        { conditionsMeta?.map((item: any, index: number) => (
                                            <MenuItem value={ item.value } key={ `${ruleInstance.id}-${index}` }>
                                                { item.displayName }
                                            </MenuItem>
                                        )) }
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : (
                            <Grid>&nbsp;</Grid>
                        ) }
                        <Grid>
                            <Typography variant="body2">If</Typography>
                        </Grid>
                    </Grid>
                    <RuleConditions
                        data-componentid={ componentId }
                        ruleId={ ruleInstance.id }
                        conditions={ ruleInstance.conditions }
                        conditionRemovable={ ruleInstance.conditions?.length > 1 }
                    /> 
                    { rulesInstance?.length > 1 && 
                        <Fab
                            color="error"
                            aria-label="delete"
                            size="small"
                            className="delete-button"
                            sx={{
                                position: 'absolute',
                                top: 14,
                                right: 14,
                            }}
                            onClick={ () => removeRule(ruleInstance.id) }
                        >
                            <DeleteIcon className="delete-button-icon" />
                        </Fab>
                    }
                </Card>
            )) }
        </div>
    )
};

export default Rules;
