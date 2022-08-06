
var view = { //Объект для отображения сообщений, статистики боя, попаданий на поле
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		var cell = document.getElementById(location);
		if (cell == null) {
			return;
		}
		cell.setAttribute("class", "miss");
	},
	displayCount: function (count) {
		if (count == "0") {
			var message = document.getElementById("conShot");
			message.innerHTML = "Выстрелы: " + model.countShot;
		} else if (count == "1") {
			var message = document.getElementById("conHit");
			message.innerHTML = "Попадания: " + model.countHit;
			var accracy = model.accCount(model.countHit, model.countShot);
			message2 = document.getElementById("conAcc");
			message2.innerHTML = "Точность: " + accracy + "%";
			model.countAcc = accracy;
		} else {
			var message = document.getElementById("conSnk");
			message.innerHTML = "Потоплено: " + model.countSnk;
		}
	}
};
var model = { //Объект с методами
	nmshi: 10, //Кол-во кораблей
	boardsize: 10, //Размер поля
	countShot: 0, //Кол-во выстрелов
	countHit: 0, //Кол-во попаданий
	countSnk: 0, //Потопленно кораблей
	countAcc: 0, //Точность
	accCount: function (hit, shot) {
		var x = (hit / shot) * 100;
		y = Math.round(x)
		return y;
	},
	//Позиции кораблей
	shis: [{ locations: ["", "", "", ""], hits: ["", "", "", ""], borders: [] },
	{ locations: ["", "", ""], hits: ["", "", ""], borders: [] },
	{ locations: ["", "", ""], hits: ["", "", ""], borders: [] },
	{ locations: ["", ""], hits: ["", ""], borders: [] },
	{ locations: ["", ""], hits: ["", ""], borders: [] },
	{ locations: ["", ""], hits: ["", ""], borders: [] },
	{ locations: [""], hits: [""], borders: [] },
	{ locations: [""], hits: [""], borders: [] },
	{ locations: [""], hits: [""], borders: [] },
	{ locations: [""], hits: [""], borders: [] },],
	fire: function (gess) { //Метод для выстрела
		this.countShot++;
		view.displayCount("0");
		for (i = 0; i < this.nmshi; i++) {
			var shi = this.shis[i];
			index = shi.locations.indexOf(gess);
			if (shi.hits[index] == "hit") {
				return false;
			} else if (index >= 0) {
				shi.hits[index] = "hit";
				view.displayHit(gess);
				view.displayMessage("Есть пробитие!");
				this.countHit++;
				view.displayCount("1");
				if (this.isSnk(shi)) {
					view.displayMessage("Корабль уничтожен!");
					this.countSnk++;
					view.displayCount("2");
					this.borderSnk(shi.locations);
					if (this.countSnk == this.nmshi) {
						alert("Все корабли уничтожены! Твоя точность " + this.countAcc + "%");
					}
				}
				return true;
			}
		}
		view.displayMiss(gess);
		view.displayMessage("Мимо");
		return false;
	},
	isSnk: function (shi) { //Метод для определения потоплен ли корабль
		for (i = 0; i < shi.hits.length; i++) {
			if (shi.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function () { //Метод генерации кораблей
		var locations;
		for (var i = 0; i < this.nmshi; i++) {
			do {
				locationsall = this.generateShip(this.boardsize, this.shis[i].locations.length);
				locations = locationsall[0];
				borders = locationsall[1];
			} while (this.collision(borders)); //генерация продолжается пока позиции разных кораблей не будут совпадать
			this.shis[i].locations = locations;
		}
	},
	generateShip: function (size, lengh) {
		var newShipLocationsAndBorders = [];
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * size) + 1;
			col = Math.floor(Math.random() * (size - lengh)) + 1;
		} else {
			row = Math.floor(Math.random() * (size - lengh)) + 1;
			col = Math.floor(Math.random() * size) + 1;
		}
		var borders = [];
		var newShipLocations = [];
		for (var i = 0; i < lengh; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
				borders.push(row + "" + (col + i));
				borders.push((row + 1) + "" + (col + i));
				borders.push((row - 1) + "" + (col + i));
				borders.push((row + 1) + "" + (col - 1));
				borders.push(row + "" + (col - 1));
				borders.push((row - 1) + "" + (col - 1));
				borders.push((row + 1) + "" + (col + i + 1));
				borders.push(row + "" + (col + i + 1));
				borders.push((row - 1) + "" + (col + i + 1));
			} else {
				newShipLocations.push((row + i) + "" + col);
				borders.push((row + i) + "" + col);
				borders.push((row + i) + "" + (col + 1));
				borders.push((row + i) + "" + (col - 1));
				borders.push((row - 1) + "" + col);
				borders.push((row - 1) + "" + (col + 1));
				borders.push((row - 1) + "" + (col - 1));
				borders.push((row + i + 1) + "" + (col + 1));
				borders.push((row + i + 1) + "" + col);
				borders.push((row + i + 1) + "" + (col - 1));
			}
		}
		newShipLocationsAndBorders[0] = newShipLocations;
		newShipLocationsAndBorders[1] = borders;
		return newShipLocationsAndBorders;
	},
	collision: function (borders) {
		for (var i = 0; i < this.nmshi; i++) {
			var ship = model.shis[i];
			for (var j = 0; j < borders.length; j++) {
				if (ship.locations.indexOf(borders[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	borderSnk: function (shi) { //Метод для отображения границ потопленного корабля
		var bordersSnk = [];
		function borders(cipher1, cipher2) {
			cipher1 = String(cipher1);
			bordersSnk.push(cipher1 + (Number(cipher2) + 1));
			bordersSnk.push(cipher1 + (Number(cipher2) - 1));
			bordersSnk.push(cipher1 + Number(cipher2));
		}
		for (let j = 0; j < shi.length; j++) {
			a = shi[j].toString()[0];
			b = shi[j].toString()[1];
			if (b == 0) {
				b = shi[j].toString()[2];
				a = 10;
			}
			if (shi[j].toString()[3] == 0) {
				a = 10;
				b = 10;
			}
			if (shi[j].toString()[2] == 0){
				b = 10;
			 }
			borders(a, b);
			a = Number(a) + 1;
			borders(a, b);
			a = Number(a) - 2;
			borders(a, b);
		}
		for (k = 0; k < shi.length; k++) {
			for (let m = 0; m < bordersSnk.length; m++) {
				if (shi[k] == bordersSnk[m]) {
					bordersSnk.splice(m, 1);
				}
			}

		}
		for (l = 0; l < bordersSnk.length; l++) {
			view.displayMiss(bordersSnk[l]);
		}
	}
};
//Генерация позиций кораблей при загрузке страницы
function init() {
	model.generateShipLocations();
};

window.onload = init();