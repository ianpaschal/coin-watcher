import IconButton from "./IconButton.js";
import { remote } from "electron";
const { Menu, MenuItem } = remote;

export default {
	name: "Ledger",
	components: {
		IconButton
	},
	template: `
		<div class="ledger-row">


			<div class="ledger-value">
				<img ref="currencySelect" class="symbol" v-bind:src='icon' @click="selectCurrency()"/>
				<input
					ref="balanceInput"
					v-model="balance"
					placeholder="0"
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
				<IconButton
					class="cancel"
					icon="cancel"
					@clicked='$emit("deleted")'
				></IconButton>
			</div>

		</div>
	`,
	props: [ "data" ],
	data() {
		return {
			currency: this.data.code,
			balance: this.data.balance || 0
		};
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
			let icon;
			if ( this.currency ) {
				icon = this.currency;
			} else {
				icon = "select";
			}
			return "../assets/icon/" + icon + ".png";
		}
	},
	methods: {
		selectCurrency() {
			const menu = new Menu();

			let self = this;

			for ( let code in this.$store.state.price ) {
				console.log( code );
				menu.append( new MenuItem({ label: code, click() {
					console.log( "item 1 clicked" );
					self.currency = code;
				} }) );
			}
			menu.append( new MenuItem({ type: "separator" }) );

			menu.append( new MenuItem({ label: "Manage...", click() {
				console.log( "item 1 clicked" );
			} }) );


			menu.popup( remote.getCurrentWindow() );

		},
		fuck() {
			console.log("trying to emit sum poop");
			// this.$emit("deleteBalance");
		}
	}
};
