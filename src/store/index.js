import Vue from "vue";
import Vuex from "vuex";
import {remote} from "electron";
Vue.use( Vuex );
export default new Vuex.Store({
	state: {
		price: {
			BTC: {
				EUR: 0
			},
			ETH: {
				EUR: 0
			},
			LTC: {
				EUR: 0
			},
			DASH: {
				EUR: 0
			}
		},
		displayCurrency: "EUR",
		balances: [
			{ id: 0, code: "BTC", name: "Bitcoin", balance: 0.1571 },
			{ id: 1, code: "ETH", name: "Ethereum", balance: 0.041 },
			{ id: 2, code: "LTC", name: "Litecoin", balance: 0.7168 },
			{ id: 3, code: "DASH", name: "Dash", balance: 0.3345 }
		],
		accounts: {
			BTC: {
				name: "Bitcoin",
				code: "BTC",
				balance: 0.1571
			},
			ETH: {
				name: "Ethereum",
				code: "ETH",
				balance: 4.002568
			},
			LTC: {
				name: "Litecoin",
				code: "LTC",
				balance: 0.106828
			}
		},
		lastUpdate: new Date(),
		updateTime: 60,
		/*
			0 is nothing,
			1 is currently,
			2 is success,
			3 is fail
		*/
		updateStatus: 0,
		formOpen: false
	},
	getters: {
		balances: state => {
			return state.balances;
		},
		lastUpdate: state => {
			return state.lastUpdate;
		}
	},
	mutations: {
		setPrice( state, data ) {
			state.price = data;
			console.log("Updated price data:", data );
		},
		setLastUpdate( state, data ) {
			state.lastUpdate = data;
			console.log("Updated price at:", data );
		},
		setUpdateStatus( state, data ) {
			state.updateStatus = data;
		},
		setFormOpen( state, data ) {
			state.formOpen = data;
		},
		addEmptyBalance(state, data) {
			state.balances.push({});
		},
		removeBalance(state, i) {
			state.balances.splice( i, 1 );
		}
	},
	actions: {
		updatePrices(context, data) {
			context.commit("setPrice", data );
			context.commit("setLastUpdate", new Date() );
			context.commit("setUpdateStatus", 0 );
		},
		addBalance(context, data) {
			context.commit("addEmptyBalance");

			if ( context.state.balances.length > 3 ) {
				var win = remote.getCurrentWindow();
				win.setSize( window.innerWidth, window.innerHeight + 48, true );
			}
		},
		removeBalance(context, i) {
			context.commit("removeBalance", i );
			var win = remote.getCurrentWindow();
			let height = window.innerHeight;
			let newHeight;
			if ( height - 48 <= 230 ) {
				newHeight = 230;
			} else {
				newHeight = height - 48;
			}
			win.setSize( window.innerWidth, newHeight, true );
		}
	}
});
