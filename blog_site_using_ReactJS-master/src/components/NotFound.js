import React from "react";
import {Link} from "react-router-dom";

const NotFound = () => {
    return ( 
        <div className="NotFound">
            <h2>Sorry</h2>
            <p>That Page Cannot Be Found.</p>
            <Link to= '/'>Back To Home</Link>
        </div>
     );
}
 
export default NotFound;