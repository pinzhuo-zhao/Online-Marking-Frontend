import React, {Component} from 'react';
import {Result} from "antd";

class NotFound extends Component {
    render() {
        return (
            <Result
                status="403"
                title="Something Went Wrong"
                subTitle="
                Sorry, you are not authorized to access this page or the URL have some problem.
                Please don't use URL to switch to other pages.
                "
            />
        );
    }
}

export default NotFound;