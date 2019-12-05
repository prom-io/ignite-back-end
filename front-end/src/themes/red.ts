import {createMuiTheme} from "@material-ui/core";

export const red = createMuiTheme({
    "palette": {
        "common": {
            "black": "#000",
            "white": "#fff"
        },
        "background": {
            "paper": "#fff",
            "default": "#fafafa"
        },
        "primary": {
            "light": "rgb(218,124,105)",
            "main": "rgb(207,104,89)",
            "dark": "rgb(138,58,58)",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "rgba(94, 146, 243, 1)",
            "main": "rgba(21, 101, 192, 1)",
            "dark": "rgba(0, 60, 143, 1)",
            "contrastText": "#fff"
        },
        "error": {
            "light": "#e57373",
            "main": "#f44336",
            "dark": "#d32f2f",
            "contrastText": "#fff"
        },
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(0, 0, 0, 0.38)"
        }
    }
});
