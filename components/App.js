import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase/app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Login from "./Login";
import PeopleList from "./PeopleList";
import Loader from "./Loader";
import reducers from "../reducers/PeopleReducer";
import AddPerson from "./AddPerson";
import CompanyList from "./CompanyList";
import Thunk from "redux-thunk";
import {
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer,
    createDrawerNavigator,
    DrawerItems
} from "react-navigation";

class Home extends Component {
    state = { loggedIn: null };
    componentDidMount() {
        firebase.initializeApp({
            apiKey: "AIzaSyApKjWDoscX6WTxHFeOOdCtkeAw3HyzHJ8",
            authDomain: "crmlinkedin-83fd8.firebaseapp.com",
            databaseURL: "https://crmlinkedin-83fd8.firebaseio.com",
            projectId: "crmlinkedin-83fd8",
            storageBucket: "crmlinkedin-83fd8.appspot.com",
            messagingSenderId: "588407623052"
        });

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ loggedIn: true });
                console.log(40, this.state);
            } else {
                this.setState({ loggedIn: false });
                console.log(43, this.state);
            }
        });
    }

    renderInitialView() {
        console.log("59", this.state.loggedIn);
        switch (this.state.loggedIn) {
            case true:
                return this.props.navigation.navigate("Drawer");
            case false:
                return this.props.navigation.navigate("Login");
            default:
                return <Loader size="large" />;
        }
    }

    render() {
        return <View style={styles.container}>{this.renderInitialView()}</View>;
    }
}

const BottomTabNavigator = createBottomTabNavigator(
    {
        PeopleList: { screen: PeopleList },
        AddPerson: { screen: AddPerson },
        CompanyList: { screen: CompanyList }
    },
    {
        tabBarOptions: {
            activeTintColor: "white",
            inactiveTintColor: "#80cbc4",
            swipeEnabled: true,
            showLabel: false,
            style: {
                backgroundColor: "#26a69a"
            }
        }
    }
);

const DrawerNavigator = createDrawerNavigator(
    {
        BottomTabNavigator: {
            screen: BottomTabNavigator,
            navigationOptions: {
                drawerLabel: () => null
            }
        }
    },
    {
        contentComponent: props => (
            <View style={{ flex: 1 }}>
                <View forceInset={{ top: "always", horizontal: "never" }}>
                    <DrawerItems {...props} />
                    <Button
                        title="Logout"
                        onPress={() => {
                            try {
                                firebase.auth().signOut();
                            } catch (error) {
                                alert("Something's not right: " + error);
                            }
                        }}
                    />
                </View>
            </View>
        )
    }
);

const AppNavigator = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        Drawer: {
            screen: DrawerNavigator
        },
        Login: {
            screen: Login
        }
    },
    {
        defaultNavigationOptions: {
            header: null,
            headerMode: "none",
            mode: "modal"
        },
        initialRouteName: "Home"
    }
);

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    }
});

const store = createStore(reducers, applyMiddleware(Thunk));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}
