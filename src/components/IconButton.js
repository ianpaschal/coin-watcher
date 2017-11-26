import { ipcRenderer } from "electron";
export default {
	name: "IconButton",
	template: `
		<svg class="icon-button" viewBox="0 0 32 32" @click="clicked">
			<use v-bind:xlink:href="path"></use>
		</svg>
	`,
	props: [ "icon" ],
	data: function() {
		return {};
	},
	computed: {
		path() {
			return "../assets/image/ui-icons.svg#" + this.icon;
		}
	},
	methods: {
		openSettings() {
			ipcRenderer.send("open-settings");
			return;
		},
		clicked() {
			this.$emit("clicked");
		}
	}
};
