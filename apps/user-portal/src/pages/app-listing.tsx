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

import * as React from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
} from "semantic-ui-react";
import { LogoComponent } from "../components";

export const AppListingPage = () => (
    <>
        <Menu fixed='top' inverted>
        <Container>
            <Menu.Item as='a' header>
            {/* <LogoComponent size='mini' style={{ marginRight: '1.5em' }} /> */}
            Project Name
            </Menu.Item>
            <Menu.Item as='a'>Home</Menu.Item>
            <Menu.Item><Link to="/">Navigate to Login</Link></Menu.Item>

            <Dropdown item simple text='Dropdown'>
            <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                <i className='dropdown icon' />
                <span className='text'>Submenu</span>
                <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </Container>
        </Menu>

        <Container text style={{ marginTop: '7em' }}>
        <Header as='h1'>Semantic UI React Fixed Template</Header>
        <p>This is a basic fixed menu template using fixed size containers.</p>
        <p>
            A text container is used for the main container, which is useful for single column layouts.
        </p>

        <Image src='/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        <Image src='/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        </Container>

        <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
        <Container textAlign='center'>
            <Grid divided inverted stackable>
            <Grid.Column width={3}>
                <Header inverted as='h4' content='Group 1' />
                <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
                </List>
            </Grid.Column>
            <Grid.Column width={3}>
                <Header inverted as='h4' content='Group 2' />
                <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
                </List>
            </Grid.Column>
            <Grid.Column width={3}>
                <Header inverted as='h4' content='Group 3' />
                <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
                </List>
            </Grid.Column>
            <Grid.Column width={7}>
                <Header inverted as='h4' content='Footer Header' />
                <p>
                Extra space for a call to action inside the footer that could help re-engage users.
                </p>
            </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size='mini' src='/logo.png' />
            <List horizontal inverted divided link size='small'>
            <List.Item as='a' href='#'>
                Site Map
            </List.Item>
            <List.Item as='a' href='#'>
                Contact Us
            </List.Item>
            <List.Item as='a' href='#'>
                Terms and Conditions
            </List.Item>
            <List.Item as='a' href='#'>
                Privacy Policy
            </List.Item>
            </List>
        </Container>
        </Segment>
    </>
);
