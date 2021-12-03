/* 
	Здесь можете найти хеши оружий и т.п.
	https://wiki.rage.mp/index.php?title=Causes_of_death
*/

// Дефолтные проценты, которые мы будем отнимать от входящего урона.
const defaultPercent = {
	"max": 85,
	"min": 60
};

// Список оружий и их процент, который мы будем снимать с входящего урона.
const weaponDamages = {
	// Пистолеты
	// хеш оружия
	3249783761: {
		// Название оружия, это для нас, чтобы в будущем смогли быстро найти нужное нам оружие.
		"name": "Heavy Revolver",
		// Максимальный процент.
		"max": 90,
		// Минимальный процент.
		"min": 80,
		// Эти проценты нужны для функции рандома.
	},
	// Пистолет пулеметы
	324215364: {
		"name": "Micro SMG",
		"max": 80,
		"min": 50
	},
	736523883: {
		"name": "SMG",
		"max": 80,
		"min": 50
	},
	171789620: {
		"name": "Combat PDW",
		"max": 60,
		"min": 40
	},
	// Пулеметы
	2144741730: {
		"name": "Combat MG",
		"max": 65,
		"min": 35
	},
	// Карабины
	3220176749: {
		"name": "Assault Rifle",
		"max": 70,
		"min": 45
	},
	// Дробовики
	487013001: {
		"name": "Pump Shotgun",
		"max": 80,
		"min": 30,
	},
	// Снайперы
	100416529: {
		"name": "Sniper Rifle",
		"max": 80,
		"min": 50,
	},
	// Холодное оружие
	3441901897: {
		"name": "Battle Axe",
		"max": 50,
		"min": 40
	}
};

// Если какое-либо оружие окажется в этом списке, мы не выполним скрипт.
const ignoreWeapons = {
	911657153: "Stun Gun",
};

// Функция генерации рандомного числа в пределах от min до max.
const randomInt = (min, max) => Math.random() * (max - min) + min;

// Событие принятия входящего попадания игроком.
mp._events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
	if (targetEntity.type === 'player' && sourcePlayer && !(weapon in ignoreWeapons)) {

		if (global.adminGodMode) return true;

		let max = defaultPercent.max;
		let min = defaultPercent.min;
		if (weapon in weaponDamages) {
			max = weaponDamages[weapon].max;
			min = weaponDamages[weapon].min;
		}

		let percent = randomInt(min, max) / 100;
		let cDamage = damage - (damage * percent);

		if (boneIndex === 20)
			cDamage = cDamage / 10;

		targetEntity.applyDamageTo(parseInt(cDamage), true);
		const currentHealth = targetEntity.getHealth();

		if (currentHealth > 0) {
			return true;
		}
	}
});
