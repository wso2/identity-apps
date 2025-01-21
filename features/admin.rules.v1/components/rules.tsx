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

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import RuleConditions from "./rule-conditions";
import { useRulesContext } from "../hooks/use-rules-context";
import { ListDataInterface } from "../models/meta";
import { RuleInterface } from "../models/rules";
import "./rules.scss";

/**
 * Props interface of {@link RulesComponent}
 */
export interface RulesPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is multiple rules flag.
     */
    isMultipleRules: boolean;
}

/**
 * Rules execution component to render.
 *
 * @param props - Props injected to the component.
 * @returns Rule component.
 */
const RuleExecutionComponent: FunctionComponent<RulesPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-render-component",
    isMultipleRules = false
}: RulesPropsInterface): ReactElement => {

    const {
        ruleExecuteCollection,
        ruleExecutionsMeta,
        addNewRule,
        clearRule,
        removeRule,
        updateRulesFallbackExecution,
        updateRuleExecution
    } = useRulesContext();

    const { t } = useTranslation();

    return (
        <div className="rules-component" data-componentid={ componentId }>
            { isMultipleRules && (
                <Box sx={ { mb: 2 } }>
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={ addNewRule }
                        startIcon={ <AddIcon /> }
                    >
                        { t("rules:buttons.newRule") }
                    </Button>
                </Box>
            ) }
            { ruleExecuteCollection?.rules?.map(
                (rule: RuleInterface, index: number) => (
                    <Card
                        sx={ {
                            mb: 2,
                            position: "relative"
                        } }
                        key={ index }
                    >
                        <Grid container alignItems="center" sx={ { mb: 2 } }>
                            <Grid>
                                <Typography variant="body2">{ t("rules:texts.execute") }</Typography>
                            </Grid>
                            { ruleExecutionsMeta?.executions ? (
                                <Grid>
                                    <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
                                        <Select
                                            value={ rule.execution }
                                            onChange={ (event: SelectChangeEvent) =>
                                                updateRuleExecution(event, rule.id)
                                            }
                                        >
                                            { ruleExecutionsMeta?.executions?.map((item: any, index: number) => (
                                                <MenuItem
                                                    value={ item.name }
                                                    key={ `${rule.id}-${index}` }
                                                >
                                                    { item.displayName }
                                                </MenuItem>
                                            )) }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ) : (
                                <Grid>
                                    <FormControl sx={ { mb: 1, minWidth: 0, mt: 1 } } size="small">
                                        &nbsp;
                                    </FormControl>
                                </Grid>
                            ) }
                            <Grid>
                                <Typography variant="body2">{ t("rules:texts.if") }</Typography>
                            </Grid>
                        </Grid>
                        <RuleConditions rule={ rule } />
                        { ruleExecuteCollection?.rules?.length > 1 && (
                            <Fab
                                color="error"
                                aria-label="delete"
                                size="small"
                                className="delete-button"
                                sx={ {
                                    position: "absolute",
                                    right: 14,
                                    top: 14
                                } }
                                onClick={ () => removeRule(rule.id) }
                            >
                                <DeleteIcon className="delete-button-icon" />
                            </Fab>
                        ) }
                        { !isMultipleRules && (
                            <Button
                                aria-label="Clear rule"
                                variant="outlined"
                                size="small"
                                className="clear-button"
                                sx={ {
                                    position: "absolute",
                                    right: 14,
                                    top: 14
                                } }
                                onClick={ () => clearRule(rule.id) }
                            >
                                { t("rules:buttons.clearRule") }
                            </Button>
                        ) }
                    </Card>
                )
            ) }
            { isMultipleRules && (
                <Card
                    sx={ {
                        mb: 2,
                        position: "relative"
                    } }
                >
                    <Grid container alignItems="center">
                        <Grid>
                            <Typography variant="body2">Else Execute</Typography>
                        </Grid>
                        <Grid>
                            <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
                                <Select
                                    value={ ruleExecuteCollection?.fallbackExecution }
                                    onChange={ (event: SelectChangeEvent) => updateRulesFallbackExecution(event) }
                                >
                                    { ruleExecutionsMeta?.fallbackExecutions?.map(
                                        (item: ListDataInterface, index: number) => (
                                            <MenuItem value={ item.name } key={ `${index}` }>
                                                { item.displayName }
                                            </MenuItem>
                                        )
                                    ) }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            ) }
        </div>
    );
};

export default RuleExecutionComponent;
