import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

import landing from './landing';
import join from './join';

// const theme = createMuiTheme({
//     typography: {
//         fontFamily: [
//             "Oxygen"
//         ].join(','),
//     },
// });

export default function App() {

    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Router>
                    <div className="App">
                        <Route exact path="/" component={landing} />
                        <div className="container">
                            <Route exact path="/:id/:name" component={join} />
                            <Route exact path="/:id" component={landing} />
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </div>
    )
}



// class App extends Component {

//     render() {
//         return (

//             <Router>
//                 <div className="App">
//                     <Route exact path="/" component={landing} />
//                     <div className="container">
//                         <Route exact path="/:id" component={join} />
//                     </div>
//                 </div>
//             </Router>

//         );
//     }
// }

// export default App;