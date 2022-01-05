const { ignoreWeapons, damageWeapons, damageWeaponGroups } = require('./src/weapons/damageHandler/settings.js');

const defaultPercent = {
	max: 85,
	min: 60
}

const randomInt = (min, max) => Math.random() * (max - min) + min;

mp._events.add("incomingDamage", (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
	if (targetEntity.type === "player" && sourcePlayer && !(weapon in ignoreWeapons)) {
		if (global.adminGodMode)  {
			return true;
		}

		let max = defaultPercent.max;
		let min = defaultPercent.max;

		const weaponGroupHash = mp.game.weapon.getWeapontypeGroup(weapon);
		if (weapon in damageWeapons) {
			max = damageWeapons[weapon].max;
			min = damageWeapons[weapon].min;
		}
		else if (weaponGroupHash in damageWeaponGroups) {
			max = damageWeaponGroups[weaponGroupHash].max;
			min = damageWeaponGroups[weaponGroupHash].min;
		}

		const percent = randomInt(min, max) / 100;
		let customDamage = damage - (damage * percent);

		if (boneIndex === 20) {
			customDamage /= 10;
		}
		
		const currentHealth = targetEntity.getHealth();
		if (currentHealth > 0) {
			return true;
		}
	}
})