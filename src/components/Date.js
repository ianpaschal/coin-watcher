export default {
	name: "Date",
	template: `
		<p>{{dateString}}</p>
	`,
	data() {
		return {};
	},
	computed: {
		dateString() {
			return this.$store.state.lastUpdate.toString();
		}
	}
};
