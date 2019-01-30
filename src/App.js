import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';

// import Zhuye from './webLink/zhuye';
// import Inbox from './webLink/inbox';
// import About from './webLink/about';
// import Liuliang from './webLink/liuliang';
// import login from './webLink/login';
// import AdverList from './webLink/adverList';
import 'antd/dist/antd.css';

function asyncComponent(importComponent) {
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        async componentDidMount() {
            const { default: component } = await importComponent();

            this.setState({
                component: component
            });
        }

        render() {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    }
    return AsyncComponent;
}

const login=asyncComponent(()=>import('./webLink/login'));
const AdverList=asyncComponent(()=>import('./webLink/adverList'));
const Inbox=asyncComponent(()=>import('./webLink/inbox'));
const About=asyncComponent(()=>import('./webLink/about'));
const Liuliang=asyncComponent(()=>import('./webLink/liuliang'));
const Zhuye=asyncComponent(()=>import('./webLink/zhuye'));

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={login}/>
                    <Zhuye>
                        <Route exact path="/sub1/key1" component={AdverList} />
                        <Route exact path="/sub1/key1/liuliang" component={Liuliang} />
                        <Route path="/key4" component={About} />
                        <Route path="/key5" component={Inbox} />
                    </Zhuye>
                </Switch>
            </Router>
        )
    }
}
export default App;





