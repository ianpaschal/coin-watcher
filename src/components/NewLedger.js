import IconButton from "./IconButton.js";
import {remote} from "electron";
const { Menu, MenuItem } = remote;

export default {
	name: "NewLedger",
	components: {
		IconButton
	},
	template: `
		<div class="ledger-row new">

			<div class="ledger-value">
				<img ref="currencySelect" class="symbol" v-bind:src='icon' @click="selectCurrency()"/>
				<input
					ref="balanceInput"
					v-model="balance"
					placeholder="Enter balance..."
					class="currency crypto"
				>
			</div>

			<div class="conversions" v-if='currency'>
				<div class="divider">
					&times;
				</div>
				<div class="ledger-value">
					<p class="currency fiat">{{price}}</p>
				</div>
				<div class="divider">
					&equals;
				</div>
				<div class="ledger-value">
					<p class="currency fiat">{{value}}</p>
				</div>
			</div>

			<div class="controls">
				<IconButton class="cancel" icon="cancel" @clicked="cancel()"></IconButton>
				<IconButton class="confirm" icon="confirm" @clicked="confirm()"></IconButton>
			</div>

		</div>
	`,
	data() {
		return {
			balance: 0,
			currency: null
		};
	},
	mounted() {
		this.$refs.balanceInput.focus();
	},
	computed: {
		rate() {
			let display = this.$store.state.displayCurrency;
			if ( this.currency && this.currency !== "null") {
				return this.$store.state.price[ this.currency ][ display ];
			}
		},
		price() {
			let formatter = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: this.$store.state.displayCurrency,
				minimumFractionDigits: 2
			});
			return formatter.format( this.rate );
		},
		value() {
			let formatter = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: this.$store.state.displayCurrency,
				minimumFractionDigits: 2
			});
			return formatter.format( this.balance * this.rate );
		},
		icon() {
			return "../assets/icon/" + this.currency + ".png";
		}
	},
	methods: {
		selectCurrency() {
			const menu = new Menu();

			let self = this;

			menu.append( new MenuItem({ label: "Bitcoin", click() {
				console.log( "item 1 clicked" );
				self.currency = "BTC";
			} }) );
			menu.append( new MenuItem({ label: "Ethereum", click() {
				console.log( "item 2 clicked" );
				self.currency = "ETH";
			} }) );
			menu.append( new MenuItem({ label: "Litecoin", click() {
				console.log( "item 1 clicked" );
				self.currency = "LTC";
			} }) );
			menu.append( new MenuItem({ type: "separator" }) );

			menu.append( new MenuItem({ label: "Manage...", click() {
				console.log( "item 1 clicked" );
			} }) );


			menu.popup( remote.getCurrentWindow() );

		},
		confirm() {
			this.$store.dispatch("confirmNew", this );
		},
		cancel() {
			this.$store.dispatch("cancelNew");
		}
	}
};
