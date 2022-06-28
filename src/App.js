import React, {Component} from "react";
import './App.css'
import {Switch, Route} from "react-router-dom";
import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import Project from "./pages/Project/project";
import Student from "./pages/Student/student.jsx";
import Team from "./pages/Team/team";
import AddInstructor from "./pages/AddInstructor/addInstructor";
import AddCoordinator from "./pages/AddCoordinator/addCoordinator";
import Subject from "./pages/Subject/subject";
import NotFound from "./pages/NotFound/notFound";
import ResetPassword from "./pages/Login/resetPassword";
import Rubric from "./pages/Rubric/rubric";
import RubricItem from "./pages/Rubric/rubricItem";
import SelectSubject from "./pages/SelectSubject/selectSubject";

class App extends Component {
    render() {
        return (
            <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/project" component={Project}/>
                <Route path="/student" component={Student}/>
                <Route path="/team" component={Team}/>
                <Route path="/rubric" component={Rubric}/>
                <Route path="/rubricItem" component={RubricItem}/>
                <Route path="/addInstructor" component={AddInstructor}/>
                <Route path="/addCoordinator" component={AddCoordinator}/>
                <Route path="/subject" component={Subject} />
                <Route path="/selectSubject" component={SelectSubject}/>
                <Route path="/resetPassword" component={ResetPassword}/>
                <Route path="/notFound" component={NotFound}/>
                <Route exact={true} path='/' component={Login}/>
                <Route path='/' component={NotFound}/>
            </Switch>
        );
    }
}

export default App;

