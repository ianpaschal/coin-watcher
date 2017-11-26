import { ipcRenderer } from "electron";
import Ledger from "./Ledger.js";
import DateDisplay from "./Date.js";
import IconButton from "./IconButton.js";
import NewLedger from "./NewLedger.js";
export default {
	name: "Frame",
	components: {
		Ledger,
		DateDisplay,
		IconButton,
		NewLedger
	},
	template: `
		<div id="app">
			<div id="frame-top">
				<h1>My Portfolio</h1>
			</div>
			<div v-if="balances.length" class="frame-middle">
				<Ledger
					v-for='(balance, index) in balances'
					v-bind:key='balance.id'
					v-bind:data='balance'
					@deleted='blurp(index)'
				></Ledger>
			</div>
			<div v-else class="frame-middle empty">
				<h1>Add some cryptos!</h1>
			</div>
			<div id="frame-bottom">
				<IconButton class="add" icon="add" @clicked="addCurrency()"></IconButton>
				<transition name="price-refresh">
					<p v-if="refreshing">Fetching new data...</p>
					<p v-else>Updated {{lastUpdate}} seconds ago.</p>
				</transition>
				<IconButton icon="settings" @clicked="openSettings()"></IconButton>
			</div>
		</div>
	`,
	data: function() {
		return {
			now: new Date()
		};
	},
	computed: {
		balances() {
			return this.$store.getters.balances;
		},
		lastUpdate() {
			let seconds = Math.floor( ( this.now - this.$store.getters.lastUpdate ) / 1000 );
			return seconds >= 0 ? seconds : 0;
		},
		refreshing() {
			if ( this.$store.state.updateStatus === 1 ) {
				return true;
			}
			return false;
		},
		formOpen() {
			return this.$store.state.formOpen;
		}
	},
	mounted() {
		var self = this;
		setInterval(function() {
			self.$data.now = Date.now();
		}, 1000 );
	},
	methods: {
		openSettings() {
			ipcRenderer.send("open-settings");
			return;
		},
		addCurrency() {
			this.$store.dispatch("addBalance");
		},
		blurp(i) {
			console.log( i );
			this.$store.dispatch("removeBalance", i );
		}
	}
};
