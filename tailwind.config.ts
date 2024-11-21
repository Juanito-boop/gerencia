import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function ({
			addUtilities,
		}: {
			addUtilities: (utilities: Record<string, any>) => void;
		}) {
			addUtilities({
				".border-gradient": {
					position: "relative",
					zIndex: "0",
				},
				".border-gradient::before": {
					content: '""',
					position: "absolute",
					top: "0",
					left: "0",
					right: "0",
					bottom: "0",
					zIndex: "-1",
					borderRadius: "inherit",
					padding: "2px",
					background: "linear-gradient(to right, #2c457e, #ea3433)",
					"-webkit-mask":
						"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					"-webkit-mask-composite": "destination-out",
					"mask-composite": "exclude",
				},
			});
		}),
	],
};
export default config;
