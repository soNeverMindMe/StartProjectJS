"use strict";
const title = document.getElementsByTagName("h1")[0];
const buttonStart = document.getElementsByClassName("handler_btn")[0];
const buttonReset = document.getElementsByClassName("handler_btn")[1];
const buttonPlus = document.querySelector(".screen-btn");

const otherItems1 = document.querySelectorAll(".other-items.percent");
const otherItems2 = document.querySelectorAll(".other-items.number");
const customCheckbox = document.querySelectorAll(".custom-checkbox");

const cmsOpen = document.getElementById("cms-open");
const cmsSelect = document.getElementById("cms-select");
const cmsDivInput = document.querySelector(".hidden-cms-variants > .main-controls__input");
const cmsInput = document.getElementById("cms-other-input");
const cmsDivOpen = document.querySelector(".hidden-cms-variants");

const rollbackInput = document.querySelector('.rollback [type="range"]');
const inputRangeValue = document.querySelector('.rollback .range-value');

const total = document.getElementsByClassName("total-input")[0];
const totalCount = document.getElementsByClassName("total-input")[1];
const totalCountOther = document.getElementsByClassName("total-input")[2];
const totalFullCount = document.getElementsByClassName("total-input")[3];
const totalCountRollback = document.getElementsByClassName("total-input")[4];

let screenDiv = document.querySelectorAll(".screen");

