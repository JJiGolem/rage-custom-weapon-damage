/* 
	#Пока ещё не полностью добил
	#Если найдете ошибки, или недочеты, вы знаете куда писать
	#канал баги-ошибки
	#Система кастомного урона на оружия от JJiGolem#7069

	#Здесь можете найти хеши оружий и т.п.
	https://wiki.rage.mp/index.php?title=Causes_of_death

	#Приватная репозитория на github
	https://github.com/JJiGolem/rage-custom-weapon-damage
*/

//дефолтные проценты, которые мы будем отнимать от входящего урона
let defaultPercent = {"max": 85, "min": 60};

//список оружий и их процент, который мы будем снимать с входящего урона
const weaponDamages = {
	// Пистолеты
	// хеш оружия
	3249783761: {
		//название оружия, это для нас, чтобы в будущем смогли быстро найти нужное нам оружие
		"name": "Heavy Revolver",
		//максимальный процент
		"max": 90,
		//минимальный процент
		"min": 80,
		//эти проценты нужны для функции рандома
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

//Если какое-либо оружие окажется в этом списке, мы не выполним скрипт
const ignoreWeapons = {
	911657153: "Stun Gun",
};

//функция генерации рандомного числа
let randomInt = (min, max) => Math.random() * (max - min) + min;

//Событие принятия входящего попадания игроком
mp._events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
	if(targetEntity.type === 'player' && sourcePlayer && !(weapon in ignoreWeapons)){
		//Если у игрока поставлена админская неуязвимость не выполняем скрипт
		if(global.admingm) return true;
		//Ставим стандартный процент гасения урона
		let max = defaultPercent.max;
		let min = defaultPercent.min;
		//Если оружие, с которого стреляли, есть у нас в списке, то берем его процент гасения
		if(weapon in weaponDamages){
			max = weaponDamages[weapon].max;
			min = weaponDamages[weapon].min;
		}
		//Полученный значения используем для генерации случайного значения в их диапазоне
		let percent = randomInt(min, max)/100;
		//Получаем кастомный урон, который будем применять
		let cDamage = damage - (damage * percent);
		//если попадание в голову, делим урон ещё на 10, дабы уменьшить ещё, так как в голову идет очень большой урон
		if(boneIndex === 20)
			cDamage = cDamage/10;
		//Применяем к игроку полученный урон
		targetEntity.applyDamageTo(parseInt(cDamage), true);
		/* 
		Узнаем сколько здоровья у игрока после урона
        Если игрок не умер, то отменяем стандартное событие
        Если игрок умер, то не отменяем, т.к. если отменим
        То не сработает событие playerDeath как должно
		*/
		let currentHealth = mp.players.local.getHealth();
        //Отменяем стандартное событие
        if(currentHealth > 0) {
            return true;
	}
});
