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

import React, { Component, useState  } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Header, Input, Search, Segment, Select } from "semantic-ui-react";
// @ts-ignore
import { InnerPageLayout } from "../layouts";

const initialState = { isLoading: false, results: [], value: "" };

// const source = _.times(5, () => ({
//     title: faker.company.companyName(),
//     description: faker.company.catchPhrase(),
//     image: faker.internet.avatar(),
//     price: faker.finance.amount(0, 100, 2, '$'),
// }))

export default class UsersSearch extends Component {
    public state = initialState;

    public handleResultSelect = (e, { result }) => this.setState({ value: result.title });

    public handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) { return this.setState(initialState); }

            // const re = new RegExp(_.escapeRegExp(this.state.value), "i")
            // const isMatch = (result) => re.test(result.title)

            this.setState({
                isLoading: false,
                // results: _.filter(source, isMatch),
            });
        }, 300);
    }

    public render() {
        const { isLoading, value, results } = this.state;
        const options = [
            { key: "all", text: "All", value: "all" },
            { key: "Search by", text: "Search by", value: "Search by" },
            { key: "username", text: "username", value: "username" },
        ];

        return (
        <Input type="text" placeholder="Search..." action style={{ width: "870px"}} >
            <input />
            <Select compact options={ options } defaultValue="Search by"/>
            <Button type="submit">Search</Button>
        </Input>
        );
    }
}