let appData = {
	 screensCount: 0,
	 screens: [], 
	 screenPrice: 0,
	 fullPrice: 0,
	 serviceWorkPercent: 0,
	 agentWorkPrice: 0,
	 serviceNumberPrice: 0,
	 servicePercentPrice: 0,
	 rollback: 0,
	 servicesPercent: {},
	 servicesNumber: {},

	 bindAll: function () {
		for (let key in appData) {
			if (typeof appData[key] == "function") {
				appData[key] = appData[key].bind(appData);
			}
		}
	 },

	init: function() {
		this.bindAll();
		this.addTitle();
		setInterval(() => this.success(), 10);

		buttonPlus.addEventListener("click", this.addScreenBlock);
		buttonStart.addEventListener("click", this.start);
		buttonReset.addEventListener("click", this.reset);

		rollbackInput.addEventListener("input", () => {
			inputRangeValue.textContent = rollbackInput.value + "%";
			this.rollback = rollbackInput.value;
		});

		cmsOpen.addEventListener("click", () => {
			if (cmsOpen.checked) {
				cmsDivOpen.style.display = "flex";
			} else {
				cmsDivOpen.style.display = "none";
			}
		});

		cmsSelect.addEventListener("change", () => {
			if (cmsSelect.options[2].selected) {
				cmsDivInput.style.display = "flex";
			} else {
				cmsDivInput.style.display = "none";
			}
		});
	},

	success: function() {
		screenDiv = document.querySelectorAll(".screen");
			for(let i = 0; i < screenDiv.length; i++) {
				if (screenDiv[i].querySelector("select").selectedIndex === 0 || screenDiv[i].querySelector("input").value === "") {
					buttonStart.disabled = true;
					break;
				} else { 	
					buttonStart.disabled = false;
				}
			}
	},

	start: function() {
		buttonStart.style.display = "none";
		buttonReset.style.display = "block";
		this.addScreenPrice();
		this.addServicesPercent();
		this.addServicesNumber();
		this.addPrices();
		this.showResult();
		this.allDisabled();
	},

	clear: function () {
		this.screens = [], 
		this.screensCount = 0,
		this.screenPrice = 0,
		this.fullPrice = 0,
		this.serviceWorkPercent = 0,
		this.agentWorkPrice = 0,
		this.serviceNumberPrice = 0,
		this.servicePercentPrice = 0,
		this.servicesPercent = {},
		this.servicesNumber = {}
	},

	showResult: function() {
		total.value = this.screenPrice;
		totalCount.value = this.screensCount;
		totalCountOther.value = this.serviceNumberPrice + this.servicePercentPrice;
		totalFullCount.value = Math.ceil(this.fullPrice);
		totalCountRollback.value = Math.ceil(this.serviceWorkPercent);
	},

	reset: function() {
		this.clear(); //
		screenDiv = document.querySelectorAll(".screen");
		for (let i = 1; i < screenDiv.length; i++) {
			screenDiv[i].remove();
		}
		screenDiv[0].querySelector("input").value = "";
		screenDiv[0].querySelector("input").placeholder = "Количество экранов";
		screenDiv[0].querySelector("select").options[0].selected = true;
		buttonStart.style.display = "block";
		buttonReset.style.display = "none";
		this.allDisabled(); //
		this.showResult(); //
		customCheckbox.forEach((elem) => {
			elem.checked = false;
		});
		cmsDivOpen.style.display = "none";
		rollbackInput.value = 0;
		inputRangeValue.textContent = rollbackInput.value + "%";
		cmsSelect.options[0].selected = true;
		cmsInput.value = "";
		cmsDivInput.style.display = "none";
	},

	
	allDisabled: function() {
		screenDiv = document.querySelectorAll(".screen");
		if (buttonStart.style.display == "none") {
			screenDiv.forEach((elem) => {
				elem.querySelector("select").disabled = true;
				elem.querySelector("input").disabled = true;
			});
			rollbackInput.disabled = true;
			cmsSelect.disabled = true;
			buttonPlus.disabled = true;
			cmsInput.disabled = true;
			customCheckbox.forEach((elem) => {
				elem.disabled = true;
			});
		} else if (buttonStart.style.display == "block"){
			screenDiv.forEach((elem) => {
				elem.querySelector("select").disabled = false;
				elem.querySelector("input").disabled = false;
			});
			rollbackInput.disabled = false;
			cmsSelect.disabled = false;
			buttonPlus.disabled = false;
			cmsInput.disabled = false;
			customCheckbox.forEach((elem) => {
				elem.disabled = false;
			});
		}
	},

	addServicesPercent: function () { 
		otherItems1.forEach((elem) => {
			const label = elem.querySelector("label").textContent;
			const percent = +elem.querySelector('input[type=text]').value;
			const check = elem.querySelector('input[type=checkbox]');
			 if (check.checked) {
					this.servicesPercent[label] = +percent;
			 }
		});
	},

	addServicesNumber: function() { 
		otherItems2.forEach((elem) => {
			const label = elem.querySelector("label").textContent;
			const number = +elem.querySelector('input[type=text]').value;
			const check = elem.querySelector('input[type=checkbox]');
			 if (check.checked) {
					this.servicesNumber[label] = +number;
			 }
		});
	},

	addScreenBlock: function() {	
		screenDiv = document.querySelectorAll(".screen");
		const clone = screenDiv[0].cloneNode(true);
		screenDiv[screenDiv.length - 1].after(clone);
		clone.querySelector("input").value = "";
	},

	addScreenPrice: function() {
		screenDiv = document.querySelectorAll(".screen");
		screenDiv.forEach((elem, index) => {
			const select = elem.querySelector("select");
			const input = elem.querySelector("input");
			const selectName = select.options[select.selectedIndex].textContent;

			this.screens.push({
				id: index,
				name: selectName,
				price: +input.value * +select.value,
				count: +input.value
			});
		});
	},

	addTitle: function() {
		document.title = title.textContent;
	},

	addPrices: function() { 
		// Подсчет кол-ва экранов
		for(let i = 0; i < this.screens.length; i++) {
			this.screensCount = this.screensCount + this.screens[i].count; 
		}
		// Подсчет суммы экранов
		for (let i = 0; i < this.screens.length; i++){
			this.screenPrice = this.screenPrice +this.screens[i].price;
		}
		//Подсчет доп услуг в руб 
		for (let key in this.servicesNumber) {
				this.serviceNumberPrice += this.servicesNumber[key];	
		}
		// Подсчет суммы доп услуг с %
		for(let key in this.servicesPercent) {
			this.servicePercentPrice += (this.screenPrice * (this.servicesPercent[key]/100));	
		}
		// Подсчет всей суммы
		if (cmsSelect.options[1].selected) {
			this.fullPrice = 
			(this.servicePercentPrice + this.serviceNumberPrice + this.screenPrice) + 
			(this.servicePercentPrice + this.serviceNumberPrice + this.screenPrice) *
			 +cmsSelect.options[1].value / 100;
		} else if (cmsSelect.options[2].selected) {
			this.fullPrice = 
			(this.servicePercentPrice + this.serviceNumberPrice + this.screenPrice) + 
			(this.servicePercentPrice + this.serviceNumberPrice + this.screenPrice) *
			+cmsInput.value / 100;
		} else {
			this.fullPrice = (this.servicePercentPrice + this.serviceNumberPrice + this.screenPrice)
		}
		// Подсчет суммы посредника
		this.agentWorkPrice =  (this.fullPrice * (this.rollback/100));
		// Подсчет стоимости с учетом отката
		this.serviceWorkPercent = this.fullPrice - this.agentWorkPrice;
	},	
// 	logger: () appData
// 		console.log(appData.showTypeOf(appData.title));
// 		console.log(appData.showTypeOf(appData.screens));
// 		console.log(appData.showTypeOf(appData.adaptive));
// 		console.log(appData.screens);
// 		console.log(appData.showSaleMessage(appData.fullPrice));
// 		console.log("Полная стоимость работы округленная до большего числа за вычетом процента отката посреднику за работу = " + appData.servicePercentPrice + "$");
// 		for (let key in appData) {
// 			console.log(key + ": " + appData[key]);
// 		}
// 	}

};

appData.init();
