import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Main from '../page/main';
import Map from '../page/map';
import Search from '../page/searsh';

export default function base() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => <Main />}  />
                <Route exact path="/map" render={(props) => <Map {...props} />}  />

                <Route path="/search" render={() => <Search />}  />

                {/* url not found */}
                <Route render={() => <Main />} />
            </Switch>
        </Router>
    );
}