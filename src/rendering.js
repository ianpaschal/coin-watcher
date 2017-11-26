import Vue from "vue";
import Vuex from "vuex";
import Frame from "./components/Frame.js";
import { ipcRenderer, remote } from "electron";
import STORE from "./store";

Vue.use( Vuex );

new Vue({
	el: "#vue-wrapper",
	store: STORE,
	render: h => h( Frame ),
	mounted() {
		update();
		this.$nextTick(function() {
			var win = remote.getCurrentWindow();
			console.log( document.body.offsetHeight );
			win.setSize( window.innerWidth, document.body.offsetHeight );
		});
	}
});

function update() {
	let coinList = [];
	for ( let balance of STORE.state.balances ) {
		coinList.push( balance.code );
	}
	ipcRenderer.send("get-prices", {
		list: coinList,
		fiat: "EUR"
	});
	STORE.commit("setUpdateStatus", 1 );
}

ipcRenderer.on("return-prices", function( event, data ) {
	STORE.dispatch("updatePrices", data );
	setTimeout( update, STORE.state.updateTime * 1000 );
});
