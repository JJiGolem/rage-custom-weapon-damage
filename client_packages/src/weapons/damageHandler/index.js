const {
	ignoreWeapons,
	damageWeapons
} = require('./src/weapons/damageHandler/settings.js');

// Дефолтные проценты, которые мы будем отнимать от входящего урона.
const defaultPercent = {
	"max": 85,
	"min": 60
};

// Событие принятия входящего урона, нанесенного нам
mp._events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
	if (targetEntity.type === 'player' && sourcePlayer && !(weapon in ignoreWeapons)) {

		if (global.adminGodMode) return true;

		let max = defaultPercent.max;
		let min = defaultPercent.min;

		if (weapon in damageWeapons) {
			max = damageWeapons[weapon].max;
			min = damageWeapons[weapon].min;
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