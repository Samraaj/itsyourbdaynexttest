import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

const lightThemeJSON = {
	palette: {
		common: { black: "#000", white: "#fff" },
		background: { paper: "#fff", default: "rgba(255, 230, 229, 1)" },
		primary: {
			light: "rgba(131, 119, 187, 1)",
			main: "rgba(97, 84, 166, 1)",
			dark: "rgba(88, 75, 149, 1)",
			contrastText: "rgba(255, 230, 229, 1)",
		},
		secondary: {
			light: "#20a9fe",
			main: "#05b2dc",
			dark: "#0491b4",
			contrastText: "rgba(255, 230, 229, 1)",
		},
		error: {
			light: "rgba(242, 139, 125, 1)",
			main: "rgba(238, 99, 82, 1)",
			dark: "rgba(235, 72, 51, 1)",
			contrastText: "#fff",
		},
		text: {
			primary: "#6154A6",
			secondary: "rgba(0, 0, 0, 0.54)",
			disabled: "rgba(0, 0, 0, 0.38)",
			hint: "rgba(0, 0, 0, 0.38)",
		},
	},
	typography: {
		fontFamily: [
			'"Signika"',
			'"IBM Plex Serif"',
			"Roboto",
			"Helvetica",
			"Arial",
			"sans-serif",
		].join(","),
	},
};

const theme = createMuiTheme(lightThemeJSON);

export default theme;
