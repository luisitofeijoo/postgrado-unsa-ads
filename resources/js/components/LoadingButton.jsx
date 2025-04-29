import React from "react";
export default function LoadingButton ({ isLoading, text, loadingText, ...rest }) {
    return (<>
        <button {...rest}>
            {isLoading ? loadingText : text}
        </button>
    </>);
}
