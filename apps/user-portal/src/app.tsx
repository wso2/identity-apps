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

// import { DefaultTheme, Logo, Theme, } from "@wso2is/theme";
import * as React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import history from "./actions/history";
import { AuthConsumer, AuthProvider } from "./components/auth-context";
import ProtectedRoute from "./components/protected-route";
import {
    AppListingPage,
    LoginPage,
    PageNotFound,
    ThemeBuilderPage,
    UserListingPage
} from "./pages";

const LogoutPage = () => {
    // TODO: Need to handle logout using path
    React.useEffect(() => {
        // this.props.logout();
        // console.log(this);
        // this.context.store.dispatch(logout());
    });

    return (
        <AuthConsumer>
            {({ logout }) => (
                <Route
                    render={() =>
                        <Redirect to={{
                            logout: { logout },
                            pathname: "/login"
                        }} />
                    }
                />
            )}
        </AuthConsumer>
    );
};

class App extends React.Component {
    public render() {
        return (
            <Router history={history}>
                <div className="container-fluid">
                    <AuthProvider history={history}>
                        <Switch>
                            <Redirect exact path="/" to="/login" />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/logout" component={LogoutPage} />
                            <ProtectedRoute path="/app-listing" component={AppListingPage} />
                            <ProtectedRoute path="/user-listing" component={UserListingPage} />
                            <ProtectedRoute path="/theme" component={ThemeBuilderPage} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </AuthProvider>
                </div>
            </Router>
        );
    }
}

export default App;
